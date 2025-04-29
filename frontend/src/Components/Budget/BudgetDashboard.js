"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import BudgetList from "./BudgetList"
import BudgetForm from "./BudgetForm"
import BudgetDetails from "./BudgetDetails"
import BudgetInsights from "./BudgetInsights"
import { fetchBudgets, addBudget, updateBudget, deleteBudget } from "../../Services/budgetService"

function BudgetDashboard() {
  const [budgets, setBudgets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("list")
  const [currentBudget, setCurrentBudget] = useState(null)
  const [selectedBudgetId, setSelectedBudgetId] = useState(null)

  useEffect(() => {
    const getBudgets = async () => {
      try {
        setIsLoading(true)
        const data = await fetchBudgets()
        setBudgets(data)

        // If there are budgets, select the most recent one by default
        if (data.length > 0 && !selectedBudgetId) {
          setSelectedBudgetId(data[0]._id)
        }

        setError(null)
      } catch (err) {
        setError("Failed to fetch budgets. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    getBudgets()
  }, [])

  const handleAddBudget = async (budgetData) => {
    try {
      setIsLoading(true)
      const newBudget = await addBudget(budgetData)
      setBudgets([newBudget, ...budgets])
      setActiveTab("list")
      return true
    } catch (err) {
      setError("Failed to add budget. Please try again.")
      console.error(err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateBudget = async (id, budgetData) => {
    try {
      setIsLoading(true)
      const updatedBudget = await updateBudget(id, budgetData)
      setBudgets(budgets.map((budget) => (budget._id === id ? updatedBudget : budget)))
      setCurrentBudget(null)
      setActiveTab("list")
      return true
    } catch (err) {
      setError("Failed to update budget. Please try again.")
      console.error(err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBudget = async (id) => {
    try {
      setIsLoading(true)
      await deleteBudget(id)
      setBudgets(budgets.filter((budget) => budget._id !== id))

      // If the deleted budget was selected, select another one
      if (selectedBudgetId === id) {
        const remainingBudgets = budgets.filter((budget) => budget._id !== id)
        setSelectedBudgetId(remainingBudgets.length > 0 ? remainingBudgets[0]._id : null)
      }

      return true
    } catch (err) {
      setError("Failed to delete budget. Please try again.")
      console.error(err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditBudget = (budget) => {
    setCurrentBudget(budget)
    setActiveTab("add")
  }

  const handleViewBudget = (budgetId) => {
    setSelectedBudgetId(budgetId)
    setActiveTab("details")
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
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Budget Planning</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Create and manage your monthly budgets to take control of your finances.
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
                  Budgets
                </button>
                <button
                  className={`${
                    activeTab === "add"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => {
                    setCurrentBudget(null)
                    setActiveTab("add")
                  }}
                  data-tab="add"
                >
                  {currentBudget ? "Edit Budget" : "Create Budget"}
                </button>
                <button
                  className={`${
                    activeTab === "details"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab("details")}
                  data-tab="details"
                  disabled={!selectedBudgetId}
                >
                  Budget Details
                </button>
                <button
                  className={`${
                    activeTab === "insights"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab("insights")}
                  data-tab="insights"
                >
                  Insights
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
                  <BudgetList
                    budgets={budgets}
                    onEdit={handleEditBudget}
                    onDelete={handleDeleteBudget}
                    onView={handleViewBudget}
                    selectedBudgetId={selectedBudgetId}
                  />
                )}

                {activeTab === "add" && (
                  <BudgetForm
                    budget={currentBudget}
                    onSubmit={currentBudget ? (data) => handleUpdateBudget(currentBudget._id, data) : handleAddBudget}
                  />
                )}

                {activeTab === "details" && (
                  <BudgetDetails budgetId={selectedBudgetId} budgets={budgets} onBudgetChange={setSelectedBudgetId} />
                )}

                {activeTab === "insights" && <BudgetInsights budgets={budgets} />}
              </>
            )}
          </div>
        </motion.div>

        <motion.div className="mt-8 text-center" variants={itemVariants}>
          <p className="text-gray-500">
            Need help? Check out our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Budget Planning Guide
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

export default BudgetDashboard

