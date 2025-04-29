"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PlusCircle, Trash2 } from "lucide-react"

function BudgetForm({ budget, onSubmit }) {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1 // JavaScript months are 0-indexed
  const currentYear = currentDate.getFullYear()

  const [formData, setFormData] = useState({
    name: "",
    month: currentMonth,
    year: currentYear,
    totalIncome: "",
    categories: [
      { name: "Housing", plannedAmount: "", actualAmount: 0, color: "#3B82F6" }, // Blue
      { name: "Food", plannedAmount: "", actualAmount: 0, color: "#10B981" }, // Green
      { name: "Transportation", plannedAmount: "", actualAmount: 0, color: "#F59E0B" }, // Yellow
      { name: "Utilities", plannedAmount: "", actualAmount: 0, color: "#6366F1" }, // Indigo
      { name: "Entertainment", plannedAmount: "", actualAmount: 0, color: "#EC4899" }, // Pink
    ],
    notes: "",
    isActive: true,
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (budget) {
      setFormData({
        name: budget.name,
        month: budget.month,
        year: budget.year,
        totalIncome: budget.totalIncome.toString(),
        categories: budget.categories.map((cat) => ({
          ...cat,
          plannedAmount: cat.plannedAmount.toString(),
        })),
        notes: budget.notes || "",
        isActive: budget.isActive !== undefined ? budget.isActive : true,
      })
    }
  }, [budget])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Budget name is required"
    }

    if (!formData.month || formData.month < 1 || formData.month > 12) {
      newErrors.month = "Please select a valid month"
    }

    if (!formData.year || formData.year < 2000) {
      newErrors.year = "Please enter a valid year (2000 or later)"
    }

    if (
      !formData.totalIncome ||
      isNaN(Number.parseFloat(formData.totalIncome)) ||
      Number.parseFloat(formData.totalIncome) < 0
    ) {
      newErrors.totalIncome = "Please enter a valid income amount (0 or greater)"
    }

    // Validate categories
    const categoryErrors = []
    formData.categories.forEach((category, index) => {
      const errors = {}
      if (!category.name.trim()) {
        errors.name = "Category name is required"
      }
      if (
        !category.plannedAmount ||
        isNaN(Number.parseFloat(category.plannedAmount)) ||
        Number.parseFloat(category.plannedAmount) < 0
      ) {
        errors.plannedAmount = "Please enter a valid amount (0 or greater)"
      }
      if (Object.keys(errors).length > 0) {
        categoryErrors[index] = errors
      }
    })

    if (categoryErrors.length > 0) {
      newErrors.categories = categoryErrors
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleCategoryChange = (index, e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const newCategories = [...prev.categories]
      newCategories[index] = {
        ...newCategories[index],
        [name]: value,
      }
      return {
        ...prev,
        categories: newCategories,
      }
    })
  }

  const addCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          name: "",
          plannedAmount: "",
          actualAmount: 0,
          color: getRandomColor(),
        },
      ],
    }))
  }

  const removeCategory = (index) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }))
  }

  const getRandomColor = () => {
    const colors = [
      "#3B82F6", // Blue
      "#10B981", // Green
      "#F59E0B", // Yellow
      "#6366F1", // Indigo
      "#EC4899", // Pink
      "#8B5CF6", // Purple
      "#EF4444", // Red
      "#14B8A6", // Teal
      "#F97316", // Orange
      "#06B6D4", // Cyan
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Format data for API
      const budgetData = {
        ...formData,
        totalIncome: Number.parseFloat(formData.totalIncome),
        categories: formData.categories.map((cat) => ({
          ...cat,
          plannedAmount: Number.parseFloat(cat.plannedAmount),
          actualAmount: Number.parseFloat(cat.actualAmount || 0),
        })),
      }

      const success = await onSubmit(budgetData)

      if (success) {
        // Reset form if it's a new budget (not editing)
        if (!budget) {
          setFormData({
            name: "",
            month: currentMonth,
            year: currentYear,
            totalIncome: "",
            categories: [
              { name: "Housing", plannedAmount: "", actualAmount: 0, color: "#3B82F6" },
              { name: "Food", plannedAmount: "", actualAmount: 0, color: "#10B981" },
              { name: "Transportation", plannedAmount: "", actualAmount: 0, color: "#F59E0B" },
              { name: "Utilities", plannedAmount: "", actualAmount: 0, color: "#6366F1" },
              { name: "Entertainment", plannedAmount: "", actualAmount: 0, color: "#EC4899" },
            ],
            notes: "",
            isActive: true,
          })
        }
      }
    } catch (err) {
      console.error("Error submitting form:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formVariants = {
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
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  }

  const getMonthOptions = () => {
    const months = [
      { value: 1, label: "January" },
      { value: 2, label: "February" },
      { value: 3, label: "March" },
      { value: 4, label: "April" },
      { value: 5, label: "May" },
      { value: 6, label: "June" },
      { value: 7, label: "July" },
      { value: 8, label: "August" },
      { value: 9, label: "September" },
      { value: 10, label: "October" },
      { value: 11, label: "November" },
      { value: 12, label: "December" },
    ]
    return months.map((month) => (
      <option key={month.value} value={month.value}>
        {month.label}
      </option>
    ))
  }

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i)
    }
    return years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))
  }

  const calculateTotalPlanned = () => {
    return formData.categories.reduce((sum, category) => {
      const amount = Number.parseFloat(category.plannedAmount) || 0
      return sum + amount
    }, 0)
  }

  const totalPlanned = calculateTotalPlanned()
  const totalIncome = Number.parseFloat(formData.totalIncome) || 0
  const remaining = totalIncome - totalPlanned

  return (
    <motion.div variants={formVariants} initial="hidden" animate="visible">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Budget Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.name ? "border-red-300" : ""
                }`}
                placeholder="Monthly Budget, Q1 Budget, etc."
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
            <motion.div variants={itemVariants}>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                Month
              </label>
              <select
                id="month"
                name="month"
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
                  errors.month ? "border-red-300" : ""
                }`}
                value={formData.month}
                onChange={handleChange}
              >
                {getMonthOptions()}
              </select>
              {errors.month && <p className="mt-1 text-sm text-red-600">{errors.month}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <select
                id="year"
                name="year"
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
                  errors.year ? "border-red-300" : ""
                }`}
                value={formData.year}
                onChange={handleChange}
              >
                {getYearOptions()}
              </select>
              {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="totalIncome" className="block text-sm font-medium text-gray-700">
                Total Monthly Income
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="totalIncome"
                  id="totalIncome"
                  className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md ${
                    errors.totalIncome ? "border-red-300" : ""
                  }`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.totalIncome}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">USD</span>
                </div>
              </div>
              {errors.totalIncome && <p className="mt-1 text-sm text-red-600">{errors.totalIncome}</p>}
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Budget Categories</h3>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={addCategory}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Category
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between text-sm font-medium">
                <span>Total Income: ${totalIncome.toFixed(2)}</span>
                <span>Total Planned: ${totalPlanned.toFixed(2)}</span>
                <span className={remaining < 0 ? "text-red-600" : "text-green-600"}>
                  Remaining: ${remaining.toFixed(2)}
                </span>
              </div>
              <div className="mt-2 relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${Math.min(100, (totalPlanned / totalIncome) * 100)}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                      remaining < 0 ? "bg-red-500" : "bg-green-500"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {formData.categories.map((category, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                      <h4 className="text-sm font-medium text-gray-900">Category {index + 1}</h4>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      onClick={() => removeCategory(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`category-name-${index}`} className="block text-xs font-medium text-gray-700">
                        Category Name
                      </label>
                      <input
                        type="text"
                        id={`category-name-${index}`}
                        name="name"
                        className={`mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                          errors.categories?.[index]?.name ? "border-red-300" : ""
                        }`}
                        value={category.name}
                        onChange={(e) => handleCategoryChange(index, e)}
                      />
                      {errors.categories?.[index]?.name && (
                        <p className="mt-1 text-xs text-red-600">{errors.categories[index].name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor={`category-amount-${index}`} className="block text-xs font-medium text-gray-700">
                        Planned Amount
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-xs">$</span>
                        </div>
                        <input
                          type="number"
                          id={`category-amount-${index}`}
                          name="plannedAmount"
                          className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md ${
                            errors.categories?.[index]?.plannedAmount ? "border-red-300" : ""
                          }`}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          value={category.plannedAmount}
                          onChange={(e) => handleCategoryChange(index, e)}
                        />
                      </div>
                      {errors.categories?.[index]?.plannedAmount && (
                        <p className="mt-1 text-xs text-red-600">{errors.categories[index].plannedAmount}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor={`category-color-${index}`} className="block text-xs font-medium text-gray-700">
                        Color
                      </label>
                      <input
                        type="color"
                        id={`category-color-${index}`}
                        name="color"
                        className="mt-1 block w-full h-8 p-0 border-gray-300 rounded-md"
                        value={category.color}
                        onChange={(e) => handleCategoryChange(index, e)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes (Optional)
            </label>
            <div className="mt-1">
              <textarea
                id="notes"
                name="notes"
                rows="3"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Add any notes about this budget"
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>
          </motion.div>

          {budget && (
            <motion.div variants={itemVariants} className="flex items-center">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Active budget
              </label>
            </motion.div>
          )}
        </div>

        <motion.div className="mt-8 flex justify-end" variants={itemVariants}>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : budget ? (
              "Update Budget"
            ) : (
              "Create Budget"
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  )
}

export default BudgetForm

