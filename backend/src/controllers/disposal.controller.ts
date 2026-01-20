import { Request, Response } from "express";
import { disposalSchema } from "../models/validation";
import { DisposalService } from "../services/disposal.service";

export const createDisposalRequest = async (req: Request, res: Response) => {
    try {
        const validatedData = disposalSchema.parse(req.body);
        const request = await DisposalService.createRequest(
            validatedData.userId,
            validatedData.items,
            validatedData.location
        );
        res.status(201).json({ success: true, data: request });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message || error });
    }
};

export const getUserRequests = (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const requests = DisposalService.getRequestsByUser(userId);
    res.json({ success: true, data: requests });
};
