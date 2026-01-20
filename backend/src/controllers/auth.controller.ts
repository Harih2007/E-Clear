import { Request, Response } from "express";
import { UserModel } from "../models/mongoose/schemas";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, zipCode } = req.body;

        // Check if user exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            role: role || "USER",
            location: { zipCode }
        });

        // Create Token
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || "secret");

        res.status(201).json({ success: true, token, user: { _id: user._id, name: user.name, role: user.role } });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user: any = await UserModel.findOne({ email });
        if (!user) return res.status(400).json({ error: "Email not found" });

        // Validate password
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ error: "Invalid Password" });

        // Create Token
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || "secret");

        res.json({ success: true, token, user: { _id: user._id, name: user.name, role: user.role } });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};
