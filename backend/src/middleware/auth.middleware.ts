import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        _id: string;
        role: "USER" | "ECENTRE" | "ADMIN";
    };
}

// Verify JWT Token
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

// Role-Based Access Control
export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: "Access denied. Insufficient permissions.",
                requiredRoles: roles,
                yourRole: req.user.role
            });
        }

        next();
    };
};

// Specific role checks
export const isUser = authorize("USER");
export const isECentre = authorize("ECENTRE");
export const isAdmin = authorize("ADMIN");
export const isUserOrAdmin = authorize("USER", "ADMIN");
export const isECentreOrAdmin = authorize("ECENTRE", "ADMIN");

// Legacy export for backward compatibility
export const authMiddleware = authenticate;
