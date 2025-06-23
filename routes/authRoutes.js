import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  logoutUser,
  getAllUsers,
} from "../controllers/authController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logoutUser);

router.get("/all", protect, adminOnly, getAllUsers);

export default router;
