import { DisposalRequestModel, UserModel } from "../models/mongoose/schemas";
import { DisposalItem } from "../models/types"; // Keeping Types for input
import { PickupService } from "./pickup.service";

export class DisposalService {

    static calculateIncentive(items: DisposalItem[]): number {
        return items.reduce((total, item) => {
            let points = 0;
            switch (item.type) {
                case "LAPTOP": points = 500; break;
                case "MOBILE": points = 200; break;
                case "BATTERY": points = 10; break;
                default: points = 50;
            }
            return total + (points * item.quantity);
        }, 0);
    }

    static async createRequest(userId: string, items: DisposalItem[], location: { address: string, zipCode: string }) {
        const incentive = this.calculateIncentive(items);

        // Create Request
        const request = await DisposalRequestModel.create({
            userId,
            items,
            location,
            status: "PENDING",
            totalIncentive: incentive
        });

        console.log(`[DisposalService] Created request ${request._id} for User ${userId}. Points: ${incentive}`);

        // Trigger Micro-pickup check
        await PickupService.checkAndSchedulePickup(location.zipCode);

        return request;
    }

    static async getRequestsByUser(userId: string) {
        return DisposalRequestModel.find({ userId });
    }
}
