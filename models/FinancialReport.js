import mongoose from "mongoose";

const financialTransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["revenue", "expense"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model(
  "FinancialTransaction",
  financialTransactionSchema
);
