// API route for handling expense operations
import { connectToDatabase } from "../../utils/db"
import Expense from "../../models/Expense"

export default async function handler(req, res) {
  try {
    await connectToDatabase()

    switch (req.method) {
      case "GET":
        return getExpenses(req, res)
      case "POST":
        return addExpense(req, res)
      default:
        return res.status(405).json({ message: "Method not allowed" })
    }
  } catch (error) {
    console.error("Error in expense API:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

// Get all expenses
async function getExpenses(req, res) {
  try {
    const expenses = await Expense.find({}).sort({ date: -1 })
    return res.status(200).json(expenses)
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return res.status(500).json({ message: "Failed to fetch expenses" })
  }
}

// Add a new expense
async function addExpense(req, res) {
  try {
    const expenseData = req.body

    // Validate required fields
    if (
      !expenseData.description ||
      !expenseData.amount ||
      !expenseData.date ||
      !expenseData.participants ||
      expenseData.participants.length === 0
    ) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const newExpense = new Expense(expenseData)
    await newExpense.save()

    return res.status(201).json(newExpense)
  } catch (error) {
    console.error("Error adding expense:", error)
    return res.status(500).json({ message: "Failed to add expense" })
  }
}

