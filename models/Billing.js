import mongoose from "mongoose";

const billingSchema = new mongoose.Schema(
  {
    residentName: { type: String, required: true },
    roomNumber: { type: String, required: true },
    roomFee: { type: Number, required: true },
    utilities: { type: Number, required: true },
    services: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    lateFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["Stripe", "PayPal", "Cash"], // ✅ ENUM VALIDATION
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    stripePaymentIntentId: { type: String },
    dueDate: { type: Date },
    generatedBy: { type: String }, // e.g., "admin"
  },
  { timestamps: true }
);

export default mongoose.model("Billing", billingSchema);
