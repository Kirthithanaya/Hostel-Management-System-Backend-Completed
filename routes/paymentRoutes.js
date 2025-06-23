import express from "express";
import {
  getPaymentHistory,
  processPayment,
} from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

//Resident :Process Payment
router.post("/process-payment", protect, processPayment);

//Resident :Get Payment History
router.get("/history", protect, getPaymentHistory);

//Admin :CreatePayment

export default router;
