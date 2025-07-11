import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  description: String,
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
