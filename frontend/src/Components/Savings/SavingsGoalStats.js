"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"

function SavingsGoalStats({ savingsGoals }) {
  const stats = useMemo(() => {
    if (!savingsGoals.length) {
      return {
        totalTargetAmount: 0,
        totalCurrentAmount: 0,
        totalRemainingAmount: 0,
        averageProgress: 0,
        completedGoals: 0,
        activeGoals: 0,
        categoryCounts: {},
        categoryAmounts: {},
        priorityCounts: {},
        monthlyContributionTotal: 0,
        averageTimeToCompletion: 0,
      }
    }

    const totalTargetAmount = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)
    const totalCurrentAmount = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)
    const totalRemainingAmount = totalTargetAmount - totalCurrentAmount

    const progressValues = savingsGoals.map((goal) => {
      return goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
    })
    const averageProgress =
      progressValues.length > 0
        ? progressValues.reduce((sum, progress) => sum + progress, 0) / progressValues.length
        : 0

    const completedGoals = savingsGoals.filter((goal) => goal.isCompleted).length
    const activeGoals = savingsGoals.length - completedGoals

    // Group by category
    const categoryCounts = {}
    const categoryAmounts = {}
    savingsGoals.forEach((goal) => {
      const category = goal.category || "Other"
      if (!categoryCounts[category]) {
        categoryCounts[category] = 0
        categoryAmounts[category] = 0
      }
      categoryCounts[category]++
      categoryAmounts[category] += goal.targetAmount
    })

    // Group by priority
    const priorityCounts = {}
    savingsGoals.forEach((goal) => {
      const priority = goal.priority || "Medium"
      if (!priorityCounts[priority]) {
        priorityCounts[priority] = 0
      }
      priorityCounts[priority]++
    })

    // Calculate monthly contribution total
    const monthlyContributionTotal = savingsGoals.reduce((sum, goal) => {
      return sum + (goal.monthlyContribution || 0)
    }, 0)

    // Calculate average time to completion for completed goals
    const completedGoalsArray = savingsGoals.filter((goal) => goal.isCompleted)
    let averageTimeToCompletion = 0

    if (completedGoalsArray.length > 0) {
      const totalDays = completedGoalsArray.reduce((sum, goal) => {
        const startDate = new Date(goal.startDate)
        const endDate = new Date(goal.endDate)
        return sum + Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
      }, 0)

      averageTimeToCompletion = totalDays / completedGoalsArray.length
    }

    return {
      totalTargetAmount,
      totalCurrentAmount,
      totalRemainingAmount,
      averageProgress,
      completedGoals,
      activeGoals,
      categoryCounts,
      categoryAmounts,
      priorityCounts,
      monthlyContributionTotal,
      averageTimeToCompletion,
    }
  }, [savingsGoals])

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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {savingsGoals.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No savings goal data</h3>
          <p className="mt-1 text-sm text-gray-500">Add some savings goals to see statistics.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary Cards */}
          <motion.div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" variants={itemVariants}>
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
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Target Amount</dt>
                      <dd className="text-lg font-semibold text-gray-900">${stats.totalTargetAmount.toFixed(2)}</dd>
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
                      <dt className="text-sm font-medium text-gray-500 truncate">Current Savings</dt>
                      <dd className="text-lg font-semibold text-gray-900">${stats.totalCurrentAmount.toFixed(2)}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Remaining Amount</dt>
                      <dd className="text-lg font-semibold text-gray-900">${stats.totalRemainingAmount.toFixed(2)}</dd>
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
                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Average Progress</dt>
                      <dd className="text-lg font-semibold text-gray-900">{stats.averageProgress.toFixed(1)}%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Goal Status */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Goal Status</h3>
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="bg-gray-50 overflow-hidden rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <svg
                          className="h-6 w-6 text-green-600"
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
                          <dt className="text-sm font-medium text-gray-500 truncate">Completed Goals</dt>
                          <dd className="text-lg font-semibold text-gray-900">{stats.completedGoals}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 overflow-hidden rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <svg
                          className="h-6 w-6 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Active Goals</dt>
                          <dd className="text-lg font-semibold text-gray-900">{stats.activeGoals}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Category Breakdown</h3>
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  {Object.entries(stats.categoryAmounts).map(([category, amount]) => {
                    const percentage = (amount / stats.totalTargetAmount) * 100
                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between text-sm font-medium text-gray-900">
                          <div className="capitalize">{category}</div>
                          <div>
                            ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                          </div>
                        </div>
                        <div className="mt-1 relative pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div
                              style={{ width: `${percentage}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
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

          {/* Priority Distribution */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Priority Distribution</h3>
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  {Object.entries(stats.priorityCounts).map(([priority, count]) => {
                    const percentage = (count / savingsGoals.length) * 100
                    let bgColor = "bg-gray-100"
                    let textColor = "text-gray-600"

                    if (priority === "High") {
                      bgColor = "bg-red-100"
                      textColor = "text-red-600"
                    } else if (priority === "Medium") {
                      bgColor = "bg-yellow-100"
                      textColor = "text-yellow-600"
                    } else if (priority === "Low") {
                      bgColor = "bg-green-100"
                      textColor = "text-green-600"
                    }

                    return (
                      <div key={priority} className={`${bgColor} overflow-hidden rounded-lg p-4`}>
                        <div className="flex items-center justify-between">
                          <div className={`text-sm font-medium ${textColor}`}>{priority} Priority</div>
                          <div className="text-sm font-medium text-gray-900">
                            {count} ({percentage.toFixed(1)}%)
                          </div>
                        </div>
                        <div className="mt-1 relative pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div
                              style={{ width: `${percentage}%` }}
                              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                priority === "High"
                                  ? "bg-red-500"
                                  : priority === "Medium"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
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

          {/* Additional Stats */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Additional Statistics</h3>
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="bg-gray-50 overflow-hidden rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                        <svg
                          className="h-6 w-6 text-indigo-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Average Time to Completion</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {stats.averageTimeToCompletion > 0
                              ? `${Math.round(stats.averageTimeToCompletion)} days`
                              : "N/A"}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 overflow-hidden rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-pink-100 rounded-md p-3">
                        <svg
                          className="h-6 w-6 text-pink-600"
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
                          <dt className="text-sm font-medium text-gray-500 truncate">Monthly Contribution Total</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            ${stats.monthlyContributionTotal.toFixed(2)}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default SavingsGoalStats

