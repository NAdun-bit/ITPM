"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

function ExpenseList({ expenses = [], onEdit, onDelete }) {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [exchangeRate, setExchangeRate] = useState(null)

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=LKR")
        const data = await response.json()
        setExchangeRate(data.rates.LKR)
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error)
      }
    }

    fetchExchangeRate()
  }, [])

  const filteredExpenses = expenses.filter((expense) => {
    // Skip undefined or null expenses
    if (!expense) return false

    const matchesFilter =
      filter === "all" ||
      (filter === "paid" && expense.status === "Paid") ||
      (filter === "pending" && expense.status === "Pending")

    const matchesSearch =
      (expense.description ? expense.description.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (expense.participants
        ? expense.participants.some((p) =>
            p && p.name ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) : false,
          )
        : false)

    return matchesFilter && matchesSearch
  })

  const handleDeleteClick = (id) => setConfirmDelete(id)

  const confirmDeleteExpense = async () => {
    if (confirmDelete) {
      try {
        setActionLoading(confirmDelete)
        const success = await onDelete(confirmDelete)
        if (success) setConfirmDelete(null)
      } finally {
        setActionLoading(null)
      }
    }
  }

  const handleEditClick = (expense) => onEdit(expense)

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search expenses or participants..."
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-auto flex">
          <select
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Expenses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filter !== "all"
              ? "Try adjusting your search or filter to find what you're looking for."
              : "Get started by creating a new expense."}
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => document.querySelector('button[data-tab="add"]')?.click()}
            >
              Add Expense
            </button>
          </div>
        </div>
      ) : (
        <motion.div className="overflow-hidden" variants={listVariants} initial="hidden" animate="visible">
          <ul className="divide-y divide-gray-200">
            <AnimatePresence>
              {filteredExpenses.map((expense) => (
                <motion.li key={expense._id} className="py-4" variants={itemVariants} layout exit="exit">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          expense.status === "Paid" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {expense.status === "Paid" ? <span>✔</span> : <span>⏳</span>}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {expense.description || "Unnamed Expense"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(expense.date).toLocaleDateString()} •{" "}
                          {expense.participants ? expense.participants.length : 0} participants
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-6 text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ${expense.amount ? expense.amount.toFixed(2) : "0.00"}{" "}
                          {exchangeRate && expense.amount && (
                            <span className="text-xs text-gray-500 ml-1">
                              (LKR {(expense.amount * exchangeRate).toFixed(2)})
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          $
                          {expense.amount && expense.participants && expense.participants.length > 0
                            ? (expense.amount / expense.participants.length).toFixed(2)
                            : "0.00"}{" "}
                          per person
                          {exchangeRate &&
                            expense.amount &&
                            expense.participants &&
                            expense.participants.length > 0 && (
                              <span className="ml-1">
                                (LKR {((expense.amount * exchangeRate) / expense.participants.length).toFixed(2)})
                              </span>
                            )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                          onClick={() => handleEditClick(expense)}
                          disabled={actionLoading === expense._id}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
                          onClick={() => handleDeleteClick(expense._id)}
                          disabled={actionLoading === expense._id}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">Participants:</div>
                    <div className="flex flex-wrap gap-2">
                      {expense.participants &&
                        expense.participants.map(
                          (participant, index) =>
                            participant && (
                              <span
                                key={index}
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  participant.hasPaid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {participant.name || "Unnamed"}
                                {participant.hasPaid && <span className="ml-1">✔</span>}
                              </span>
                            ),
                        )}
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>
      )}

      {confirmDelete && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block bg-white rounded-lg text-left shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="bg-white p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Expense</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Are you sure you want to delete this expense? This action cannot be undone.
                </p>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-white hover:bg-red-700 sm:ml-3 sm:w-auto"
                  onClick={confirmDeleteExpense}
                  disabled={actionLoading === confirmDelete}
                >
                  {actionLoading === confirmDelete ? "Deleting..." : "Delete"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto"
                  onClick={() => setConfirmDelete(null)}
                  disabled={actionLoading === confirmDelete}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpenseList
