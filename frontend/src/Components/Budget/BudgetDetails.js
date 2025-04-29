"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { fetchMonthlyBudget, updateCategoryActual } from "../../Services/budgetService"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Edit2, Save } from "lucide-react"

function BudgetDetails({ budgetId, budgets, onBudgetChange }) {
  const [budget, setBudget] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editValue, setEditValue] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!budgetId) return

    const fetchBudgetDetails = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get the selected budget from the budgets array
        const selectedBudget = budgets.find((b) => b._id === budgetId)

        if (selectedBudget) {
          // Fetch the monthly budget with expense data
          const monthlyData = await fetchMonthlyBudget(selectedBudget.month, selectedBudget.year)
          setBudget(monthlyData)
        }
      } catch (err) {
        console.error("Error fetching budget details:", err)
        setError("Failed to load budget details. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBudgetDetails()
  }, [budgetId, budgets])

  const handleEditCategory = (categoryId, currentValue) => {
    setEditingCategory(categoryId)
    setEditValue(currentValue.toString())
  }

  const handleSaveCategory = async (categoryId) => {
    if (!editValue || isNaN(Number(editValue)) || Number(editValue) < 0) {
      return
    }

    try {
      setIsSaving(true)
      await updateCategoryActual(budgetId, categoryId, Number(editValue))

      // Update the local state
      setBudget((prev) => {
        if (!prev) return prev

        return {
          ...prev,
          categories: prev.categories.map((cat) =>
            cat._id === categoryId ? { ...cat, actualAmount: Number(editValue) } : cat,
          ),
        }
      })

      setEditingCategory(null)
    } catch (err) {
      console.error("Error updating category:", err)
      setError("Failed to update category. Please try again.")
    } finally {
      setIsSaving(false)
    }
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

  const getBudgetStatus = () => {
    if (!budget) return { text: "Unknown", color: "text-gray-500" }

    const totalPlanned = budget.categories.reduce((sum, cat) => sum + cat.plannedAmount, 0)
    const totalActual = budget.categories.reduce((sum, cat) => sum + cat.actualAmount, 0)

    if (totalActual > budget.totalIncome) return { text: "Overspent", color: "text-red-600" }
    if (totalActual > totalPlanned) return { text: "Warning", color: "text-yellow-600" }
    return { text: "Good", color: "text-green-600" }
  }

  const preparePieChartData = (type) => {
    if (!budget) return []

    return budget.categories.map((category) => ({
      name: category.name,
      value: type === "planned" ? category.plannedAmount : category.actualAmount,
      color: category.color,
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
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
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
        <p className="mt-1 text-sm text-gray-500">Please select a budget to view details.</p>
      </div>
    )
  }

  const status = getBudgetStatus()
  const totalPlanned = budget.categories.reduce((sum, cat) => sum + cat.plannedAmount, 0)
  const totalActual = budget.categories.reduce((sum, cat) => sum + cat.actualAmount, 0)
  const remaining = budget.totalIncome - totalActual

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{budget.name}</h2>
          <select
            className="block rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={budgetId}
            onChange={(e) => onBudgetChange(e.target.value)}
          >
            {budgets.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name} - {getMonthName(b.month)} {b.year}
              </option>
            ))}
          </select>
        </div>
        <p className="text-gray-500">
          {getMonthName(budget.month)} {budget.year}
        </p>
      </div>

      <motion.div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8" variants={itemVariants}>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Income</dt>
                  <dd className="text-lg font-semibold text-gray-900">${budget.totalIncome.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Remaining</dt>
                  <dd className={`text-lg font-semibold ${remaining < 0 ? "text-red-600" : "text-gray-900"}`}>
                    ${remaining.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 ${
                  status.text === "Overspent"
                    ? "bg-red-500"
                    : status.text === "Warning"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                } rounded-md p-3`}
              >
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Status</dt>
                  <dd className={`text-lg font-semibold ${status.color}`}>{status.text}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8" variants={itemVariants}>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Planned vs. Actual Spending</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={preparePieChartData("planned")}
                    cx="30%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {preparePieChartData("planned").map((entry, index) => (
                      <Cell key={`cell-planned-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Pie
                    data={preparePieChartData("actual")}
                    cx="70%"
                    cy="50%"
                    outerRadius={60}
                    fill="#82ca9d"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {preparePieChartData("actual").map((entry, index) => (
                      <Cell key={`cell-actual-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    payload={[
                      { value: "Planned", type: "circle", color: "#8884d8" },
                      { value: "Actual", type: "circle", color: "#82ca9d" },
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Total Planned</p>
                <p className="text-lg font-semibold">${totalPlanned.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Actual</p>
                <p className="text-lg font-semibold">${totalActual.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Progress</h3>
            <div className="space-y-4">
              {budget.categories.map((category) => {
                const percentage =
                  category.plannedAmount > 0 ? Math.min(100, (category.actualAmount / category.plannedAmount) * 100) : 0

                return (
                  <div key={category._id}>
                    <div className="flex items-center justify-between text-sm font-medium">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                        <span>{category.name}</span>
                      </div>
                      <div className="flex items-center">
                        {editingCategory === category._id ? (
                          <div className="flex items-center">
                            <input
                              type="number"
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md mr-2"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              min="0"
                              step="0.01"
                            />
                            <button
                              onClick={() => handleSaveCategory(category._id)}
                              className="text-blue-600 hover:text-blue-800"
                              disabled={isSaving}
                            >
                              <Save className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span>
                              ${category.actualAmount.toFixed(2)} / ${category.plannedAmount.toFixed(2)}
                            </span>
                            <button
                              onClick={() => handleEditCategory(category._id, category.actualAmount)}
                              className="ml-2 text-gray-500 hover:text-gray-700"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mt-1 relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: category.color,
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {budget.notes && (
        <motion.div className="bg-white overflow-hidden shadow rounded-lg mb-8" variants={itemVariants}>
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
            <p className="text-gray-500">{budget.notes}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default BudgetDetails

