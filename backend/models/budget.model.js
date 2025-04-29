const mongoose = require("mongoose")
const Schema = mongoose.Schema

const BudgetCategorySchema = new Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    trim: true,
  },
  plannedAmount: {
    type: Number,
    required: [true, "Planned amount is required"],
    min: [0, "Planned amount cannot be negative"],
  },
  actualAmount: {
    type: Number,
    default: 0,
    min: [0, "Actual amount cannot be negative"],
  },
  color: {
    type: String,
    default: "#3B82F6", // Default blue color
  },
})

const BudgetSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Budget name is required"],
      trim: true,
    },
    month: {
      type: Number,
      required: [true, "Month is required"],
      min: [1, "Month must be between 1 and 12"],
      max: [12, "Month must be between 1 and 12"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [2000, "Year must be 2000 or later"],
    },
    totalIncome: {
      type: Number,
      required: [true, "Total income is required"],
      min: [0, "Total income cannot be negative"],
    },
    categories: {
      type: [BudgetCategorySchema],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for total planned spending
BudgetSchema.virtual("totalPlanned").get(function () {
  return this.categories.reduce((sum, category) => sum + category.plannedAmount, 0)
})

// Virtual for total actual spending
BudgetSchema.virtual("totalActual").get(function () {
  return this.categories.reduce((sum, category) => sum + category.actualAmount, 0)
})

// Virtual for remaining budget
BudgetSchema.virtual("remaining").get(function () {
  return this.totalIncome - this.totalActual
})

// Virtual for budget status
BudgetSchema.virtual("status").get(function () {
  if (this.totalActual > this.totalIncome) return "Overspent"
  if (this.totalActual > this.totalPlanned) return "Warning"
  return "Good"
})

const Budget = mongoose.model("Budget", BudgetSchema)

module.exports = Budget

