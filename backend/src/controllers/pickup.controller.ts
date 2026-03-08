import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { PickupModel, DisposalRequestModel, UserModel, ECentreModel } from "../models/mongoose/schemas";

// Create Pickup (E-Centre or System)
export const createPickup = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ECENTRE" && req.user?.role !== "ADMIN") {
            return res.status(403).json({ error: "Access denied" });
        }

        const { requestIds, pincode, scheduledDate, scheduledTimeWindow, vehicleType } = req.body;

        // Validate request IDs
        if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
            return res.status(400).json({ error: "Request IDs are required" });
        }

        // Get all requests
        const requests = await DisposalRequestModel.find({
            _id: { $in: requestIds },
            status: { $in: ["GROUPING", "PENDING"] }
        });

        if (requests.length === 0) {
            return res.status(400).json({ error: "No valid requests found" });
        }

        // Calculate items summary
        const itemsSummary: any = {};
        requests.forEach(req => {
            req.items.forEach(item => {
                if (!itemsSummary[item.type]) {
                    itemsSummary[item.type] = 0;
                }
                itemsSummary[item.type] += item.quantity;
            });
        });

        const itemsSummaryArray = Object.keys(itemsSummary).map(type => ({
            type,
            quantity: itemsSummary[type]
        }));

        // Get coordinates from first request
        const coordinates = requests[0].location.coordinates || { lat: 0, lng: 0 };

        // Create pickup
        const pickup = await PickupModel.create({
            eCentreId: req.user._id,
            requestIds,
            area: {
                pincode,
                coordinates,
                radius: 2
            },
            status: scheduledDate ? "SCHEDULED" : "PENDING",
            scheduledDate: scheduledDate || undefined,
            scheduledTimeWindow: scheduledTimeWindow || undefined,
            vehicleType: vehicleType || "TWO_WHEELER",
            itemsSummary: itemsSummaryArray,
            householdCount: requests.length
        });

        // Update all requests to SCHEDULED
        await DisposalRequestModel.updateMany(
            { _id: { $in: requestIds } },
            { 
                status: "SCHEDULED",
                scheduledPickupId: pickup._id
            }
        );

        res.status(201).json({ success: true, data: pickup });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get E-Centre's Pickups
export const getECentrePickups = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ECENTRE") {
            return res.status(403).json({ error: "Access denied" });
        }

        const { status } = req.query;

        const query: any = { eCentreId: req.user._id };
        if (status) {
            query.status = status;
        }

        const pickups = await PickupModel.find(query)
            .populate({
                path: "requestIds",
                select: "items location status estimatedIncentive"
            })
            .sort({ createdAt: -1 });

        res.json({ success: true, data: pickups });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get Pickup Details with Full Addresses (E-Centre only, only for scheduled pickups)
export const getPickupDetails = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ECENTRE") {
            return res.status(403).json({ error: "Access denied" });
        }

        const { id } = req.params;

        const pickup = await PickupModel.findById(id)
            .populate({
                path: "requestIds",
                populate: {
                    path: "userId",
                    select: "name phoneNumber location"
                }
            });

        if (!pickup) {
            return res.status(404).json({ error: "Pickup not found" });
        }

        // Verify E-Centre owns this pickup
        if (pickup.eCentreId.toString() !== req.user._id) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Only show full addresses if pickup is scheduled
        if (pickup.status === "PENDING") {
            return res.status(403).json({ 
                error: "Full addresses only available for scheduled pickups" 
            });
        }

        res.json({ success: true, data: pickup });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update Pickup Status
export const updatePickupStatus = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ECENTRE") {
            return res.status(403).json({ error: "Access denied" });
        }

        const { id } = req.params;
        const { status } = req.body;

        const pickup = await PickupModel.findById(id);

        if (!pickup) {
            return res.status(404).json({ error: "Pickup not found" });
        }

        // Verify E-Centre owns this pickup
        if (pickup.eCentreId.toString() !== req.user._id) {
            return res.status(403).json({ error: "Access denied" });
        }

        pickup.status = status;

        if (status === "COMPLETED") {
            pickup.completedAt = new Date();

            // Update all associated requests to COLLECTED
            await DisposalRequestModel.updateMany(
                { _id: { $in: pickup.requestIds } },
                { status: "COLLECTED" }
            );

            // Update E-Centre stats
            await ECentreModel.findByIdAndUpdate(
                req.user._id,
                { $inc: { completedPickups: 1 } }
            );
        }

        await pickup.save();

        res.json({ success: true, data: pickup });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Confirm Pickup and Release Incentives
export const confirmPickupAndReleaseIncentives = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ECENTRE") {
            return res.status(403).json({ error: "Access denied" });
        }

        const { id } = req.params;
        const { itemsCollected } = req.body; // Array of { requestId, actualIncentive }

        const pickup = await PickupModel.findById(id);

        if (!pickup) {
            return res.status(404).json({ error: "Pickup not found" });
        }

        // Verify E-Centre owns this pickup
        if (pickup.eCentreId.toString() !== req.user._id) {
            return res.status(403).json({ error: "Access denied" });
        }

        // Update pickup status
        pickup.status = "COMPLETED";
        pickup.completedAt = new Date();
        await pickup.save();

        // Update requests and award points
        for (const item of itemsCollected) {
            const request = await DisposalRequestModel.findById(item.requestId);
            if (request) {
                request.status = "COLLECTED";
                request.actualIncentive = item.actualIncentive;
                await request.save();

                // Award points to user
                await UserModel.findByIdAndUpdate(
                    request.userId,
                    { 
                        $inc: { points: item.actualIncentive },
                        $push: { pickupHistory: request._id }
                    }
                );
            }
        }

        // Update E-Centre stats
        await ECentreModel.findByIdAndUpdate(
            req.user._id,
            { $inc: { completedPickups: 1 } }
        );

        res.json({ 
            success: true, 
            message: "Pickup confirmed and incentives released",
            data: pickup 
        });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get Available Pickup Clusters (E-Centre view)
export const getAvailablePickupClusters = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "ECENTRE") {
            return res.status(403).json({ error: "Access denied" });
        }

        // Get E-Centre's service areas
        const eCentre = await ECentreModel.findById(req.user._id);
        if (!eCentre) {
            return res.status(404).json({ error: "E-Centre not found" });
        }

        // Find grouping requests in service areas
        const clusters = await DisposalRequestModel.aggregate([
            {
                $match: {
                    status: { $in: ["GROUPING", "PENDING"] },
                    "location.pincode": { $in: eCentre.serviceAreas }
                }
            },
            {
                $group: {
                    _id: "$location.pincode",
                    count: { $sum: 1 },
                    requests: { $push: "$_id" },
                    items: { $push: "$items" }
                }
            },
            {
                $match: {
                    count: { $gte: 3 } // Show clusters with at least 3 requests
                }
            }
        ]);

        res.json({ success: true, data: clusters });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get Nearby E-Centres (USER view)
export const getNearbyECentres = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== "USER") {
            return res.status(403).json({ error: "Access denied" });
        }

        const { pincode } = req.query;

        const query: any = { verified: true };
        if (pincode) {
            query.serviceAreas = pincode;
        }

        // Only return limited info for users
        const eCentres = await ECentreModel.find(query)
            .select("name location.address location.coordinates rating completedPickups")
            .limit(10);

        res.json({ success: true, data: eCentres });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};
