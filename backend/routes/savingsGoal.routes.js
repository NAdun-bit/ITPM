const router = require("express").Router()
const SavingsGoal = require("../models/savingsGoal.model")

// Get all savings goals
router.route("/").get(async (req, res) => {
  try {
    console.log("GET /api/savings-goals - Fetching all savings goals")
    const savingsGoals = await SavingsGoal.find().sort({ createdAt: -1 })
    console.log(`Found ${savingsGoals.length} savings goals`)
    res.json(savingsGoals)
  } catch (err) {
    console.error("Error in GET /api/savings-goals:", err.message)
    res.status(500).json({ message: err.message })
  }
})

// Add a new savings goal
router.route("/add").post(async (req, res) => {
  try {
    console.log("POST /api/savings-goals/add - Adding new savings goal")
    const { name, targetAmount, startDate, endDate, category, description, monthlyContribution, priority } = req.body

    // Validate required fields
    if (!name || !targetAmount || !endDate) {
      console.log("Missing required fields:", { name, targetAmount, endDate })
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Validate end date is in the future
    const endDateObj = new Date(endDate)
    if (endDateObj <= new Date()) {
      return res.status(400).json({ message: "End date must be in the future" })
    }

    // Validate target amount is positive
    if (targetAmount <= 0) {
      return res.status(400).json({ message: "Target amount must be positive" })
    }

    const newSavingsGoal = new SavingsGoal({
      name,
      targetAmount,
      startDate: startDate || new Date(),
      endDate,
      category: category || "Other",
      description: description || "",
      monthlyContribution: monthlyContribution || 0,
      priority: priority || "Medium",
    })

    const savedSavingsGoal = await newSavingsGoal.save()
    console.log("Savings goal saved successfully with ID:", savedSavingsGoal._id)
    res.status(201).json(savedSavingsGoal)
  } catch (err) {
    console.error("Error in POST /api/savings-goals/add:", err.message)
    res.status(400).json({ message: err.message })
  }
})

// Get a specific savings goal
router.route("/:id").get(async (req, res) => {
  try {
    console.log(`GET /api/savings-goals/${req.params.id} - Fetching savings goal`)
    const savingsGoal = await SavingsGoal.findById(req.params.id)
    if (!savingsGoal) {
      console.log(`Savings goal with ID ${req.params.id} not found`)
      return res.status(404).json({ message: "Savings goal not found" })
    }
    console.log("Savings goal found:", savingsGoal._id)
    res.json(savingsGoal)
  } catch (err) {
    console.error(`Error in GET /api/savings-goals/${req.params.id}:`, err.message)
    res.status(500).json({ message: err.message })
  }
})

// Update a savings goal
router.route("/:id").put(async (req, res) => {
  try {
    console.log(`PUT /api/savings-goals/${req.params.id} - Updating savings goal`)
    const { name, targetAmount, endDate, category, description, monthlyContribution, priority, isCompleted } = req.body

    // Validate required fields
    if (!name || !targetAmount || !endDate) {
      console.log("Missing required fields:", { name, targetAmount, endDate })
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Validate end date is in the future if not completed
    if (!isCompleted) {
      const endDateObj = new Date(endDate)
      if (endDateObj <= new Date()) {
        return res.status(400).json({ message: "End date must be in the future for active goals" })
      }
    }

    // Validate target amount is positive
    if (targetAmount <= 0) {
      return res.status(400).json({ message: "Target amount must be positive" })
    }

    const updatedSavingsGoal = await SavingsGoal.findByIdAndUpdate(
      req.params.id,
      {
        name,
        targetAmount,
        endDate,
        category: category || "Other",
        description: description || "",
        monthlyContribution: monthlyContribution || 0,
        priority: priority || "Medium",
        isCompleted: isCompleted || false,
      },
      { new: true, runValidators: true },
    )

    if (!updatedSavingsGoal) {
      console.log(`Savings goal with ID ${req.params.id} not found for update`)
      return res.status(404).json({ message: "Savings goal not found" })
    }

    console.log("Savings goal updated successfully:", updatedSavingsGoal._id)
    res.json(updatedSavingsGoal)
  } catch (err) {
    console.error(`Error in PUT /api/savings-goals/${req.params.id}:`, err.message)
    res.status(400).json({ message: err.message })
  }
})

// Delete a savings goal
router.route("/:id").delete(async (req, res) => {
  try {
    console.log(`DELETE /api/savings-goals/${req.params.id} - Deleting savings goal`)
    const deletedSavingsGoal = await SavingsGoal.findByIdAndDelete(req.params.id)

    if (!deletedSavingsGoal) {
      console.log(`Savings goal with ID ${req.params.id} not found for deletion`)
      return res.status(404).json({ message: "Savings goal not found" })
    }

    console.log("Savings goal deleted successfully:", deletedSavingsGoal._id)
    res.json({ message: "Savings goal deleted successfully", id: deletedSavingsGoal._id })
  } catch (err) {
    console.error(`Error in DELETE /api/savings-goals/${req.params.id}:`, err.message)
    res.status(500).json({ message: err.message })
  }
})

// Add a contribution to a savings goal
router.route("/:id/contribute").post(async (req, res) => {
  try {
    console.log(`POST /api/savings-goals/${req.params.id}/contribute - Adding contribution`)
    const { amount, note } = req.body

    // Validate amount is positive
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Contribution amount must be positive" })
    }

    const savingsGoal = await SavingsGoal.findById(req.params.id)
    if (!savingsGoal) {
      return res.status(404).json({ message: "Savings goal not found" })
    }

    await savingsGoal.addContribution(amount, note)
    console.log(`Added contribution of ${amount} to savings goal ${savingsGoal._id}`)

    res.json(savingsGoal)
  } catch (err) {
    console.error(`Error in POST /api/savings-goals/${req.params.id}/contribute:`, err.message)
    res.status(400).json({ message: err.message })
  }
})

// Generate report for a savings goal
router.route("/:id/report").get(async (req, res) => {
  try {
    console.log(`GET /api/savings-goals/${req.params.id}/report - Generating report`)
    const savingsGoal = await SavingsGoal.findById(req.params.id)

    if (!savingsGoal) {
      return res.status(404).json({ message: "Savings goal not found" })
    }

    // Calculate additional report data
    const today = new Date()
    const startDate = new Date(savingsGoal.startDate)
    const endDate = new Date(savingsGoal.endDate)

    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
    const elapsedDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24))
    const remainingDays = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)))

    const timeProgress = totalDays > 0 ? (elapsedDays / totalDays) * 100 : 0
    const amountProgress = (savingsGoal.currentAmount / savingsGoal.targetAmount) * 100

    const isOnTrack = amountProgress >= timeProgress

    const requiredDailyContribution =
      remainingDays > 0 ? (savingsGoal.targetAmount - savingsGoal.currentAmount) / remainingDays : 0

    const report = {
      goalId: savingsGoal._id,
      name: savingsGoal.name,
      targetAmount: savingsGoal.targetAmount,
      currentAmount: savingsGoal.currentAmount,
      remainingAmount: savingsGoal.targetAmount - savingsGoal.currentAmount,
      startDate: savingsGoal.startDate,
      endDate: savingsGoal.endDate,
      totalDays,
      elapsedDays,
      remainingDays,
      timeProgress: Number.parseFloat(timeProgress.toFixed(2)),
      amountProgress: Number.parseFloat(amountProgress.toFixed(2)),
      isOnTrack,
      requiredDailyContribution: Number.parseFloat(requiredDailyContribution.toFixed(2)),
      contributions: savingsGoal.contributions,
      isCompleted: savingsGoal.isCompleted,
      category: savingsGoal.category,
      priority: savingsGoal.priority,
    }

    res.json(report)
  } catch (err) {
    console.error(`Error in GET /api/savings-goals/${req.params.id}/report:`, err.message)
    res.status(500).json({ message: err.message })
  }
})

module.exports = router

