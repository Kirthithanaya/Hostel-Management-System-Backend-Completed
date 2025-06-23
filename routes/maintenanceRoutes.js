import express from "express";
import {
  assignRequest,
  createMaintenanceRequest,
  deleteRequest,
  getAllMaintenanceRequests,
  getMyMaintenanceRequests,
  updateMaintenanceRequest,
} from "../controllers/maintenanceController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Resident: Create maintenance request
router.post("/create", createMaintenanceRequest);

//resident : Get My Request
router.get("/my-requests", protect, getMyMaintenanceRequests);

//Admin: Get all maintenance requests
router.get("/all-requests", protect, adminOnly, getAllMaintenanceRequests);

//Admin : Assignrequest
router.put("/assign/:requestId", assignRequest); // PUT method

//Admin : Update Maintenance Request to Resident
router.put("/update/:requestId", updateMaintenanceRequest);

//Admin : Delete Request
router.delete("/delete", protect, adminOnly, deleteRequest);

export default router;
