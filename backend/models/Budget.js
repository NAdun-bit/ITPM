import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  category: String,
  amount: Number,
});

const budgetSchema = new mongoose.Schema({
  income: {
    type: Number,
    required: true,
  },
  expenses: [expenseSchema],
  totalExpenses: Number,
  originalBalance: Number,
  shadowExpenses: [expenseSchema],
  shadowBalance: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;
