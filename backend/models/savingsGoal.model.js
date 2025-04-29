const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SavingsGoalSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Goal name is required"],
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: [true, "Target amount is required"],
      min: [0.01, "Target amount must be greater than 0"],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, "Current amount cannot be negative"],
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (value) {
          return value > this.startDate
        },
        message: "End date must be after start date",
      },
    },
    category: {
      type: String,
      enum: ["Travel", "Education", "Emergency", "Retirement", "Home", "Vehicle", "Other"],
      default: "Other",
    },
    description: {
      type: String,
      trim: true,
    },
    monthlyContribution: {
      type: Number,
      min: [0, "Monthly contribution cannot be negative"],
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    contributions: [
      {
        amount: {
          type: Number,
          required: true,
          min: [0.01, "Contribution amount must be greater than 0"],
        },
        date: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  },
)

// Virtual property to calculate progress percentage
SavingsGoalSchema.virtual("progressPercentage").get(function () {
  if (this.targetAmount === 0) return 0
  return Math.min(100, (this.currentAmount / this.targetAmount) * 100)
})

// Virtual property to calculate remaining amount
SavingsGoalSchema.virtual("remainingAmount").get(function () {
  return Math.max(0, this.targetAmount - this.currentAmount)
})

// Virtual property to calculate days remaining
SavingsGoalSchema.virtual("daysRemaining").get(function () {
  const today = new Date()
  const endDate = new Date(this.endDate)
  const diffTime = endDate - today
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Method to add a contribution
SavingsGoalSchema.methods.addContribution = function (amount, note = "") {
  this.contributions.push({
    amount,
    date: new Date(),
    note,
  })
  this.currentAmount += amount

  if (this.currentAmount >= this.targetAmount) {
    this.isCompleted = true
  }

  return this.save()
}

// Set the toJSON option to include virtuals
SavingsGoalSchema.set("toJSON", { virtuals: true })
SavingsGoalSchema.set("toObject", { virtuals: true })

const SavingsGoal = mongoose.model("SavingsGoal", SavingsGoalSchema)

module.exports = SavingsGoal

