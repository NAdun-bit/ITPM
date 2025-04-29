"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { getBudgetVisualization } from "../../Services/budgetService"

function CategoryVisualization({ budgetId }) {
  const [visualData, setVisualData] = useState(null)
  const [chartType, setChartType] = useState("pie") // "pie" or "bar"
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!budgetId) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getBudgetVisualization(budgetId)
        setVisualData(data)
      } catch (err) {
        console.error("Error fetching visualization data:", err)
        setError("Failed to load visualization data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [budgetId])

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#8DD1E1",
    "#A4DE6C",
    "#D0ED57",
  ]

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

  if (!visualData || !visualData.categories || visualData.categories.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No visualization data</h3>
        <p className="mt-1 text-sm text-gray-500">This budget doesn't have any categories or spending data yet.</p>
      </div>
    )
  }

  // Prepare data for charts
  const chartData = visualData.categories.map((category, index) => ({
    name: category.name,
    planned: category.plannedAmount,
    actual: category.actualAmount,
    color: category.color || COLORS[index % COLORS.length],
  }))

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Category Breakdown</h2>
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                chartType === "pie" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setChartType("pie")}
            >
              Pie Chart
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                chartType === "bar" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setChartType("bar")}
            >
              Bar Chart
            </button>
          </div>
        </div>
        <p className="text-gray-500">Visualize your budget allocation across different categories</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "pie" ? (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="planned"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            ) : (
              <BarChart
                data={chartData}
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
                <Bar dataKey="planned" name="Planned" fill="#8884d8" />
                <Bar dataKey="actual" name="Actual" fill="#82ca9d" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Category Details</h3>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Category
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Planned
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Actual
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Remaining
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    % Used
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {visualData.categories.map((category) => {
                  const remaining = category.plannedAmount - category.actualAmount
                  const percentUsed =
                    category.plannedAmount > 0
                      ? Math.min(100, (category.actualAmount / category.plannedAmount) * 100)
                      : 0

                  return (
                    <tr key={category._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color || "#8884d8" }}
                          ></div>
                          {category.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${category.plannedAmount.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${category.actualAmount.toFixed(2)}
                      </td>
                      <td
                        className={`whitespace-nowrap px-3 py-4 text-sm ${
                          remaining < 0 ? "text-red-600" : "text-gray-500"
                        }`}
                      >
                        ${remaining.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="mr-2">{percentUsed.toFixed(0)}%</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                percentUsed > 90 ? "bg-red-600" : percentUsed > 75 ? "bg-yellow-500" : "bg-green-500"
                              }`}
                              style={{ width: `${percentUsed}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CategoryVisualization

