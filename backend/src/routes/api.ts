import { Router } from "express";
import * as DisposalController from "../controllers/disposal.controller";
import * as PickupController from "../controllers/pickup.controller";
import * as DropOffController from "../controllers/dropoff.controller";
import * as UserController from "../controllers/user.controller";
import * as AuthController from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Auth Routes
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// User Routes
// router.post("/users", UserController.createUser); // Replaced by auth/register

// Disposal Routes (Protected)
router.post("/dispose", authMiddleware, DisposalController.createDisposalRequest);
router.get("/user/:userId/requests", authMiddleware, DisposalController.getUserRequests);


// Pickup Routes (Internal/Recycler)
router.post("/pickup/schedule", PickupController.triggerPickupCheck);
router.patch("/pickup/confirm", PickupController.confirmPickup);
router.get("/pickups", PickupController.getPickups);

// DropOff Routes
router.get("/drop-off-points", DropOffController.getDropOffPoints);

export default router;
