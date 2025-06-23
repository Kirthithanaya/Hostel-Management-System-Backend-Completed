import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    residentName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["email", "sms", "in-app"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
