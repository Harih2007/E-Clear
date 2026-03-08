import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { DisposalRequestModel, PickupModel } from "../models/mongoose/schemas";
import mongoose from "mongoose";

// Calculate estimated incentive based on item types
const calculateIncentive = (items: any[]) => {
    const baseRates: any = {
        PHONE: { min: 50, max: 200 },
        LAPTOP: { min: 200, max: 800 },
        TABLET: { min: 100, max: 400 },
        BATTERY: { min: 5, max: 20 },
        CHARGER: { min: 10, max: 30 },
        MONITOR: { min: 150, max: 500 },
        OTHER: { min: 20, max: 100 }
    };

    let totalMin = 0;
    let totalMax = 0;

    items.forEach(item => {
        const rate = baseRates[item.type] || baseRates.OTHER;
        totalMin += rate.min * item.quantity;
        totalMax += rate.max * item.quantity;
    });

    return { min: totalMin, max: totalMax };
};

// Check for grouping opportunities in the same area
const checkGroupingOpportunity = async (pincode: string) => {
    const pendingRequests = await DisposalRequestModel.find({
        "location.pincode": pincode,
        status: { $in: ["PENDING", "GROUPING"] }
    });

    return {
        current: pendingRequests.length,
        target: 5,
        canSchedule: pendingRequests.length >= 5
    };
};

// Create Disposal Request (USER only)
export const createDisposalRequest = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "USER") {
            return res.status(403).json({ error: "Only users can create disposal requests" });
        }

        const { items, address, pincode } = req.body;

        // Validate inputs
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Items are required" });
        }
        if (!address || !pincode) {
            return res.status(400).json({ error: "Address and pincode are required" });
        }

        // Check if user already has an active request
        const activeRequest = await DisposalRequestModel.findOne({
            userId: req.user._id,
            status: { $in: ["PENDING", "GROUPING", "ACCEPTED", "SCHEDULED"] }
        });

        if (activeRequest) {
            return res.status(400).json({ 
                error: "You already have an active pickup request. Please wait for it to complete." 
            });
        }

        // Calculate estimated incentive
        const estimatedIncentive = calculateIncentive(items);

        // Find nearest E-Centre
        const { findNearestECentre, findOrCreatePool, updatePoolSummary } = require("./pooling.controller");
        const eCentre = await findNearestECentre(pincode);

        if (!eCentre) {
            return res.status(404).json({ 
                error: "No E-Centre available in your area yet. Please try again later." 
            });
        }

        // Find or create pool
        const pool = await findOrCreatePool(pincode, eCentre._id);

        // Create disposal request
        const disposalRequest = await DisposalRequestModel.create({
            userId: req.user._id,
            eCentreId: eCentre._id,
            poolId: pool._id,
            items,
            location: { address, pincode },
            status: pool.currentCount > 0 ? "GROUPING" : "PENDING",
            estimatedIncentive,
            groupingProgress: {
                current: pool.currentCount + 1,
                target: pool.maxCapacity
            }
        });

        // Add request to pool
        pool.requestIds.push(disposalRequest._id);
        pool.currentCount += 1;
        await pool.save();

        // Update pool summary
        await updatePoolSummary(pool._id);

        // Update all requests in pool with new grouping progress
        await DisposalRequestModel.updateMany(
            { poolId: pool._id },
            { 
                status: pool.currentCount >= 2 ? "GROUPING" : "PENDING",
                groupingProgress: {
                    current: pool.currentCount,
                    target: pool.maxCapacity
                }
            }
        );

        res.status(201).json({
            success: true,
            message: "Request sent to nearest E-Centre",
            data: {
                requestId: disposalRequest._id,
                eCentreName: eCentre.name,
                poolStatus: {
                    current: pool.currentCount,
                    target: pool.maxCapacity
                },
                status: disposalRequest.status,
                estimatedIncentive
            }
        });
    } catch (error: any) {
        console.error("Create disposal request error:", error);
        res.status(500).json({ error: "Failed to create disposal request" });
    }
};

// Get User's Disposal Requests
export const getUserRequests = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "USER") {
            return res.status(403).json({ error: "Access denied" });
        }

        const requests = await DisposalRequestModel.find({ 
            userId: req.user._id 
        }).sort({ createdAt: -1 });

        res.json({ success: true, data: requests });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get Single Disposal Request (with privacy checks)
export const getDisposalRequest = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const request = await DisposalRequestModel.findById(id);

        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }

        // Privacy check: Users can only see their own requests
        if (req.user?.role === "USER" && request.userId.toString() !== req.user._id) {
            return res.status(403).json({ error: "Access denied" });
        }

        // E-Centres can only see scheduled requests assigned to them
        if (req.user?.role === "ECENTRE") {
            if (!request.scheduledPickupId) {
                return res.status(403).json({ error: "Request not yet scheduled" });
            }

            const pickup = await PickupModel.findById(request.scheduledPickupId);
            if (!pickup || pickup.eCentreId.toString() !== req.user._id) {
                return res.status(403).json({ error: "Access denied" });
            }
        }

        res.json({ success: true, data: request });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update Disposal Request Status (E-Centre only)
export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ECENTRE") {
            return res.status(403).json({ error: "Only E-Centres can update request status" });
        }

        const { id } = req.params;
        const { status, actualIncentive } = req.body;

        const request = await DisposalRequestModel.findById(id);

        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }

        // Verify E-Centre has access to this request
        if (request.scheduledPickupId) {
            const pickup = await PickupModel.findById(request.scheduledPickupId);
            if (!pickup || pickup.eCentreId.toString() !== req.user._id) {
                return res.status(403).json({ error: "Access denied" });
            }
        }

        // Update request
        request.status = status;
        if (actualIncentive !== undefined) {
            request.actualIncentive = actualIncentive;
        }
        request.updatedAt = new Date();

        await request.save();

        res.json({ success: true, data: request });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get Grouping Status for Area (USER only)
export const getGroupingStatus = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "USER") {
            return res.status(403).json({ error: "Access denied" });
        }

        const { pincode } = req.params;

        if (!pincode || typeof pincode !== "string") {
            return res.status(400).json({ error: "Valid pincode is required" });
        }

        const groupingInfo = await checkGroupingOpportunity(pincode);

        res.json({ success: true, data: groupingInfo });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};


// Get All Disposal Requests (E-Centre only)
export const getAllRequests = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ECENTRE") {
            return res.status(403).json({ 
                success: false,
                error: "Only E-Centres can view all requests" 
            });
        }

        // In a real app, filter by E-Centre's service areas
        // For now, return all requests
        const requests = await DisposalRequestModel.find({})
            .sort({ createdAt: -1 })
            .limit(100);

        res.json({ 
            success: true, 
            data: requests 
        });
    } catch (error: any) {
        console.error("Get all requests error:", error);
        res.status(500).json({ 
            success: false,
            error: "Failed to fetch requests" 
        });
    }
};
