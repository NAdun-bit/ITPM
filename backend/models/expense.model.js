const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ParticipantSchema = new Schema({
  name: {
    type: String,
    required: [true, "Participant name is required"],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    default: "",
  },
  share: {
    type: Number,
    default: 0,
  },
  hasPaid: {
    type: Boolean,
    default: false,
  },
})

const ExpenseSchema = new Schema(
  {
    description: {
      type: String,
      required: [true, "Expense description is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Expense amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    date: {
      type: Date,
      required: [true, "Expense date is required"],
      default: Date.now,
    },
    splitType: {
      type: String,
      enum: ["equal", "custom"],
      default: "equal",
    },
    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    participants: {
      type: [ParticipantSchema],
      validate: {
        validator: (participants) => participants.length > 0,
        message: "At least one participant is required",
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  },
)

const Expense = mongoose.model("Expense", ExpenseSchema)

module.exports = Expense

