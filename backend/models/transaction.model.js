const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TransactionSchema = new Schema(
  {
    description: {
      type: String,
      required: [true, "Transaction description is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    date: {
      type: Date,
      required: [true, "Transaction date is required"],
      default: Date.now,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "Debit Card", "Cash", "Bank Transfer", "Other"],
      default: "Other",
    },
    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
      required: [true, "Budget ID is required"],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

// Add text index for search functionality
TransactionSchema.index({ description: "text", category: "text", notes: "text" })

const Transaction = mongoose.model("Transaction", TransactionSchema)

module.exports = Transaction

