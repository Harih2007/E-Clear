import express from "express";
import cors from "cors";

import apiRoutes from "./routes/api";

const app = express();

// Middleware - CORS with detailed logging
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path} from ${req.get('origin') || 'no origin'}`);
    next();
});

app.use(cors({
    origin: ["http://localhost:4000", "http://localhost:3000"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Routes
app.use("/api", apiRoutes);

// Basic Route for Health Check
app.get("/health", (req, res) => {
    console.log("✅ Health check endpoint hit!");
    res.status(200).json({ status: "ok", message: "E-Clear Backend is running" });
});

export default app;
