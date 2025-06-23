import express from "express";
import {
  deleteUser,
  getAllUsers,
  updateUserRole,
} from "../controllers/userController.js";
import { allowRoles, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin-only routes
router.get("/getall", protect, allowRoles("admin"), getAllUsers);
router.put("/:id/role", protect, allowRoles("admin"), updateUserRole);

router.delete("/:id", protect, allowRoles("admin"), deleteUser);

export default router;
