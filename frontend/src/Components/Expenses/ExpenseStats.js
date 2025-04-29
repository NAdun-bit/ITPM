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
  Cell
} from "recharts"

function ExpenseStats({ expenses = [] }) {
  const [timeRange, setTimeRange] = useState("all")
  const [chartType, setChartType] = useState("category")

  // Filter expenses based on time range
  const filteredExpenses = useMemo(() => {
    if (timeRange === "all") return expenses

    const now = new Date()
    const timeRanges = {
      "week": new Date(now.setDate(now.getDate() - 7)),
      "month": new Date(now.setDate(now.getDate() - 30)),
      "year": new Date(now.setFullYear(now.getFullYear() - 1))
    }

    return expenses.filter(expense => {
      // Skip undefined or null expenses or those without dates
      if (!expense || !expense.date) return false
      
      const expenseDate = new Date(expense.date)
      return expenseDate >= timeRanges[timeRange]
    })
  }, [expenses, timeRange])

  // Calculate statistics
  const stats = useMemo(() => {
    // Handle empty expenses array
    if (!filteredExpenses.length) {
      return {
        totalAmount: 0,
        averageAmount: 0,
        expensesByCategory: [],
        expensesByMonth: [],
        expensesByStatus: [
          { name: "Paid", value: 0 },
          { name: "Pending", value: 0 }
        ],
        participantStats: []
      }
    }

    // Calculate total and average
    const totalAmount = filteredExpenses.reduce((sum, expense) => 
      sum + (expense?.amount || 0), 0)
    
    const averageAmount = totalAmount / filteredExpenses.length

    // Group expenses by category (using description as category)
    const categories = {}
    filteredExpenses.forEach(expense => {
      // Skip undefined or null expenses
      if (!expense) return
      
      const category = expense.description ? expense.description.split(' ')[0] : "Uncategorized"
      if (!categories[category]) {
        categories[category] = 0
      }
      categories[category] += expense.amount || 0
    })

    const expensesByCategory = Object.keys(categories).map(key => ({
      name: key,
      value: categories[key]
    }))

    // Group expenses by month
    const months = {}
    filteredExpenses.forEach(expense => {
      // Skip undefined or null expenses or those without dates
      if (!expense || !expense.date) return
      
      const date = new Date(expense.date)
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`
      
      if (!months[monthYear]) {
        months[monthYear] = 0
      }
      months[monthYear] += expense.amount || 0
    })

    const expensesByMonth = Object.keys(months).map(key => ({
      name: key,
      amount: months[key]
    }))

    // Group expenses by status
    const statuses = { "Paid": 0, "Pending": 0 }
    filteredExpenses.forEach(expense => {
      // Skip undefined or null expenses
      if (!expense) return
      
      const status = expense.status || "Pending"
      statuses[status] += expense.amount || 0
    })

    const expensesByStatus = Object.keys(statuses).map(key => ({
      name: key,
      value: statuses[key]
    }))

    // Participant statistics
    const participants = {}
    filteredExpenses.forEach(expense => {
      // Skip undefined or null expenses or those without participants
      if (!expense || !expense.participants) return
      
      expense.participants.forEach(participant => {
        // Skip undefined or null participants
        if (!participant || !participant.name) return
        
        if (!participants[participant.name]) {
          participants[participant.name] = {
            totalAmount: 0,
            paidAmount: 0,
            pendingAmount: 0,
            expenseCount: 0
          }
        }
        
        const share = expense.splitType === "custom" 
          ? (participant.share || 0) 
          : ((expense.amount || 0) / (expense.participants.length || 1))
        
        participants[participant.name].totalAmount += share
        participants[participant.name].expenseCount += 1
        
        if (participant.hasPaid) {
          participants[participant.name].paidAmount += share
        } else {
          participants[participant.name].pendingAmount += share
        }
      })
    })

    const participantStats = Object.keys(participants).map(name => ({
      name,
      ...participants[name]
    }))

    return {
      totalAmount,
      averageAmount,
      expensesByCategory,
      expensesByMonth,
      expensesByStatus,
      participantStats
    }
  }, [filteredExpenses])

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#6B66FF']

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex flex-col sm:flex-row justify-between items-center gap-4" variants={itemVariants}>
        <div className="w-full sm:w-auto">
          <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 mb-1">
            Time Range
          </label>
          <select
            id="timeRange"
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <label htmlFor="chartType" className="block text-sm font-medium text-gray-700 mb-1">
            Chart Type
          </label>
          <select
            id="chartType"
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="category">By Category</option>
            <option value="time">By Time</option>
            <option value="status">By Status</option>
            <option value="participants">By Participants</option>
          </select>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={itemVariants}>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-blue-600">${stats.totalAmount.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Average Expense</h3>
          <p className="text-3xl font-bold text-green-600">${stats.averageAmount.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Number of Expenses</h3>
          <p className="text-3xl font-bold text-purple-600">{filteredExpenses.length}</p>
        </div>
      </motion.div>

      <motion.div className="bg-white p-6 rounded-lg shadow-md" variants={itemVariants}>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {chartType === "category" && "Expenses by Category"}
          {chartType === "time" && "Expenses by Month"}
          {chartType === "status" && "Expenses by Status"}
          {chartType === "participants" && "Expenses by Participant"}
        </h3>

        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No expense data available for the selected time range.</p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "category" && (
                <PieChart>
                  <Pie
                    data={stats.expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              )}

              {chartType === "time" && (
                <BarChart
                  data={stats.expensesByMonth}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="amount" name="Amount" fill="#8884d8" />
                </BarChart>
              )}

              {chartType === "status" && (
                <PieChart>
                  <Pie
                    data={stats.expensesByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#4CAF50" /> {/* Paid */}
                    <Cell fill="#FFC107" /> {/* Pending */}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              )}

              {chartType === "participants" && (
                <BarChart
                  data={stats.participantStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="totalAmount" name="Total" fill="#8884d8" />
                  <Bar dataKey="paidAmount" name="Paid" fill="#4CAF50" />
                  <Bar dataKey="pendingAmount" name="Pending" fill="#FFC107" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {chartType === "participants" && (
        <motion.div className="bg-white p-6 rounded-lg shadow-md" variants={itemVariants}>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Participant Details</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pending
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.participantStats.map((participant, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {participant.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${participant.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${participant.paidAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${participant.pendingAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {participant.expenseCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ExpenseStats
