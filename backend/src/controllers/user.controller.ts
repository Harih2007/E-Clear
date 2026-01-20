import { Request, Response } from "express";
import { UserModel } from "../models/mongoose/schemas";

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, role, zipCode } = req.body;
        const user = await UserModel.create({
            name,
            email,
            role: role || "USER",
            location: { zipCode }
        });
        res.status(201).json({ success: true, data: user });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};
