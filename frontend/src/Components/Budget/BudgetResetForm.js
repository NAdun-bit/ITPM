"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { resetBudget } from "../../Services/budgetService"

function BudgetResetForm({ budget, onReset }) {
  const [carryForward, setCarryForward] = useState(true)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  if (!budget) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No budget selected</h3>
        <p className="mt-1 text-sm text-gray-500">Please select a budget to reset.</p>
      </div>
    )
  }

  const getMonthName = (month) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return monthNames[month - 1]
  }

  const handleReset = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      const result = await resetBudget(budget._id, carryForward)

      setSuccess(`Budget has been reset for the next month!`)
      setIsConfirming(false)

      if (onReset) {
        onReset(result)
      }
    } catch (err) {
      console.error("Error resetting budget:", err)
      setError("Failed to reset budget. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Budget Reset</h2>
        <p className="text-gray-500">Reset your budget at month-end or carry forward unused balances</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900">Current Budget</h3>
          <p className="text-gray-500">
            {budget.name} - {getMonthName(budget.month)} {budget.year}
          </p>
        </div>

        {isConfirming ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Confirm Budget Reset</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Are you sure you want to reset this budget? This will:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Create a new budget for the next month</li>
                    <li>
                      {carryForward
                        ? "Carry forward any unused balances to the next month"
                        : "Start fresh with the same planned amounts but zero actual spending"}
                    </li>
                    <li>Keep your existing categories and settings</li>
                  </ul>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    onClick={handleReset}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Confirm Reset"}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setIsConfirming(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  id="carry-forward"
                  name="reset-option"
                  type="radio"
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  checked={carryForward}
                  onChange={() => setCarryForward(true)}
                />
                <label htmlFor="carry-forward" className="ml-3 block text-sm font-medium text-gray-700">
                  Carry forward unused balances
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500 ml-7">
                Any unspent money in each category will be added to next month's budget
              </p>

              <div className="flex items-center mt-4">
                <input
                  id="reset-completely"
                  name="reset-option"
                  type="radio"
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  checked={!carryForward}
                  onChange={() => setCarryForward(false)}
                />
                <label htmlFor="reset-completely" className="ml-3 block text-sm font-medium text-gray-700">
                  Reset completely
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500 ml-7">
                Start fresh with the same planned amounts but zero actual spending
              </p>
            </div>

            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setIsConfirming(true)}
            >
              Reset Budget
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default BudgetResetForm

