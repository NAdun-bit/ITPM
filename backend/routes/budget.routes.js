const router = require("express").Router()
const Budget = require("../models/budget.model")
const Expense = require("../models/expense.model")

// Get all budgets
router.route("/").get(async (req, res) => {
  try {
    console.log("GET /api/budgets - Fetching all budgets")
    const budgets = await Budget.find().sort({ year: -1, month: -1 })
    console.log(`Found ${budgets.length} budgets`)
    res.json(budgets)
  } catch (err) {
    console.error("Error in GET /api/budgets:", err.message)
    res.status(500).json({ message: err.message })
  }
})

// Add a new budget
router.route("/add").post(async (req, res) => {
  try {
    console.log("POST /api/budgets/add - Adding new budget")
    const { name, month, year, totalIncome, categories, notes } = req.body

    // Validate required fields
    if (!name || !month || !year || totalIncome === undefined) {
      console.log("Missing required fields:", { name, month, year, totalIncome })
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Check if a budget already exists for this month/year
    const existingBudget = await Budget.findOne({ month, year })
    if (existingBudget) {
      return res.status(400).json({ message: "A budget already exists for this month and year" })
    }

    const newBudget = new Budget({
      name,
      month,
      year,
      totalIncome,
      categories: categories || [],
      notes: notes || "",
    })

    const savedBudget = await newBudget.save()
    console.log("Budget saved successfully with ID:", savedBudget._id)
    res.status(201).json(savedBudget)
  } catch (err) {
    console.error("Error in POST /api/budgets/add:", err.message)
    res.status(400).json({ message: err.message })
  }
})

// Get a specific budget
router.route("/:id").get(async (req, res) => {
  try {
    console.log(`GET /api/budgets/${req.params.id} - Fetching budget`)
    const budget = await Budget.findById(req.params.id)
    if (!budget) {
      console.log(`Budget with ID ${req.params.id} not found`)
      return res.status(404).json({ message: "Budget not found" })
    }
    console.log("Budget found:", budget._id)
    res.json(budget)
  } catch (err) {
    console.error(`Error in GET /api/budgets/${req.params.id}:`, err.message)
    res.status(500).json({ message: err.message })
  }
})

// Update a budget
router.route("/:id").put(async (req, res) => {
  try {
    console.log(`PUT /api/budgets/${req.params.id} - Updating budget`)
    const { name, totalIncome, categories, notes, isActive } = req.body

    // Validate required fields
    if (!name || totalIncome === undefined) {
      console.log("Missing required fields:", { name, totalIncome })
      return res.status(400).json({ message: "Missing required fields" })
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      {
        name,
        totalIncome,
        categories: categories || [],
        notes: notes || "",
        isActive: isActive !== undefined ? isActive : true,
      },
      { new: true, runValidators: true },
    )

    if (!updatedBudget) {
      console.log(`Budget with ID ${req.params.id} not found for update`)
      return res.status(404).json({ message: "Budget not found" })
    }

    console.log("Budget updated successfully:", updatedBudget._id)
    res.json(updatedBudget)
  } catch (err) {
    console.error(`Error in PUT /api/budgets/${req.params.id}:`, err.message)
    res.status(400).json({ message: err.message })
  }
})

// Delete a budget
router.route("/:id").delete(async (req, res) => {
  try {
    console.log(`DELETE /api/budgets/${req.params.id} - Deleting budget`)
    const deletedBudget = await Budget.findByIdAndDelete(req.params.id)

    if (!deletedBudget) {
      console.log(`Budget with ID ${req.params.id} not found for deletion`)
      return res.status(404).json({ message: "Budget not found" })
    }

    console.log("Budget deleted successfully:", deletedBudget._id)
    res.json({ message: "Budget deleted successfully", id: deletedBudget._id })
  } catch (err) {
    console.error(`Error in DELETE /api/budgets/${req.params.id}:`, err.message)
    res.status(500).json({ message: err.message })
  }
})

// Get budget with expense data for a specific month/year
router.route("/monthly/:month/:year").get(async (req, res) => {
  try {
    const { month, year } = req.params
    console.log(`GET /api/budgets/monthly/${month}/${year} - Fetching budget with expenses`)

    // Find the budget for this month/year
    const budget = await Budget.findOne({ month: Number.parseInt(month), year: Number.parseInt(year) })

    if (!budget) {
      return res.status(404).json({ message: "No budget found for this month and year" })
    }

    // Find expenses for this month/year
    const startDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1)
    const endDate = new Date(Number.parseInt(year), Number.parseInt(month), 0) // Last day of month

    const expenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate },
    })

    // Calculate actual spending for each category
    const budgetData = budget.toObject()

    // Update actual amounts based on expenses
    if (expenses.length > 0) {
      // Group expenses by category
      const expensesByCategory = {}
      expenses.forEach((expense) => {
        // Use the first word of the description as a simple category
        const category = expense.description.split(" ")[0].toLowerCase()
        if (!expensesByCategory[category]) {
          expensesByCategory[category] = 0
        }
        expensesByCategory[category] += expense.amount
      })

      // Update budget categories with actual amounts
      budgetData.categories = budgetData.categories.map((category) => {
        const categoryName = category.name.toLowerCase()
        if (expensesByCategory[categoryName]) {
          category.actualAmount = expensesByCategory[categoryName]
        }
        return category
      })

      // Add "Other" category for uncategorized expenses
      let otherExpenses = 0
      Object.keys(expensesByCategory).forEach((category) => {
        if (!budgetData.categories.some((c) => c.name.toLowerCase() === category)) {
          otherExpenses += expensesByCategory[category]
        }
      })

      if (otherExpenses > 0) {
        const otherCategory = budgetData.categories.find((c) => c.name.toLowerCase() === "other")
        if (otherCategory) {
          otherCategory.actualAmount += otherExpenses
        } else {
          budgetData.categories.push({
            name: "Other",
            plannedAmount: 0,
            actualAmount: otherExpenses,
            color: "#9CA3AF", // Gray color
          })
        }
      }
    }

    res.json(budgetData)
  } catch (err) {
    console.error(`Error in GET /api/budgets/monthly/${req.params.month}/${req.params.year}:`, err.message)
    res.status(500).json({ message: err.message })
  }
})

// Update actual spending for a category
router.route("/:id/category/:categoryId").put(async (req, res) => {
  try {
    const { id, categoryId } = req.params
    const { actualAmount } = req.body

    if (actualAmount === undefined || isNaN(Number(actualAmount))) {
      return res.status(400).json({ message: "Valid actual amount is required" })
    }

    const budget = await Budget.findById(id)
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" })
    }

    const categoryIndex = budget.categories.findIndex((c) => c._id.toString() === categoryId)
    if (categoryIndex === -1) {
      return res.status(404).json({ message: "Category not found in this budget" })
    }

    budget.categories[categoryIndex].actualAmount = Number(actualAmount)
    await budget.save()

    res.json(budget)
  } catch (err) {
    console.error(`Error updating category actual amount:`, err.message)
    res.status(500).json({ message: err.message })
  }
})

module.exports = router

