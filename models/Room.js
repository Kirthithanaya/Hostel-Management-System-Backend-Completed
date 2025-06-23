import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["Single", "Double", "Triple"],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Occupied", "Maintenance"],
      default: "Available",
    },
    isOccupied: { type: Boolean, default: false },
    currentOccupancy: { type: Number, default: 0 },
    residents: [
      {
        residentName: { type: String, required: true },
        checkInDate: { type: Date, default: Date.now },
        checkOutDate: { type: Date, default: null }, // nullable
      },
    ],
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
