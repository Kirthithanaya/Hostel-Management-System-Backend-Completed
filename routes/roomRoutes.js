import express from "express";
import {
  assignRoom,
  checkInRoom,
  checkOutRoom,
  createRoom,
  deleteRoom,
  getAllRoomCheckIns,
  getAllRooms,
  residentGetAllRooms,
} from "../controllers/roomController.js";
import {
  adminOnly,
  isResident,
  protect,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

//Admin Only : Create Room
router.post("/create", protect, adminOnly, createRoom);

//Admin: GetAllRooms
router.get("/getall", protect, adminOnly, getAllRooms); // Get all rooms

//Resident: GetAllRooms
// Resident: View All Rooms
router.get("/available", protect, isResident, residentGetAllRooms);

//Resident : CheckIn Room
router.post("/checkin", checkInRoom); // No auth middleware

//Admin: Get AllCheckin Rooms

router.get("/resident-checkins", protect, adminOnly, getAllRoomCheckIns);

//Admin: Assugn Room For Resident
router.post("/assign", protect, assignRoom);

//Resident : CheckOut ROOM
router.post("/checkout", checkOutRoom);

//Admin delete Room
router.delete("/delete", protect, adminOnly, deleteRoom);
export default router;
