import mongoose from "mongoose";

let isConnecting = false;
let connectionAttempts = 0;
const MAX_RETRIES = 3;

export const connectDB = async () => {
    // Prevent multiple simultaneous connection attempts
    if (isConnecting) {
        console.log("⏳ MongoDB connection already in progress...");
        return;
    }

    // Already connected
    if (mongoose.connection.readyState === 1) {
        console.log("✅ MongoDB already connected");
        return;
    }

    isConnecting = true;

    try {
        const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/eclear";
        
        console.log("🔄 Connecting to MongoDB...");
        
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000,
        });
        
        console.log("✅ MongoDB Connected Successfully");
        connectionAttempts = 0;
        
        // Handle connection events
        mongoose.connection.on("disconnected", () => {
            console.log("⚠️  MongoDB disconnected");
        });
        
        mongoose.connection.on("error", (err) => {
            console.error("❌ MongoDB connection error:", err);
        });
        
    } catch (error: any) {
        connectionAttempts++;
        console.error(`❌ MongoDB Connection Failed (Attempt ${connectionAttempts}/${MAX_RETRIES}):`, error.message);
        
        if (connectionAttempts < MAX_RETRIES) {
            console.log(`🔄 Retrying connection in 3 seconds...`);
            setTimeout(() => {
                isConnecting = false;
                connectDB();
            }, 3000);
        } else {
            console.log("⚠️  Max connection attempts reached. Running without database.");
            console.log("💡 Make sure MongoDB is running: mongod");
        }
    } finally {
        isConnecting = false;
    }
};

// Graceful shutdown
process.on("SIGINT", async () => {
    try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed through app termination");
        process.exit(0);
    } catch (err) {
        console.error("Error closing MongoDB connection:", err);
        process.exit(1);
    }
});
