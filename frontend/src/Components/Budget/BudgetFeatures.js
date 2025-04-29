"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import CategoryVisualization from "./CategoryVisualization"
import CustomCategoryForm from "./CustomCategoryForm"
import BudgetResetForm from "./BudgetResetForm"
import TransactionFilter from "./TransactionFilter"
import TransactionResults from "./TransactionResults"
import { fetchBudgets } from "../../Services/budgetService"

// Custom Tab component to replace @headlessui/react
const TabItem = ({ isActive, onClick, children }) => (
  <button
    className={`${
      isActive
        ? "border-blue-500 text-blue-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
    onClick={onClick}
  >
    {children}
  </button>
)

function BudgetFeatures() {
  const [activeTab, setActiveTab] = useState(0)
  const [budgets, setBudgets] = useState([])
  const [selectedBudgetId, setSelectedBudgetId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    const loadBudgets = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchBudgets()
        setBudgets(data)

        if (data.length > 0 && !selectedBudgetId) {
          setSelectedBudgetId(data[0]._id)
        }
      } catch (err) {
        console.error("Error loading budgets:", err)
        setError("Failed to load budgets. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadBudgets()
  }, [])

  const handleBudgetChange = (e) => {
    setSelectedBudgetId(e.target.value)
  }

  const handleCategoryAdded = async () => {
    try {
      const data = await fetchBudgets()
      setBudgets(data)
    } catch (err) {
      console.error("Error refreshing budgets:", err)
    }
  }

  const handleBudgetReset = (newBudget) => {
    // Refresh budgets and select the new budget
    fetchBudgets()
      .then((data) => {
        setBudgets(data)
        setSelectedBudgetId(newBudget._id)
      })
      .catch((err) => {
        console.error("Error refreshing budgets after reset:", err)
      })
  }

  const handleSearchResults = (results) => {
    setSearchResults(results)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  // Render the appropriate tab content based on activeTab state
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <CategoryVisualization budgetId={selectedBudgetId} />
      case 1:
        return <CustomCategoryForm budgetId={selectedBudgetId} onCategoryAdded={handleCategoryAdded} />
      case 2:
        return <BudgetResetForm budget={budgets.find((b) => b._id === selectedBudgetId)} onReset={handleBudgetReset} />
      case 3:
        return (
          <div className="space-y-8">
            <TransactionFilter budgetId={selectedBudgetId} onResultsFound={handleSearchResults} />

            {searchResults.length > 0 && (
              <TransactionResults transactions={searchResults} onRefresh={() => setSearchResults([])} />
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Budget Management</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Visualize, customize, and manage your budget with powerful tools
          </p>
        </div>

        {budgets.length === 0 ? (
          <div className="text-center py-12 bg-white shadow rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No budgets found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first budget.</p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => (window.location.href = "/budget")}
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Create Budget
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label htmlFor="budget-select" className="block text-sm font-medium text-gray-700">
                Select Budget
              </label>
              <select
                id="budget-select"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedBudgetId || ""}
                onChange={handleBudgetChange}
              >
                {budgets.map((budget) => (
                  <option key={budget._id} value={budget._id}>
                    {budget.name} - {budget.month}/{budget.year}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="flex border-b border-gray-200">
                <TabItem isActive={activeTab === 0} onClick={() => setActiveTab(0)}>
                  Category Visualization
                </TabItem>
                <TabItem isActive={activeTab === 1} onClick={() => setActiveTab(1)}>
                  Custom Categories
                </TabItem>
                <TabItem isActive={activeTab === 2} onClick={() => setActiveTab(2)}>
                  Budget Reset
                </TabItem>
                <TabItem isActive={activeTab === 3} onClick={() => setActiveTab(3)}>
                  Filter & Search
                </TabItem>
              </div>
              <div className="p-6">{renderTabContent()}</div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default BudgetFeatures

