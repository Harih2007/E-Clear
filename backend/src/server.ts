import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { checkConnection } from "./config/supabase";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Check Supabase connection
        const connected = await checkConnection();
        if (!connected) {
            console.warn("⚠️ Supabase connection check failed, but server will start anyway");
        }

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
