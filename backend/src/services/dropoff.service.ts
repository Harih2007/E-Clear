import { DropOffPointModel, UserModel } from "../models/mongoose/schemas";

export class DropOffService {

    static async getAllPoints() {
        return DropOffPointModel.find({});
    }

    static async getAvailablePoints() {
        return DropOffPointModel.find({ active: true, $expr: { $lt: ["$currentLoad", "$capacity"] } });
    }

    static async addDropOff(userId: string, pointId: string, volume: number): Promise<boolean> {
        const point = await DropOffPointModel.findById(pointId);
        if (!point) throw new Error("Point not found");

        if (point.currentLoad + volume > point.capacity) {
            throw new Error("Drop-off point is at full capacity");
        }

        point.currentLoad += volume;
        await point.save();

        // Update user points
        const points = volume * 10;
        await UserModel.findByIdAndUpdate(userId, { $inc: { points: points } });

        return true;
    }
}
