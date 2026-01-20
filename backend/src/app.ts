import express from "express";
import cors from "cors";

import apiRoutes from "./routes/api";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", apiRoutes);

// Basic Route for Health Check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "E-Clear Backend is running" });
});

export default app;
