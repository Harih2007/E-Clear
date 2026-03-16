import { Request, Response } from "express";
import { supabase } from "../config/supabase";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("FATAL: JWT_SECRET environment variable is not set!");
    }
    return secret;
};
const JWT_EXPIRES_IN = "7d";

// Validate email format
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// User Registration
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phoneNumber, address, pincode } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: "Name, email, and password are required" });
        }
        if (name.trim().length < 2) {
            return res.status(400).json({ success: false, error: "Name must be at least 2 characters long" });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ success: false, error: "Please enter a valid email address" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, error: "Password must be at least 8 characters long" });
        }

        // Check if user exists
        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('email', email.toLowerCase().trim())
            .single();

        if (existing) {
            return res.status(400).json({ success: false, error: "Email already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const { data: user, error } = await supabase
            .from('users')
            .insert({
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                role: "USER",
                phone_number: phoneNumber || null,
                location_address: address || "",
                location_pincode: pincode || "",
                points: 0
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return res.status(400).json({ success: false, error: "Email already exists" });
            }
            throw error;
        }

        const token = jwt.sign(
            { _id: user.id, role: user.role, email: user.email },
            getJwtSecret(),
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                points: user.points,
                location: { address: user.location_address, pincode: user.location_pincode }
            }
        });
    } catch (error: any) {
        console.error("Registration error:", error);
        res.status(500).json({ success: false, error: "Registration failed. Please try again." });
    }
};

// E-Centre Registration
export const registerECentre = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phoneNumber, address, coordinates, licenseNumber, serviceAreas } = req.body;

        if (!name || !email || !password || !phoneNumber || !address || !licenseNumber) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ success: false, error: "Please enter a valid email address" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, error: "Password must be at least 8 characters long" });
        }

        const { data: existing } = await supabase
            .from('ecentres')
            .select('id')
            .eq('email', email.toLowerCase().trim())
            .single();

        if (existing) {
            return res.status(400).json({ success: false, error: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const { data: eCentre, error } = await supabase
            .from('ecentres')
            .insert({
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                phone_number: phoneNumber,
                location_address: address,
                location_lat: coordinates?.lat || 0,
                location_lng: coordinates?.lng || 0,
                license_number: licenseNumber,
                service_areas: serviceAreas || [],
                verified: false,
                capacity: 100,
                completed_pickups: 0,
                rating: 5.0
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return res.status(400).json({ success: false, error: "Email already exists" });
            }
            throw error;
        }

        const token = jwt.sign(
            { _id: eCentre.id, role: "ECENTRE", email: eCentre.email },
            getJwtSecret(),
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: eCentre.id,
                name: eCentre.name,
                email: eCentre.email,
                role: "ECENTRE",
                verified: eCentre.verified,
                location: { address: eCentre.location_address, coordinates: { lat: eCentre.location_lat, lng: eCentre.location_lng } }
            }
        });
    } catch (error: any) {
        console.error("E-Centre registration error:", error);
        res.status(500).json({ success: false, error: "Registration failed. Please try again." });
    }
};

// Universal Login
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;

        console.log('🔐 Login attempt:', { email, role, hasPassword: !!password });

        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Email and password are required" });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ success: false, error: "Please enter a valid email address" });
        }

        let user: any = null;
        let userRole: string = "USER";

        // Search in Users table
        const { data: foundUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase().trim())
            .single();

        if (foundUser) {
            user = foundUser;
            userRole = foundUser.role;
        } else {
            // Try E-Centres table
            const { data: foundECentre } = await supabase
                .from('ecentres')
                .select('*')
                .eq('email', email.toLowerCase().trim())
                .single();

            if (foundECentre) {
                user = foundECentre;
                userRole = "ECENTRE";
            }
        }

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        if (role && userRole !== role) {
            return res.status(403).json({ success: false, message: "Invalid credentials for this role" });
        }

        const token = jwt.sign(
            { _id: user.id, role: userRole, email: user.email },
            getJwtSecret(),
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            success: true,
            token,
            user: {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: userRole,
                points: user.points || 0,
                location: userRole === "ECENTRE"
                    ? { address: user.location_address, coordinates: { lat: user.location_lat, lng: user.location_lng } }
                    : { address: user.location_address, pincode: user.location_pincode },
                verified: user.verified
            }
        });
    } catch (error: any) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, error: "Login failed. Please try again." });
    }
};

// Update User Location
export const updateLocation = async (req: Request, res: Response) => {
    try {
        const { lat, lng } = req.body;
        if (!lat || !lng) {
            return res.status(400).json({ success: false, error: "lat and lng are required" });
        }

        const authReq = req as any;
        if (!authReq.user?._id) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }

        await supabase
            .from('users')
            .update({
                last_known_lat: parseFloat(lat),
                last_known_lng: parseFloat(lng),
                last_known_location_updated_at: new Date().toISOString()
            })
            .eq('id', authReq.user._id);

        res.json({ success: true, message: "Location updated" });
    } catch (error: any) {
        console.error("Update location error:", error);
        res.status(500).json({ success: false, error: "Failed to update location" });
    }
};