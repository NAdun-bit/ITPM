"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import SavingsGoalList from "./SavingsGoalList"
import SavingsGoalForm from "./SavingsGoalForm"
import SavingsGoalStats from "./SavingsGoalStats"
import SavingsGoalReports from "./SavingsGoalReports"
import {
  fetchSavingsGoals,
  addSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
} from "../../Services/savingsGoalService"

function SavingsDashboard() {
  const [savingsGoals, setSavingsGoals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("list")
  const [currentGoal, setCurrentGoal] = useState(null)

  useEffect(() => {
    const getSavingsGoals = async () => {
      try {
        setIsLoading(true)
        console.log("Attempting to fetch savings goals...")
        const data = await fetchSavingsGoals()
        console.log("Savings goals fetched successfully:", data)
        setSavingsGoals(data)
        setError(null)
      } catch (err) {
        console.error("Error in SavingsDashboard:", err)
        setError("Failed to fetch savings goals. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    getSavingsGoals()
  }, [])

  const handleAddSavingsGoal = async (goalData) => {
    try {
      setIsLoading(true)
      const newGoal = await addSavingsGoal(goalData)
      setSavingsGoals([...savingsGoals, newGoal])
      setActiveTab("list")
      return true
    } catch (err) {
      setError("Failed to add savings goal. Please try again.")
      console.error(err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateSavingsGoal = async (id, goalData) => {
    try {
      setIsLoading(true)
      const updatedGoal = await updateSavingsGoal(id, goalData)
      setSavingsGoals(savingsGoals.map((goal) => (goal._id === id ? updatedGoal : goal)))
      setCurrentGoal(null)
      setActiveTab("list")
      return true
    } catch (err) {
      setError("Failed to update savings goal. Please try again.")
      console.error(err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSavingsGoal = async (id) => {
    try {
      setIsLoading(true)
      await deleteSavingsGoal(id)
      setSavingsGoals(savingsGoals.filter((goal) => goal._id !== id))
      return true
    } catch (err) {
      setError("Failed to delete savings goal. Please try again.")
      console.error(err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditSavingsGoal = (goal) => {
    setCurrentGoal(goal)
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
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Savings Goals</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Set and track your financial goals to achieve your dreams.
          </p>
        </motion.div>

        {error && (
          <motion.div
            className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            variants={itemVariants}
          >
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => window.location.reload()}
              className="ml-4 px-3 py-1 bg-red-200 hover:bg-red-300 rounded text-sm"
            >
              Retry
            </button>
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
                >
                  Goals
                </button>
                <button
                  className={`${
                    activeTab === "add"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => {
                    setCurrentGoal(null)
                    setActiveTab("add")
                  }}
                >
                  {currentGoal ? "Edit Goal" : "Add Goal"}
                </button>
                <button
                  className={`${
                    activeTab === "stats"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab("stats")}
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
                  <SavingsGoalList
                    savingsGoals={savingsGoals}
                    onEdit={handleEditSavingsGoal}
                    onDelete={handleDeleteSavingsGoal}
                  />
                )}

                {activeTab === "add" && (
                  <SavingsGoalForm
                    goal={currentGoal}
                    onSubmit={
                      currentGoal ? (data) => handleUpdateSavingsGoal(currentGoal._id, data) : handleAddSavingsGoal
                    }
                  />
                )}

                {activeTab === "stats" && <SavingsGoalStats savingsGoals={savingsGoals} />}

                {activeTab === "reports" && <SavingsGoalReports savingsGoals={savingsGoals} />}
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

export default SavingsDashboard

