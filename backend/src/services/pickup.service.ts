import { PickupModel, DisposalRequestModel, UserModel } from "../models/mongoose/schemas";

export class PickupService {

    /**
     * Checks for aggregation opportunities in a specific area.
     * If >= 5 pending requests exist in a zipCode, schedule a shared pickup.
     */
    static async checkAndSchedulePickup(zipCode: string) {
        // Find pending requests in this Zip Code
        const pendingRequests = await DisposalRequestModel.find({
            "location.zipCode": zipCode,
            status: "PENDING"
        });

        if (pendingRequests.length >= 5) {
            console.log(`[PickupService] Micro-pickup triggered for Zip ${zipCode}. Found ${pendingRequests.length} requests.`);

            const requestsToSchedule = pendingRequests.slice(0, 5); // Take first 5
            const requestIds = requestsToSchedule.map(r => r._id);

            // Create Pickup
            const pickup = await PickupModel.create({
                requestIds,
                zipCode,
                status: "PENDING",
                scheduledDate: new Date()
            });

            // Update Requests
            await DisposalRequestModel.updateMany(
                { _id: { $in: requestIds } },
                { status: "SCHEDULED", scheduledPickupId: pickup._id }
            );

            return pickup;
        }

        return null;
    }

    static async confirmPickup(pickupId: string): Promise<boolean> {
        const pickup = await PickupModel.findById(pickupId);
        if (!pickup) return false;

        pickup.status = "COMPLETED";
        await pickup.save();

        // Release rewards
        const requests = await DisposalRequestModel.find({ _id: { $in: pickup.requestIds } });

        for (const req of requests) {
            req.status = "COLLECTED";
            await req.save();

            if (req.userId) {
                await UserModel.findByIdAndUpdate(req.userId, { $inc: { points: req.totalIncentive } });
                console.log(`[PickupService] Awarded ${req.totalIncentive} points to user ${req.userId}`);
            }
        }

        return true;
    }

    static async getPickups(filter: any) {
        return PickupModel.find(filter).populate("requestIds");
    }
}
