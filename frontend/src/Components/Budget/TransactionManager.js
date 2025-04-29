"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import TransactionForm from "./TransactionForm"
import TransactionList from "./TransactionList"
import { fetchBudgets } from "../../Services/budgetService"
import { fetchTransactions, searchTransactions } from "../../Services/transactionService"

function TransactionManager() {
  const [budgets, setBudgets] = useState([])
  const [selectedBudgetId, setSelectedBudgetId] = useState("")
  const [transactions, setTransactions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load budgets on component mount
  useEffect(() => {
    const loadBudgets = async () => {
      try {
        setIsLoading(true)
        const data = await fetchBudgets()
        console.log("Budgets loaded:", data)
        setBudgets(data)

        if (data.length > 0) {
          setSelectedBudgetId(data[0]._id)
        }
        setError(null)
      } catch (err) {
        console.error("Error loading budgets:", err)
        setError("Failed to load budgets. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadBudgets()
  }, [])

  // Load transactions when budget selection changes
  useEffect(() => {
    if (!selectedBudgetId) {
      setTransactions([])
      setIsLoading(false)
      return
    }

    const loadTransactions = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Try to use searchTransactions first, fall back to fetchTransactions if needed
        let results = []
        try {
          results = await searchTransactions({ budgetId: selectedBudgetId })
          console.log("Transactions loaded via search:", results)
        } catch (searchErr) {
          console.warn("Search transactions failed, falling back to fetch all:", searchErr)
          const allTransactions = await fetchTransactions()
          console.log("All transactions loaded:", allTransactions)
          results = allTransactions.filter((t) => t.budgetId === selectedBudgetId)
        }

        setTransactions(results)
      } catch (err) {
        console.error("Error loading transactions:", err)
        setError("Failed to load transactions. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadTransactions()
  }, [selectedBudgetId])

  // Handle budget selection change
  const handleBudgetChange = (e) => {
    setSelectedBudgetId(e.target.value)
  }

  // Handle transaction form success
  const handleTransactionSuccess = (transaction) => {
    console.log("Transaction saved successfully:", transaction)

    // Refresh transactions
    if (selectedBudgetId) {
      searchTransactions({ budgetId: selectedBudgetId })
        .then((results) => {
          console.log("Refreshed transactions:", results)
          setTransactions(results)
        })
        .catch((err) => {
          console.error("Error refreshing transactions:", err)
          // Try to fetch all transactions as a fallback
          fetchTransactions()
            .then((allTransactions) => {
              const filteredTransactions = allTransactions.filter((t) => t.budgetId === selectedBudgetId)
              setTransactions(filteredTransactions)
            })
            .catch((fetchErr) => {
              console.error("Error fetching all transactions:", fetchErr)
            })
        })
    }

    // Close form and reset editing state
    setShowForm(false)
    setEditingTransaction(null)
  }

  // Handle edit transaction
  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  // Handle delete transaction
  const handleDeleteTransaction = (id) => {
    // Remove from local state immediately for better UX
    setTransactions((prev) => prev.filter((t) => t._id !== id))
  }

  // Get categories from selected budget
  const getCategories = () => {
    const selectedBudget = budgets.find((b) => b._id === selectedBudgetId)
    return selectedBudget ? selectedBudget.categories : []
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
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
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Transaction Manager</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Track and manage your spending across different budget categories
          </p>
        </div>

        {/* Budget Selection */}
        <div className="mb-8">
          <label htmlFor="budget-select" className="block text-sm font-medium text-gray-700">
            Select Budget
          </label>
          <select
            id="budget-select"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={selectedBudgetId}
            onChange={handleBudgetChange}
          >
            <option value="">Select a budget</option>
            {budgets.map((budget) => (
              <option key={budget._id} value={budget._id}>
                {budget.name} - {budget.month}/{budget.year}
              </option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Add Transaction Button */}
        {selectedBudgetId && !showForm && (
          <div className="mb-8">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                setEditingTransaction(null)
                setShowForm(true)
              }}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Transaction
            </button>
          </div>
        )}

        {/* Transaction Form */}
        {showForm && selectedBudgetId && (
          <div className="mb-8">
            <TransactionForm
              budgetId={selectedBudgetId}
              categories={getCategories()}
              existingTransaction={editingTransaction}
              onSuccess={handleTransactionSuccess}
              onCancel={() => {
                setShowForm(false)
                setEditingTransaction(null)
              }}
            />
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Transaction List */}
        {!isLoading && selectedBudgetId && transactions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
            <TransactionList
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              onRefresh={() => handleTransactionSuccess()}
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && selectedBudgetId && transactions.length === 0 && !showForm && (
          <div className="text-center py-12 bg-white shadow rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first transaction.</p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  setEditingTransaction(null)
                  setShowForm(true)
                }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Transaction
              </button>
            </div>
          </div>
        )}

        {/* No Budget Selected */}
        {!isLoading && !selectedBudgetId && (
          <div className="text-center py-12 bg-white shadow rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No budget selected</h3>
            <p className="mt-1 text-sm text-gray-500">Please select a budget to manage transactions.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default TransactionManager