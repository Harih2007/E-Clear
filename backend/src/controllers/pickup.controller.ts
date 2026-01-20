import { Request, Response } from "express";
import { PickupService } from "../services/pickup.service";

export const triggerPickupCheck = async (req: Request, res: Response) => {
    const { zipCode } = req.body;
    if (!zipCode) return res.status(400).json({ error: "ZipCode required" });

    const pickup = await PickupService.checkAndSchedulePickup(zipCode);
    if (pickup) {
        res.json({ success: true, message: "Pickup scheduled", data: pickup });
    } else {
        res.json({ success: true, message: "Not enough pending requests for aggregation yet." });
    }
};

export const confirmPickup = async (req: Request, res: Response) => {
    const { pickupId } = req.body;
    if (!pickupId) return res.status(400).json({ error: "PickupId required" });

    const success = await PickupService.confirmPickup(pickupId);
    if (success) {
        res.json({ success: true, message: "Pickup confirmed and rewards distributed." });
    } else {
        res.status(404).json({ error: "Pickup not found" });
    }
};

export const getPickups = async (req: Request, res: Response) => {
    const { status, zipCode } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    if (zipCode) filter.zipCode = zipCode;

    const pickups = await PickupService.getPickups(filter);
    res.json({ success: true, data: pickups });
};
