import { Router } from "express";
import * as DisposalController from "../controllers/disposal.controller";
import * as PickupController from "../controllers/pickup.controller";
import * as PoolingController from "../controllers/pooling.controller";
import * as AuthController from "../controllers/auth.controller";
import { authenticate, isUser, isECentre, isUserOrAdmin, isECentreOrAdmin } from "../middleware/auth.middleware";

const router = Router();

// ============================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================

// Auth Routes
router.post("/auth/register", AuthController.registerUser); // User registration
router.post("/auth/register/user", AuthController.registerUser); // Alias for clarity
router.post("/auth/register/ecentre", AuthController.registerECentre);
router.post("/auth/login", AuthController.login);

// ============================================
// USER ROUTES (Household)
// ============================================

// Disposal Requests
router.post("/disposal/request", authenticate, isUser, DisposalController.createDisposalRequest);
router.get("/disposal/my-requests", authenticate, isUser, DisposalController.getUserRequests);
router.get("/disposal/requests", authenticate, isECentre, DisposalController.getAllRequests);
router.get("/disposal/grouping/:pincode", authenticate, isUser, DisposalController.getGroupingStatus);

// View Nearby E-Centres
router.get("/ecentres/nearby", authenticate, isUser, PickupController.getNearbyECentres);

// ============================================
// E-CENTRE ROUTES (Recycling Centers)
// ============================================

// Pickup Management
router.post("/pickup/create", authenticate, isECentre, PickupController.createPickup);
router.get("/pickup/my-pickups", authenticate, isECentre, PickupController.getECentrePickups);
router.get("/pickup/:id/details", authenticate, isECentre, PickupController.getPickupDetails);
router.patch("/pickup/:id/status", authenticate, isECentre, PickupController.updatePickupStatus);
router.post("/pickup/:id/confirm", authenticate, isECentre, PickupController.confirmPickupAndReleaseIncentives);

// View Available Clusters
router.get("/pickup/clusters/available", authenticate, isECentre, PickupController.getAvailablePickupClusters);

// Update Request Status (after pickup)
router.patch("/disposal/:id/status", authenticate, isECentre, DisposalController.updateRequestStatus);

// ============================================
// POOLING SYSTEM
// ============================================

// E-Centre Pool Management
router.get("/pools/my-pools", authenticate, isECentre, PoolingController.getMyPools);
router.post("/pools/:poolId/accept", authenticate, isECentre, PoolingController.acceptPool);
router.post("/pools/:poolId/schedule", authenticate, isECentre, PoolingController.schedulePool);
router.post("/pools/:poolId/complete", authenticate, isECentre, PoolingController.completePool);

// ============================================
// SHARED ROUTES (Both USER and E-CENTRE)
// ============================================

// View specific disposal request (with privacy checks)
router.get("/disposal/:id", authenticate, DisposalController.getDisposalRequest);

export default router;
