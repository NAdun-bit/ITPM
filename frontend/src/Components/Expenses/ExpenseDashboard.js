"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ExpenseList from "./ExpenseList"
import ExpenseForm from "./ExpenseForm"
import ExpenseStats from "./ExpenseStats"
import ExpenseReports from "./ExpenseReports"
import { fetchExpenses, addExpense, updateExpense, deleteExpense } from "../../Services/expenseService"

function ExpenseDashboard() {
  const [expenses, setExpenses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("list")
  const [currentExpense, setCurrentExpense] = useState(null)

  useEffect(() => {
    const getExpenses = async () => {
      try {
        setIsLoading(true)
        const data = await fetchExpenses()
        console.log("Fetched expenses:", data)
        setExpenses(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching expenses:", err)
        setError("Failed to fetch expenses. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    getExpenses()
  }, [])

  const handleAddExpense = async (expenseData) => {
    try {
      setIsLoading(true)
      console.log("Adding expense:", expenseData)
      const newExpense = await addExpense(expenseData)
      console.log("New expense added:", newExpense)
      setExpenses([...expenses, newExpense])
      setActiveTab("list")
      return true
    } catch (err) {
      console.error("Error adding expense:", err)
      setError(err.response?.data?.message || "Failed to add expense. Please try again.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateExpense = async (id, expenseData) => {
    try {
      setIsLoading(true)
      console.log("Updating expense:", id, expenseData)
      const updatedExpense = await updateExpense(id, expenseData)
      console.log("Expense updated:", updatedExpense)
      setExpenses(expenses.map((expense) => (expense._id === id ? updatedExpense : expense)))
      setCurrentExpense(null)
      setActiveTab("list")
      return true
    } catch (err) {
      console.error("Error updating expense:", err)
      setError(err.response?.data?.message || "Failed to update expense. Please try again.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteExpense = async (id) => {
    try {
      setIsLoading(true)
      console.log("Deleting expense:", id)
      await deleteExpense(id)
      console.log("Expense deleted successfully")
      setExpenses(expenses.filter((expense) => expense._id !== id))
      return true
    } catch (err) {
      console.error("Error deleting expense:", err)
      setError(err.response?.data?.message || "Failed to delete expense. Please try again.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditExpense = (expense) => {
    setCurrentExpense(expense)
    setActiveTab("add")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Expense Splitting</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Easily manage and split expenses with friends, roommates, or travel companions.
          </p>
        </motion.div>

        {error && (
          <motion.div
            className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            variants={itemVariants}
          >
            <span className="block sm:inline">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </motion.div>
        )}

        <motion.div
          className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
          variants={itemVariants}
        >
          <div className="px-4 py-5 sm:px-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  className={`${
                    activeTab === "list"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab("list")}
                  data-tab="list"
                >
                  Expenses
                </button>
                <button
                  className={`${
                    activeTab === "add"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => {
                    setCurrentExpense(null)
                    setActiveTab("add")
                  }}
                  data-tab="add"
                >
                  {currentExpense ? "Edit Expense" : "Add Expense"}
                </button>
                <button
                  className={`${
                    activeTab === "stats"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab("stats")}
                  data-tab="stats"
                >
                  Statistics
                </button>
                <button
                  className={`${
                    activeTab === "reports"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab("reports")}
                  data-tab="reports"
                >
                  Reports
                </button>
              </nav>
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {isLoading && activeTab !== "add" ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {activeTab === "list" && (
                  <ExpenseList expenses={expenses} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />
                )}

                {activeTab === "add" && (
                  <ExpenseForm
                    expense={currentExpense}
                    onSubmit={
                      currentExpense ? (data) => handleUpdateExpense(currentExpense._id, data) : handleAddExpense
                    }
                  />
                )}

                {activeTab === "stats" && <ExpenseStats expenses={expenses} />}

                {activeTab === "reports" && <ExpenseReports expenses={expenses} />}
              </>
            )}
          </div>
        </motion.div>

        <motion.div className="mt-8 text-center" variants={itemVariants}>
          <p className="text-gray-500">
            Need help? Check out our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              FAQ
            </a>{" "}
            or{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              contact support
            </a>
            .
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ExpenseDashboard
