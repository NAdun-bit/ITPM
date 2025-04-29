// API route for handling operations on a specific expense
import { connectToDatabase } from "../../utils/db"
import Expense from "../../models/Expense"

export default async function handler(req, res) {
  try {
    await connectToDatabase()

    const { id } = req.query

    if (!id) {
      return res.status(400).json({ message: "Expense ID is required" })
    }

    switch (req.method) {
      case "GET":
        return getExpense(req, res, id)
      case "PUT":
        return updateExpense(req, res, id)
      case "DELETE":
        return deleteExpense(req, res, id)
      default:
        return res.status(405).json({ message: "Method not allowed" })
    }
  } catch (error) {
    console.error("Error in expense API:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

// Get a specific expense
async function getExpense(req, res, id) {
  try {
    const expense = await Expense.findById(id)

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    return res.status(200).json(expense)
  } catch (error) {
    console.error("Error fetching expense:", error)
    return res.status(500).json({ message: "Failed to fetch expense" })
  }
}

// Update an expense
async function updateExpense(req, res, id) {
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

    const updatedExpense = await Expense.findByIdAndUpdate(id, expenseData, { new: true, runValidators: true })

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    return res.status(200).json(updatedExpense)
  } catch (error) {
    console.error("Error updating expense:", error)
    return res.status(500).json({ message: "Failed to update expense" })
  }
}

// Delete an expense
async function deleteExpense(req, res, id) {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(id)

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    return res.status(200).json({ message: "Expense deleted successfully" })
  } catch (error) {
    console.error("Error deleting expense:", error)
    return res.status(500).json({ message: "Failed to delete expense" })
  }
}

