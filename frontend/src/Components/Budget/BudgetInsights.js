"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

function BudgetInsights({ budgets }) {
  const [timeRange, setTimeRange] = useState("all")

  const filteredBudgets = useMemo(() => {
    if (timeRange === "all") return budgets

    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    if (timeRange === "current") {
      return budgets.filter((budget) => budget.year === currentYear && budget.month === currentMonth)
    }

    if (timeRange === "last3") {
      // Get budgets from the last 3 months
      return budgets.filter((budget) => {
        const budgetDate = new Date(budget.year, budget.month - 1, 1)
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)
        return budgetDate >= threeMonthsAgo
      })
    }

    if (timeRange === "last6") {
      // Get budgets from the last 6 months
      return budgets.filter((budget) => {
        const budgetDate = new Date(budget.year, budget.month - 1, 1)
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1)
        return budgetDate >= sixMonthsAgo
      })
    }

    if (timeRange === "year") {
      return budgets.filter((budget) => budget.year === currentYear)
    }

    return budgets
  }, [budgets, timeRange])

  const spendingTrends = useMemo(() => {
    if (!filteredBudgets.length) return []

    // Sort budgets by date
    const sortedBudgets = [...filteredBudgets].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      return a.month - b.month
    })

    return sortedBudgets.map((budget) => {
      const totalPlanned = budget.categories.reduce((sum, cat) => sum + cat.plannedAmount, 0)
      const totalActual = budget.categories.reduce((sum, cat) => sum + cat.actualAmount, 0)

      return {
        name: `${budget.month}/${budget.year}`,
        planned: totalPlanned,
        actual: totalActual,
        income: budget.totalIncome,
      }
    })
  }, [filteredBudgets])

  const categoryAnalysis = useMemo(() => {
    if (!filteredBudgets.length) return []

    // Aggregate spending by category across all filtered budgets
    const categoryMap = {}

    filteredBudgets.forEach((budget) => {
      budget.categories.forEach((category) => {
        if (!categoryMap[category.name]) {
          categoryMap[category.name] = {
            name: category.name,
            planned: 0,
            actual: 0,
            color: category.color,
          }
        }

        categoryMap[category.name].planned += category.plannedAmount
        categoryMap[category.name].actual += category.actualAmount
      })
    })

    return Object.values(categoryMap).sort((a, b) => b.actual - a.actual)
  }, [filteredBudgets])

  const savingsRate = useMemo(() => {
    if (!filteredBudgets.length) return { average: 0, total: 0 }

    let totalIncome = 0
    let totalSpending = 0

    filteredBudgets.forEach((budget) => {
      totalIncome += budget.totalIncome
      totalSpending += budget.categories.reduce((sum, cat) => sum + cat.actualAmount, 0)
    })

    const totalSaved = totalIncome - totalSpending
    const savingsRate = totalIncome > 0 ? (totalSaved / totalIncome) * 100 : 0

    return {
      average: savingsRate,
      total: totalSaved,
    }
  }, [filteredBudgets])

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

  if (!budgets.length) {
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">No budget data available</h3>
        <p className="mt-1 text-sm text-gray-500">Create some budgets to see insights.</p>
      </div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Budget Insights</h2>
        <select
          className="block rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="current">Current Month</option>
          <option value="last3">Last 3 Months</option>
          <option value="last6">Last 6 Months</option>
          <option value="year">This Year</option>
        </select>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Savings Rate</dt>
                  <dd className="text-lg font-semibold text-gray-900">{savingsRate.average.toFixed(1)}%</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Saved</dt>
                  <dd className="text-lg font-semibold text-gray-900">${savingsRate.total.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Budgets Analyzed</dt>
                  <dd className="text-lg font-semibold text-gray-900">{filteredBudgets.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8" variants={itemVariants}>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Spending Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={spendingTrends}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="income" fill="#8884d8" name="Income" />
                  <Bar dataKey="planned" fill="#82ca9d" name="Planned" />
                  <Bar dataKey="actual" fill="#ffc658" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Category Analysis</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryAnalysis}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="actual"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryAnalysis.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div className="bg-white overflow-hidden shadow rounded-lg" variants={itemVariants}>
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Category Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Planned
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actual
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Difference
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categoryAnalysis.map((category, index) => {
                  const difference = category.planned - category.actual
                  const totalActual = categoryAnalysis.reduce((sum, cat) => sum + cat.actual, 0)
                  const percentage = totalActual > 0 ? (category.actual / totalActual) * 100 : 0

                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${category.planned.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${category.actual.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={difference >= 0 ? "text-green-600" : "text-red-600"}>
                          ${Math.abs(difference).toFixed(2)} {difference >= 0 ? "under" : "over"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{percentage.toFixed(1)}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default BudgetInsights

