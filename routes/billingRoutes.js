import express from "express";
import {
  deleteInvoices,
  generateInvoice,
  getAllInvoices,
  getMyInvoices,
} from "../controllers/billingController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

//Admin : Generate Invoice
router.post("/generate", generateInvoice);

//Admin: Get Invoices
router.get("/getall-ivoices", protect, adminOnly, getAllInvoices);

//Resident : Get My Invoice
router.get("/getmy-invoices", protect, getMyInvoices); // Only token required

//Admin :DeleteInvoice
router.delete("/delete", adminOnly, deleteInvoices);

export default router;
