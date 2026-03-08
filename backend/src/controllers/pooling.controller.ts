import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { DisposalRequestModel, PickupPoolModel, ECentreModel, PickupModel, UserModel } from "../models/mongoose/schemas";
import mongoose from "mongoose";

// Find nearest E-Centre for a given pincode
const findNearestECentre = async (pincode: string) => {
    // First, try to find E-Centre that services this pincode
    let eCentre = await ECentreModel.findOne({
        serviceAreas: pincode,
        verified: true
    }).sort({ completedPickups: -1 }); // Prefer experienced centres

    // If no E-Centre services this pincode, find any verified E-Centre
    if (!eCentre) {
        eCentre = await ECentreModel.findOne({
            verified: true
        }).sort({ completedPickups: -1 });
    }

    return eCentre;
};

// Find or create pool for a pincode and E-Centre
const findOrCreatePool = async (pincode: string, eCentreId: mongoose.Types.ObjectId) => {
    // Look for an OPEN pool in this area
    let pool = await PickupPoolModel.findOne({
        eCentreId,
        area: pincode,
        status: "OPEN",
        currentCount: { $lt: 5 } // Not full
    });

    // If no pool exists, create one
    if (!pool) {
        pool = await PickupPoolModel.create({
            eCentreId,
            area: pincode,
            requestIds: [],
            maxCapacity: 5,
            currentCount: 0,
            status: "OPEN",
            itemsSummary: []
        });
    }

    return pool;
};

// Update pool items summary
const updatePoolSummary = async (poolId: mongoose.Types.ObjectId) => {
    const pool = await PickupPoolModel.findById(poolId).populate('requestIds');
    if (!pool) return;

    const itemsMap: { [key: string]: number } = {};
    
    for (const requestId of pool.requestIds) {
        const request = await DisposalRequestModel.findById(requestId);
        if (request) {
            request.items.forEach(item => {
                itemsMap[item.type] = (itemsMap[item.type] || 0) + item.quantity;
            });
        }
    }

    const itemsSummary = Object.entries(itemsMap).map(([type, quantity]) => ({
        type,
        quantity
    }));

    pool.itemsSummary = itemsSummary;
    await pool.save();
};

// Get E-Centre's Pools
export const getMyPools = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ECENTRE") {
            return res.status(403).json({ 
                success: false,
                error: "Only E-Centres can view pools" 
            });
        }

        const pools = await PickupPoolModel.find({
            eCentreId: req.user._id
        })
        .populate('requestIds')
        .sort({ createdAt: -1 });

        // Group by status
        const openPools = pools.filter(p => p.status === "OPEN");
        const acceptedPools = pools.filter(p => p.status === "ACCEPTED");
        const scheduledPools = pools.filter(p => p.status === "SCHEDULED");
        const collectedPools = pools.filter(p => p.status === "COLLECTED");

        res.json({ 
            success: true, 
            data: {
                openPools,
                acceptedPools,
                scheduledPools,
                collectedPools
            }
        });
    } catch (error: any) {
        console.error("Get pools error:", error);
        res.status(500).json({ 
            success: false,
            error: "Failed to fetch pools" 
        });
    }
};

// Accept a Pool
export const acceptPool = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ECENTRE") {
            return res.status(403).json({ 
                success: false,
                error: "Only E-Centres can accept pools" 
            });
        }

        const { poolId } = req.params;

        const pool = await PickupPoolModel.findById(poolId);
        if (!pool) {
            return res.status(404).json({ 
                success: false,
                error: "Pool not found" 
            });
        }

        // Verify pool belongs to this E-Centre
        if (pool.eCentreId.toString() !== req.user._id) {
            return res.status(403).json({ 
                success: false,
                error: "You can only accept your own pools" 
            });
        }

        // Verify pool is OPEN
        if (pool.status !== "OPEN") {
            return res.status(400).json({ 
                success: false,
                error: `Pool is already ${pool.status}` 
            });
        }

        // Update pool status
        pool.status = "ACCEPTED";
        await pool.save();

        // Update all requests in pool
        await DisposalRequestModel.updateMany(
            { _id: { $in: pool.requestIds } },
            { status: "ACCEPTED" }
        );

        res.json({ 
            success: true, 
            message: "Pool accepted successfully",
            data: {
                poolId: pool._id,
                requestCount: pool.currentCount,
                status: pool.status
            }
        });
    } catch (error: any) {
        console.error("Accept pool error:", error);
        res.status(500).json({ 
            success: false,
            error: "Failed to accept pool" 
        });
    }
};

// Schedule Pickup for Pool
export const schedulePool = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ECENTRE") {
            return res.status(403).json({ 
                success: false,
                error: "Only E-Centres can schedule pickups" 
            });
        }

        const { poolId } = req.params;
        const { scheduledDate, timeWindow } = req.body;

        if (!scheduledDate || !timeWindow) {
            return res.status(400).json({ 
                success: false,
                error: "Scheduled date and time window are required" 
            });
        }

        const pool = await PickupPoolModel.findById(poolId);
        if (!pool) {
            return res.status(404).json({ 
                success: false,
                error: "Pool not found" 
            });
        }

        // Verify pool belongs to this E-Centre
        if (pool.eCentreId.toString() !== req.user._id) {
            return res.status(403).json({ 
                success: false,
                error: "You can only schedule your own pools" 
            });
        }

        // Verify pool is ACCEPTED
        if (pool.status !== "ACCEPTED") {
            return res.status(400).json({ 
                success: false,
                error: `Pool must be ACCEPTED before scheduling (current: ${pool.status})` 
            });
        }

        // Create Pickup document
        const pickup = await PickupModel.create({
            eCentreId: pool.eCentreId,
            requestIds: pool.requestIds,
            area: {
                pincode: pool.area,
                coordinates: { lat: 0, lng: 0 }, // TODO: Calculate from requests
                radius: 2
            },
            status: "SCHEDULED",
            scheduledDate: new Date(scheduledDate),
            scheduledTimeWindow: timeWindow,
            vehicleType: pool.currentCount <= 3 ? "TWO_WHEELER" : "SMALL_VEHICLE",
            itemsSummary: pool.itemsSummary,
            householdCount: pool.currentCount
        });

        // Update pool status
        pool.status = "SCHEDULED";
        await pool.save();

        // Update all requests in pool
        await DisposalRequestModel.updateMany(
            { _id: { $in: pool.requestIds } },
            { 
                status: "SCHEDULED",
                scheduledPickupId: pickup._id
            }
        );

        res.json({ 
            success: true, 
            message: "Pickup scheduled successfully",
            data: {
                poolId: pool._id,
                pickupId: pickup._id,
                scheduledDate,
                timeWindow,
                requestCount: pool.currentCount
            }
        });
    } catch (error: any) {
        console.error("Schedule pool error:", error);
        res.status(500).json({ 
            success: false,
            error: "Failed to schedule pickup" 
        });
    }
};

// Complete Pickup (Mark as Collected)
export const completePool = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ECENTRE") {
            return res.status(403).json({ 
                success: false,
                error: "Only E-Centres can complete pickups" 
            });
        }

        const { poolId } = req.params;

        const pool = await PickupPoolModel.findById(poolId);
        if (!pool) {
            return res.status(404).json({ 
                success: false,
                error: "Pool not found" 
            });
        }

        // Verify pool belongs to this E-Centre
        if (pool.eCentreId.toString() !== req.user._id) {
            return res.status(403).json({ 
                success: false,
                error: "You can only complete your own pools" 
            });
        }

        // Verify pool is SCHEDULED
        if (pool.status !== "SCHEDULED") {
            return res.status(400).json({ 
                success: false,
                error: `Pool must be SCHEDULED before completing (current: ${pool.status})` 
            });
        }

        // Update pool status
        pool.status = "COLLECTED";
        await pool.save();

        // Update all requests and award points
        const requests = await DisposalRequestModel.find({ _id: { $in: pool.requestIds } });
        
        for (const request of requests) {
            request.status = "COLLECTED";
            
            // Calculate actual incentive (use average of estimate)
            const avgIncentive = Math.floor((request.estimatedIncentive.min + request.estimatedIncentive.max) / 2);
            request.actualIncentive = avgIncentive;
            await request.save();

            // Award points to user
            await UserModel.findByIdAndUpdate(
                request.userId,
                { 
                    $inc: { points: avgIncentive },
                    $push: { pickupHistory: request._id }
                }
            );
        }

        // Update E-Centre stats
        await ECentreModel.findByIdAndUpdate(
            pool.eCentreId,
            { $inc: { completedPickups: 1 } }
        );

        // Update Pickup document
        await PickupModel.findOneAndUpdate(
            { requestIds: { $in: pool.requestIds } },
            { 
                status: "COMPLETED",
                completedAt: new Date()
            }
        );

        res.json({ 
            success: true, 
            message: "Pickup completed successfully",
            data: {
                poolId: pool._id,
                requestCount: pool.currentCount,
                pointsAwarded: requests.reduce((sum, r) => sum + (r.actualIncentive || 0), 0)
            }
        });
    } catch (error: any) {
        console.error("Complete pool error:", error);
        res.status(500).json({ 
            success: false,
            error: "Failed to complete pickup" 
        });
    }
};

// Export helper functions for use in disposal controller
export { findNearestECentre, findOrCreatePool, updatePoolSummary };
