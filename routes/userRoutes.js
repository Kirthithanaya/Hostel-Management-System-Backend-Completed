import express from "express";
import {
  deleteUser,
  getAllUsers,
  updateUserRole,
} from "../controllers/userController.js";
import { allowRoles, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin-only routes
router.get("/getall", protect, allowRoles("admin,resident"), getAllUsers);
router.put("/:id/role", protect, allowRoles("admin, resident"), updateUserRole);

router.delete("/:id", protect, allowRoles("admin, resident"), deleteUser);


export default router;
