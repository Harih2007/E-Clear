import { Request, Response } from "express";
import { UserModel, ECentreModel } from "../models/mongoose/schemas";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_change_me_in_prod";
const JWT_EXPIRES_IN = "7d";

// Check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Validate email format
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// User Registration
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phoneNumber, address, pincode } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                error: "Name, email, and password are required" 
            });
        }

        // Validate name length
        if (name.trim().length < 2) {
            return res.status(400).json({ 
                success: false,
                error: "Name must be at least 2 characters long" 
            });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ 
                success: false,
                error: "Please enter a valid email address" 
            });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({ 
                success: false,
                error: "Password must be at least 8 characters long" 
            });
        }

        // Check MongoDB connection
        if (!isMongoConnected()) {
            return res.status(503).json({ 
                success: false,
                error: "Database connection unavailable. Please try again later." 
            });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ 
            email: email.toLowerCase().trim() 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                error: "Email already exists" 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await UserModel.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: "USER",
            phoneNumber: phoneNumber || undefined,
            location: { 
                address: address || "", 
                pincode: pincode || "" 
            },
            points: 0,
            pickupHistory: []
        });

        // Create JWT token
        const token = jwt.sign(
            { 
                _id: user._id.toString(), 
                role: user.role,
                email: user.email
            }, 
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Return success response
        res.status(201).json({ 
            success: true, 
            token, 
            user: { 
                _id: user._id, 
                name: user.name, 
                email: user.email,
                role: user.role,
                points: user.points,
                location: user.location
            } 
        });
    } catch (error: any) {
        console.error("Registration error:", error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false,
                error: "Email already exists" 
            });
        }
        
        // Handle validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return res.status(400).json({ 
                success: false,
                error: messages[0] || "Validation failed" 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            error: "Registration failed. Please try again." 
        });
    }
};

// E-Centre Registration
export const registerECentre = async (req: Request, res: Response) => {
    try {
        const { 
            name, 
            email, 
            password, 
            phoneNumber, 
            address, 
            coordinates,
            licenseNumber,
            serviceAreas 
        } = req.body;

        // Validate required fields
        if (!name || !email || !password || !phoneNumber || !address || !licenseNumber) {
            return res.status(400).json({ 
                success: false,
                error: "All fields are required (name, email, password, phone, address, license)" 
            });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ 
                success: false,
                error: "Please enter a valid email address" 
            });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({ 
                success: false,
                error: "Password must be at least 8 characters long" 
            });
        }

        // Check MongoDB connection
        if (!isMongoConnected()) {
            return res.status(503).json({ 
                success: false,
                error: "Database connection unavailable. Please try again later." 
            });
        }

        // Check if E-Centre already exists
        const existingECentre = await ECentreModel.findOne({ 
            email: email.toLowerCase().trim() 
        });
        
        if (existingECentre) {
            return res.status(400).json({ 
                success: false,
                error: "Email already exists" 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create E-Centre
        const eCentre = await ECentreModel.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            phoneNumber,
            location: {
                address,
                coordinates: coordinates || { lat: 0, lng: 0 }
            },
            licenseNumber,
            serviceAreas: serviceAreas || [],
            verified: false,
            capacity: 100,
            completedPickups: 0,
            rating: 5.0
        });

        // Create JWT token
        const token = jwt.sign(
            { 
                _id: eCentre._id.toString(), 
                role: "ECENTRE",
                email: eCentre.email
            }, 
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Return success response
        res.status(201).json({ 
            success: true, 
            token, 
            user: { 
                _id: eCentre._id, 
                name: eCentre.name, 
                email: eCentre.email,
                role: "ECENTRE",
                verified: eCentre.verified,
                location: eCentre.location
            } 
        });
    } catch (error: any) {
        console.error("E-Centre registration error:", error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false,
                error: "Email already exists" 
            });
        }
        
        // Handle validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return res.status(400).json({ 
                success: false,
                error: messages[0] || "Validation failed" 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            error: "Registration failed. Please try again." 
        });
    }
};

// Universal Login
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;

        console.log('🔐 Login attempt:', { email, role, hasPassword: !!password });

        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                error: "Email and password are required" 
            });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ 
                success: false,
                error: "Please enter a valid email address" 
            });
        }

        // Check MongoDB connection
        if (!isMongoConnected()) {
            return res.status(503).json({ 
                success: false,
                error: "Database connection unavailable. Please try again later." 
            });
        }

        let user: any = null;
        let userRole: string = "USER";

        // Search in User collection first
        user = await UserModel.findOne({ 
            email: email.toLowerCase().trim() 
        }).select("+password");
        
        console.log('👤 User found:', !!user, user ? `Role: ${user.role}` : 'Not found');
        
        if (user) {
            userRole = user.role;
        } else {
            // Try E-Centre collection
            user = await ECentreModel.findOne({ 
                email: email.toLowerCase().trim() 
            }).select("+password");
            
            console.log('🏭 E-Centre found:', !!user);
            
            if (user) {
                userRole = "ECENTRE";
            }
        }

        // User not found
        if (!user) {
            console.log('❌ No user found with email:', email);
            return res.status(401).json({ 
                success: false,
                message: "Invalid credentials" 
            });
        }

        console.log('🔑 Comparing passwords...');
        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        console.log('✅ Password valid:', isPasswordValid);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid credentials" 
            });
        }

        // Check if role matches (if specified)
        if (role && userRole !== role) {
            console.log('❌ Role mismatch. Expected:', role, 'Got:', userRole);
            return res.status(403).json({ 
                success: false,
                message: "Invalid credentials for this role" 
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { 
                _id: user._id.toString(), 
                role: userRole,
                email: user.email
            }, 
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Return success response
        res.json({ 
            success: true, 
            token, 
            user: { 
                _id: user._id, 
                name: user.name, 
                email: user.email,
                role: userRole,
                points: user.points || 0,
                location: user.location,
                verified: user.verified
            } 
        });
    } catch (error: any) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false, 
            error: "Login failed. Please try again." 
        });
    }
};