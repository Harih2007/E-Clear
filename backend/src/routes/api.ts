import { Router } from "express";
import * as DisposalController from "../controllers/disposal.controller";
import * as PickupController from "../controllers/pickup.controller";
import * as PoolingController from "../controllers/pooling.controller";
import * as AuthController from "../controllers/auth.controller";
import * as UploadController from "../controllers/upload.controller";
import { authenticate, isUser, isECentre } from "../middleware/auth.middleware";

const router = Router();

// ============================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================

// Auth Routes
router.post("/auth/register", AuthController.registerUser);
router.post("/auth/register/user", AuthController.registerUser);
router.post("/auth/register/ecentre", AuthController.registerECentre);
router.post("/auth/login", AuthController.login);
router.patch("/auth/update-location", authenticate, AuthController.updateLocation);

// ============================================
// USER ROUTES
// ============================================

// Disposal Requests
router.post("/disposal/request", authenticate, isUser, DisposalController.createDisposalRequest);
router.get("/disposal/my-requests", authenticate, isUser, DisposalController.getUserRequests);
router.get("/disposal/requests", authenticate, isECentre, DisposalController.getAllRequests);

// View Nearby E-Centres (pincode-based)
router.get("/ecentres/nearby", authenticate, isUser, PickupController.getNearbyECentres);

// Nearby E-Centres by coordinates
router.get("/ecentres/nearby-coords", authenticate, PickupController.getNearbyECentresByCoords);

// User Stats
router.get("/stats/user", authenticate, isUser, PickupController.getUserStats);

// ============================================
// E-CENTRE ROUTES
// ============================================

// Pickup Management
router.post("/pickup/schedule", authenticate, isECentre, PickupController.schedulePickup);
router.patch("/pickup/:requestId/collected", authenticate, isECentre, PickupController.markAsCollected);

// E-Centre Stats
router.get("/stats/ecentre", authenticate, isECentre, PickupController.getECentreStats);

// Pending Pools
router.get("/pools/pending", authenticate, isECentre, PickupController.getPendingPools);

// Pool Management
router.post("/pools/:poolId/accept", authenticate, isECentre, PoolingController.acceptPool);

// Reports by E-Centre
router.get("/disposal/by-ecentre/:eCentreId", authenticate, isECentre, DisposalController.getReportsByECentre);

// Reports by location radius
router.get("/disposal/by-location", authenticate, DisposalController.getReportsByLocation);

// ============================================
// SHARED ROUTES
// ============================================

// View specific disposal request
router.get("/disposal/:id", authenticate, DisposalController.getDisposalRequest);

// Image Upload
router.post("/upload/image", authenticate, UploadController.uploadImage);

export default router;
