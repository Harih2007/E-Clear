import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { supabase } from "../config/supabase";

// Upload Image using Supabase Storage
export const uploadImage = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }

        const { imageData, fileName } = req.body;

        if (!imageData) {
            return res.status(400).json({
                success: false,
                error: "imageData is required (base64 encoded)"
            });
        }

        // For MVP: store as base64 data URL
        const imageUrl = imageData.startsWith("data:")
            ? imageData
            : `data:image/jpeg;base64,${imageData}`;

        // TODO: Upgrade to Supabase Storage for production:
        // const { data, error } = await supabase.storage
        //     .from('report-images')
        //     .upload(`${req.user._id}/${fileName}`, buffer);
        // const imageUrl = supabase.storage.from('report-images').getPublicUrl(data.path).data.publicUrl;

        res.json({
            success: true,
            imageUrl,
            message: "Image uploaded successfully"
        });
    } catch (error: any) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to upload image"
        });
    }
};
