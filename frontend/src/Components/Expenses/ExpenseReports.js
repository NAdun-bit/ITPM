"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"

function ExpenseReports({ expenses = [] }) {
  const [selectedParticipant, setSelectedParticipant] = useState("all")
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  })

  // Get unique participants from all expenses
  const participants = useMemo(() => {
    const uniqueParticipants = new Set()

    expenses.forEach((expense) => {
      // Skip undefined or null expenses or those without participants
      if (!expense || !expense.participants) return

      expense.participants.forEach((participant) => {
        // Skip undefined or null participants
        if (!participant || !participant.name) return
        uniqueParticipants.add(participant.name)
      })
    })

    return Array.from(uniqueParticipants)
  }, [expenses])

  // Filter expenses based on selected participant and date range
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      // Skip undefined or null expenses
      if (!expense) return false

      // Filter by date range if provided
      if (dateRange.start && dateRange.end) {
        // Skip expenses without dates
        if (!expense.date) return false

        const expenseDate = new Date(expense.date)
        const startDate = new Date(dateRange.start)
        const endDate = new Date(dateRange.end)
        endDate.setHours(23, 59, 59, 999) // Include the end date fully

        if (expenseDate < startDate || expenseDate > endDate) {
          return false
        }
      }

      // Filter by participant if not "all"
      if (selectedParticipant !== "all") {
        // Skip expenses without participants
        if (!expense.participants) return false

        return expense.participants.some((p) => p && p.name === selectedParticipant)
      }

      return true
    })
  }, [expenses, selectedParticipant, dateRange])

  // Calculate summary statistics
  const summary = useMemo(() => {
    const total = filteredExpenses.reduce((sum, expense) => sum + (expense?.amount || 0), 0)
    const paid = filteredExpenses.reduce((sum, expense) => {
      // Skip expenses without status
      if (!expense || !expense.status) return sum
      return sum + (expense.status === "Paid" ? expense.amount || 0 : 0)
    }, 0)
    const pending = total - paid

    // Calculate participant-specific amounts if a participant is selected
    let participantTotal = 0
    let participantPaid = 0
    let participantPending = 0

    if (selectedParticipant !== "all") {
      filteredExpenses.forEach((expense) => {
        // Skip undefined or null expenses or those without participants
        if (!expense || !expense.participants) return

        const participant = expense.participants.find((p) => p && p.name === selectedParticipant)
        if (!participant) return

        const share =
          expense.splitType === "custom"
            ? participant.share || 0
            : (expense.amount || 0) / (expense.participants.length || 1)

        participantTotal += share

        if (participant.hasPaid) {
          participantPaid += share
        } else {
          participantPending += share
        }
      })
    }

    return {
      total,
      paid,
      pending,
      count: filteredExpenses.length,
      participantTotal,
      participantPaid,
      participantPending,
    }
  }, [filteredExpenses, selectedParticipant])

  const handleDateChange = (e) => {
    const { name, value } = e.target
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="bg-white p-6 rounded-lg shadow-md" variants={itemVariants}>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Report</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label htmlFor="participant" className="block text-sm font-medium text-gray-700 mb-1">
              Participant
            </label>
            <select
              id="participant"
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              value={selectedParticipant}
              onChange={(e) => setSelectedParticipant(e.target.value)}
            >
              <option value="all">All Participants</option>
              {participants.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="start"
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              value={dateRange.start}
              onChange={handleDateChange}
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="end"
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              value={dateRange.end}
              onChange={handleDateChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-500">Total Expenses</h4>
            <p className="text-2xl font-bold text-gray-900">${summary.total.toFixed(2)}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-500">Paid</h4>
            <p className="text-2xl font-bold text-green-600">${summary.paid.toFixed(2)}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-500">Pending</h4>
            <p className="text-2xl font-bold text-yellow-600">${summary.pending.toFixed(2)}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-500">Number of Expenses</h4>
            <p className="text-2xl font-bold text-blue-600">{summary.count}</p>
          </div>
        </div>

        {selectedParticipant !== "all" && (
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <h4 className="text-sm font-medium text-blue-700 mb-2">{selectedParticipant}'s Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-blue-600">Total Share</p>
                <p className="text-lg font-bold text-blue-800">${summary.participantTotal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-green-600">Paid</p>
                <p className="text-lg font-bold text-green-800">${summary.participantPaid.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-yellow-600">Pending</p>
                <p className="text-lg font-bold text-yellow-800">${summary.participantPending.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Participants
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No expenses found for the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.date ? new Date(expense.date).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {expense.description || "Unnamed Expense"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${expense.amount ? expense.amount.toFixed(2) : "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          expense.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {expense.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.participants ? expense.participants.length : 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => window.print()}
          >
            <svg
              className="mr-2 -ml-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print Report
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ExpenseReports
