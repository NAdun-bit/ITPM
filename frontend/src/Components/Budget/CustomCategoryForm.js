"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { addCustomCategory } from "../../Services/budgetService"

function CustomCategoryForm({ budgetId, onCategoryAdded }) {
  const [categoryName, setCategoryName] = useState("")
  const [plannedAmount, setPlannedAmount] = useState("")
  const [color, setColor] = useState("#0088FE")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const predefinedColors = [
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!categoryName.trim()) {
      setError("Category name is required")
      return
    }

    if (!plannedAmount || isNaN(Number(plannedAmount)) || Number(plannedAmount) <= 0) {
      setError("Planned amount must be a positive number")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const categoryData = {
        name: categoryName.trim(),
        plannedAmount: Number(plannedAmount),
        color,
      }

      await addCustomCategory(budgetId, categoryData)

      setCategoryName("")
      setPlannedAmount("")
      setColor("#0088FE")
      setSuccess("Category added successfully!")

      if (onCategoryAdded) {
        onCategoryAdded()
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      console.error("Error adding category:", err)
      setError("Failed to add category. Please try again.")
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
        <h2 className="text-2xl font-bold text-gray-900">Create Custom Category</h2>
        <p className="text-gray-500">Add personalized categories to better track your spending</p>
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

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              id="category-name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., Entertainment, Gym, Travel"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="planned-amount" className="block text-sm font-medium text-gray-700">
              Planned Amount ($)
            </label>
            <input
              type="number"
              id="planned-amount"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={plannedAmount}
              onChange={(e) => setPlannedAmount(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Category Color</label>
          <div className="flex flex-wrap gap-2">
            {predefinedColors.map((colorOption) => (
              <button
                key={colorOption}
                type="button"
                className={`w-8 h-8 rounded-full ${color === colorOption ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
                style={{ backgroundColor: colorOption }}
                onClick={() => setColor(colorOption)}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 p-0 border-0 rounded-full cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: color }}></div>
            <div>
              <p className="text-sm font-medium text-gray-900">{categoryName || "Category Preview"}</p>
              <p className="text-sm text-gray-500">${Number(plannedAmount || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Category"}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default CustomCategoryForm

