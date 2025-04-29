// Import dependencies
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

// Initialize express app and dotenv
dotenv.config()
const app = express()

// App port
const PORT = process.env.PORT || 8070

// Log environment variables (without exposing sensitive info)
console.log("Environment variables check:")
console.log("- PORT:", PORT)
console.log("- MONGODB_URL/URI exists:", !!process.env.MONGODB_URL || !!process.env.MONGODB_URI)

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
)
app.use(express.json()) // Use built-in JSON parser

// MongoDB connection
const URL = process.env.MONGODB_URL || process.env.MONGODB_URI
console.log("Attempting to connect to MongoDB...")

mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err)
    process.exit(1)
  })

// Check connection once open
mongoose.connection.once("open", () => {
  console.log("✅ MongoDB Connection is open!")
})

// Import routes
const expenseRouter = require("./routes/expense.routes")
const savingsGoalRouter = require("./routes/savingsGoal.routes")
const budgetRouter = require("./routes/budget.routes")
const transactionRouter = require("./routes/transaction.routes")

// Use routes
app.use("/api/expenses", expenseRouter)
app.use("/api/savings-goals", savingsGoalRouter)
app.use("/api/budgets", budgetRouter)
app.use("/api/transactions", transactionRouter)

// Test routes
app.get("/", (req, res) => res.send("🚀 Backend server is running!"))
app.get("/api/test", (req, res) => res.json({ message: "API is working!" }))

// Graceful shutdown handling
process.on("SIGINT", async () => {
  console.log("❌ Server shutting down... Closing MongoDB connection.")
  await mongoose.connection.close()
  process.exit(0)
})

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`)
}) 
