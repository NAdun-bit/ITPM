"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Calendar, CreditCard } from "lucide-react"

// This is a mock function - in a real app, you would import this from your service
const searchTransactions = async (filters) => {
  // Simulate API call
  console.log("Searching with filters:", filters)

  // Mock data
  return [
    {
      _id: "t1",
      date: "2023-04-15",
      amount: 45.99,
      category: "Groceries",
      description: "Weekly grocery shopping",
      paymentMethod: "Credit Card",
    },
    {
      _id: "t2",
      date: "2023-04-12",
      amount: 9.99,
      category: "Entertainment",
      description: "Movie streaming subscription",
      paymentMethod: "Debit Card",
    },
    {
      _id: "t3",
      date: "2023-04-10",
      amount: 35.0,
      category: "Dining",
      description: "Dinner with friends",
      paymentMethod: "Cash",
    },
  ]
}

function TransactionFilter({ budgetId, onResultsFound }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([
    "Groceries",
    "Rent",
    "Utilities",
    "Entertainment",
    "Dining",
    "Transportation",
    "Shopping",
    "Healthcare",
    "Education",
    "Personal Care",
    "Gifts",
    "Savings",
    "Miscellaneous",
  ])
  const [paymentMethods, setPaymentMethods] = useState([
    "Credit Card",
    "Debit Card",
    "Cash",
    "Bank Transfer",
    "Mobile Payment",
    "Check",
  ])

  const handleSearch = async (e) => {
    e.preventDefault()

    try {
      setIsSearching(true)
      setError(null)

      const filters = {
        budgetId,
        searchTerm: searchTerm.trim(),
        category: category || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        paymentMethod: paymentMethod || undefined,
      }

      const results = await searchTransactions(filters)

      if (onResultsFound) {
        onResultsFound(results)
      }
    } catch (err) {
      console.error("Error searching transactions:", err)
      setError("Failed to search transactions. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleClear = () => {
    setSearchTerm("")
    setCategory("")
    setStartDate("")
    setEndDate("")
    setPaymentMethod("")

    if (onResultsFound) {
      onResultsFound([])
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
        <h2 className="text-2xl font-bold text-gray-900">Filter & Search Transactions</h2>
        <p className="text-gray-500">Find specific transactions by category, date, or payment method</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search by amount or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              <Filter className="inline-block h-4 w-4 mr-1" /> Category
            </label>
            <select
              id="category"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700">
              <CreditCard className="inline-block h-4 w-4 mr-1" /> Payment Method
            </label>
            <select
              id="payment-method"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">All Payment Methods</option>
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date-range" className="block text-sm font-medium text-gray-700">
              <Calendar className="inline-block h-4 w-4 mr-1" /> Date Range
            </label>
            <div className="mt-1 flex space-x-2">
              <input
                type="date"
                className="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-gray-500 self-center">to</span>
              <input
                type="date"
                className="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSearching}
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default TransactionFilter

