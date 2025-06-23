import express from "express";
import {
  createTransaction,
  getFinancialSummary,
  getMonthlyReport,
  getOverviewReport,
} from "../controllers/financialReportController.js";

const router = express.Router();

//Admin : Create Financial Report

router.post("/transactions", createTransaction);
router.get("/summary", getFinancialSummary);
router.get("/monthly", getMonthlyReport);
router.get("/overview", getOverviewReport);

export default router;
