import express from "express";
import {
  createResident,
  deleteResident,
  getAllResidents,
  getResidentById,
  updateResident,
} from "../controllers/residentController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

//Admin : CreaateResident
router.post("/create", protect, adminOnly, createResident);

//Admin : GetAll Resident
router.get("/getall", protect, adminOnly, getAllResidents);

//Admin : GetResident By Id
router.get("/get/:id", protect, adminOnly, getResidentById);

//Admin : Update Resident
router.put("/update/:id", protect, adminOnly, updateResident);

//Admin : Delete Resident
router.delete("/delete/:id", protect, adminOnly, deleteResident);

export default router;
