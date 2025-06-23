import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming User model holds residents
      required: true,
    },
    residentName: {
      type: String,
      required: true,
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Billing",
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["Stripe", "PayPal", "Cash"],
      required: true,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Paid", "Pending", "Failed"],
      default: "Pending",
    },
    stripeChargeId: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
