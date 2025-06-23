import express from "express";
import {
  emailNotify,
  handlePayment,
  smsNotify,
  triggerBackup,
} from "../controllers/integrationController.js";

const router = express.Router();

router.post("/email", emailNotify);
router.post("/sms", smsNotify);
router.post("/backup", triggerBackup);
router.post("/payment", handlePayment);

export default router;
