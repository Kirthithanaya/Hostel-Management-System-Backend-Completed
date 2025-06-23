import mongoose from "mongoose";

const maintenanceRequestSchema = new mongoose.Schema(
  {
    residentName: {
      type: String,
      required: true,
    },

    roomNumber: {
      type: String,
      required: true,
    },
    issue: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    assignedTo: {
      type: String, // Can be staff name or ID if needed
      default: null,
    },
    responseNote: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    assignedBy: { type: String }, // Admin name
  },
  { timestamps: true }
);

const MaintenanceRequest = mongoose.model(
  "MaintenanceRequest",
  maintenanceRequestSchema
);
export default MaintenanceRequest;
