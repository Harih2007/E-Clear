import { Request, Response } from "express";
import { DropOffService } from "../services/dropoff.service";

export const getDropOffPoints = (req: Request, res: Response) => {
    const points = DropOffService.getAllPoints();
    res.json({ success: true, data: points });
};
