const router = require("express").Router()
const Expense = require("../models/expense.model")

// Get all expenses
router.route("/").get(async (req, res) => {
  try {
    console.log("GET /api/expenses - Fetching all expenses")
    const expenses = await Expense.find().sort({ date: -1 })
    console.log(`Found ${expenses.length} expenses`)
    res.json(expenses)
  } catch (err) {
    console.error("Error in GET /api/expenses:", err.message)
    res.status(500).json({ message: err.message })
  }
})

// Add a new expense
router.route("/add").post(async (req, res) => {
  try {
    console.log("POST /api/expenses/add - Adding new expense")
    const { description, amount, date, splitType, status, participants } = req.body

    // Validate required fields
    if (!description || !amount || !date || !participants || participants.length === 0) {
      console.log("Missing required fields:", { description, amount, date, participants })
      return res.status(400).json({ message: "Missing required fields" })
    }

    const newExpense = new Expense({
      description,
      amount,
      date,
      splitType: splitType || "equal",
      status: status || "Pending",
      participants,
    })

    const savedExpense = await newExpense.save()
    console.log("Expense saved successfully with ID:", savedExpense._id)
    res.status(201).json(savedExpense)
  } catch (err) {
    console.error("Error in POST /api/expenses/add:", err.message)
    res.status(400).json({ message: err.message })
  }
})

// Get a specific expense
router.route("/:id").get(async (req, res) => {
  try {
    console.log(`GET /api/expenses/${req.params.id} - Fetching expense`)
    const expense = await Expense.findById(req.params.id)
    if (!expense) {
      console.log(`Expense with ID ${req.params.id} not found`)
      return res.status(404).json({ message: "Expense not found" })
    }
    console.log("Expense found:", expense._id)
    res.json(expense)
  } catch (err) {
    console.error(`Error in GET /api/expenses/${req.params.id}:`, err.message)
    res.status(500).json({ message: err.message })
  }
})

// Update an expense
router.route("/:id").put(async (req, res) => {
  try {
    console.log(`PUT /api/expenses/${req.params.id} - Updating expense`)
    const { description, amount, date, splitType, status, participants } = req.body

    // Validate required fields
    if (!description || !amount || !date || !participants || participants.length === 0) {
      console.log("Missing required fields:", { description, amount, date, participants })
      return res.status(400).json({ message: "Missing required fields" })
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        description,
        amount,
        date,
        splitType: splitType || "equal",
        status: status || "Pending",
        participants,
      },
      { new: true, runValidators: true },
    )

    if (!updatedExpense) {
      console.log(`Expense with ID ${req.params.id} not found for update`)
      return res.status(404).json({ message: "Expense not found" })
    }

    console.log("Expense updated successfully:", updatedExpense._id)
    res.json(updatedExpense)
  } catch (err) {
    console.error(`Error in PUT /api/expenses/${req.params.id}:`, err.message)
    res.status(400).json({ message: err.message })
  }
})

// Delete an expense
router.route("/:id").delete(async (req, res) => {
  try {
    console.log(`DELETE /api/expenses/${req.params.id} - Deleting expense`)
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id)

    if (!deletedExpense) {
      console.log(`Expense with ID ${req.params.id} not found for deletion`)
      return res.status(404).json({ message: "Expense not found" })
    }

    console.log("Expense deleted successfully:", deletedExpense._id)
    res.json({ message: "Expense deleted successfully", id: deletedExpense._id })
  } catch (err) {
    console.error(`Error in DELETE /api/expenses/${req.params.id}:`, err.message)
    res.status(500).json({ message: err.message })
  }
})

module.exports = router

