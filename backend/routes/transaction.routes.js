const router = require("express").Router()
const Transaction = require("../models/transaction.model")
const Budget = require("../models/budget.model")

// Get all transactions
router.route("/").get(async (req, res) => {
  try {
    console.log("GET /api/transactions - Fetching all transactions")
    const transactions = await Transaction.find().sort({ date: -1 })
    console.log(`Found ${transactions.length} transactions`)
    res.json(transactions)
  } catch (err) {
    console.error("Error in GET /api/transactions:", err.message)
    res.status(500).json({ message: err.message })
  }
})

// Add a new transaction
router.route("/add").post(async (req, res) => {
  try {
    console.log("POST /api/transactions/add - Adding new transaction")
    const { description, amount, date, category, paymentMethod, budgetId, notes } = req.body

    // Validate required fields
    if (!description || !amount || !date || !category || !budgetId) {
      console.log("Missing required fields:", { description, amount, date, category, budgetId })
      return res.status(400).json({ message: "Missing required fields" })
    }

    const newTransaction = new Transaction({
      description,
      amount,
      date,
      category,
      paymentMethod: paymentMethod || "Other",
      budgetId,
      notes: notes || "",
    })

    const savedTransaction = await newTransaction.save()
    console.log("Transaction saved successfully with ID:", savedTransaction._id)

    // Update the budget category actual amount
    const budget = await Budget.findById(budgetId)
    if (budget) {
      const categoryIndex = budget.categories.findIndex((cat) => cat.name === category)
      if (categoryIndex !== -1) {
        budget.categories[categoryIndex].actualAmount += amount
        await budget.save()
      } else {
        // If category doesn't exist, create it as a custom category
        budget.categories.push({
          name: category,
          plannedAmount: amount,
          actualAmount: amount,
          color: getRandomColor(),
          isCustom: true,
        })
        await budget.save()
      }
    }

    res.status(201).json(savedTransaction)
  } catch (err) {
    console.error("Error in POST /api/transactions/add:", err.message)
    res.status(400).json({ message: err.message })
  }
})

// Get a specific transaction
router.route("/:id").get(async (req, res) => {
  try {
    console.log(`GET /api/transactions/${req.params.id} - Fetching transaction`)
    const transaction = await Transaction.findById(req.params.id)
    if (!transaction) {
      console.log(`Transaction with ID ${req.params.id} not found`)
      return res.status(404).json({ message: "Transaction not found" })
    }
    console.log("Transaction found:", transaction._id)
    res.json(transaction)
  } catch (err) {
    console.error(`Error in GET /api/transactions/${req.params.id}:`, err.message)
    res.status(500).json({ message: err.message })
  }
})

// Update a transaction
router.route("/:id").put(async (req, res) => {
  try {
    console.log(`PUT /api/transactions/${req.params.id} - Updating transaction`)
    const { description, amount, date, category, paymentMethod, notes } = req.body

    // Validate required fields
    if (!description || !amount || !date || !category) {
      console.log("Missing required fields:", { description, amount, date, category })
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Get the original transaction to calculate the difference in amount
    const originalTransaction = await Transaction.findById(req.params.id)
    if (!originalTransaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    const amountDifference = amount - originalTransaction.amount
    const categoryChanged = category !== originalTransaction.category

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        description,
        amount,
        date,
        category,
        paymentMethod: paymentMethod || "Other",
        notes: notes || "",
      },
      { new: true, runValidators: true },
    )

    if (!updatedTransaction) {
      console.log(`Transaction with ID ${req.params.id} not found for update`)
      return res.status(404).json({ message: "Transaction not found" })
    }

    // Update the budget category actual amount
    const budget = await Budget.findById(originalTransaction.budgetId)
    if (budget) {
      if (categoryChanged) {
        // Decrease the amount from the old category
        const oldCategoryIndex = budget.categories.findIndex((cat) => cat.name === originalTransaction.category)
        if (oldCategoryIndex !== -1) {
          budget.categories[oldCategoryIndex].actualAmount -= originalTransaction.amount
        }

        // Increase the amount in the new category
        const newCategoryIndex = budget.categories.findIndex((cat) => cat.name === category)
        if (newCategoryIndex !== -1) {
          budget.categories[newCategoryIndex].actualAmount += amount
        } else {
          // If new category doesn't exist, create it as a custom category
          budget.categories.push({
            name: category,
            plannedAmount: amount,
            actualAmount: amount,
            color: getRandomColor(),
            isCustom: true,
          })
        }
      } else {
        // Just update the amount in the same category
        const categoryIndex = budget.categories.findIndex((cat) => cat.name === category)
        if (categoryIndex !== -1) {
          budget.categories[categoryIndex].actualAmount += amountDifference
        }
      }
      await budget.save()
    }

    console.log("Transaction updated successfully:", updatedTransaction._id)
    res.json(updatedTransaction)
  } catch (err) {
    console.error(`Error in PUT /api/transactions/${req.params.id}:`, err.message)
    res.status(400).json({ message: err.message })
  }
})

// Delete a transaction
router.route("/:id").delete(async (req, res) => {
  try {
    console.log(`DELETE /api/transactions/${req.params.id} - Deleting transaction`)

    // Get the transaction before deleting to update the budget
    const transaction = await Transaction.findById(req.params.id)
    if (!transaction) {
      console.log(`Transaction with ID ${req.params.id} not found for deletion`)
      return res.status(404).json({ message: "Transaction not found" })
    }

    // Delete the transaction
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id)

    // Update the budget category actual amount
    const budget = await Budget.findById(transaction.budgetId)
    if (budget) {
      const categoryIndex = budget.categories.findIndex((cat) => cat.name === transaction.category)
      if (categoryIndex !== -1) {
        budget.categories[categoryIndex].actualAmount -= transaction.amount
        await budget.save()
      }
    }

    console.log("Transaction deleted successfully:", deletedTransaction._id)
    res.json({ message: "Transaction deleted successfully", id: deletedTransaction._id })
  } catch (err) {
    console.error(`Error in DELETE /api/transactions/${req.params.id}:`, err.message)
    res.status(500).json({ message: err.message })
  }
})

// Search and filter transactions
router.route("/search").post(async (req, res) => {
  try {
    console.log("POST /api/transactions/search - Searching transactions")
    const { searchTerm, category, startDate, endDate, paymentMethod, minAmount, maxAmount, budgetId } = req.body

    const query = {}

    // Add budget ID filter if provided
    if (budgetId) {
      query.budgetId = budgetId
    }

    // Add category filter if provided
    if (category) {
      query.category = category
    }

    // Add payment method filter if provided
    if (paymentMethod) {
      query.paymentMethod = paymentMethod
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      query.date = {}
      if (startDate) {
        query.date.$gte = new Date(startDate)
      }
      if (endDate) {
        query.date.$lte = new Date(endDate)
      }
    }

    // Add amount range filter if provided
    if (minAmount !== undefined || maxAmount !== undefined) {
      query.amount = {}
      if (minAmount !== undefined) {
        query.amount.$gte = minAmount
      }
      if (maxAmount !== undefined) {
        query.amount.$lte = maxAmount
      }
    }

    // Add text search if provided
    if (searchTerm) {
      query.$text = { $search: searchTerm }
    }

    const transactions = await Transaction.find(query).sort({ date: -1 })
    console.log(`Found ${transactions.length} transactions matching the search criteria`)
    res.json(transactions)
  } catch (err) {
    console.error("Error in POST /api/transactions/search:", err.message)
    res.status(500).json({ message: err.message })
  }
})

// Helper function to generate a random color
function getRandomColor() {
  const colors = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#6366F1", // Indigo
    "#EC4899", // Pink
    "#8B5CF6", // Purple
    "#EF4444", // Red
    "#14B8A6", // Teal
    "#F97316", // Orange
    "#06B6D4", // Cyan
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

module.exports = router

