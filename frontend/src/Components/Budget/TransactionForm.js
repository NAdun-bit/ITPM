"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { addTransaction, updateTransaction } from "../../Services/transactionService"

function TransactionForm({ budgetId, categories = [], existingTransaction = null, onSuccess, onCancel }) {
  // Initialize form with default values or existing transaction data
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    paymentMethod: "Credit Card",
    notes: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // If editing an existing transaction, populate the form
  useEffect(() => {
    if (existingTransaction) {
      setFormData({
        description: existingTransaction.description || "",
        amount: existingTransaction.amount ? existingTransaction.amount.toString() : "",
        date: existingTransaction.date
          ? new Date(existingTransaction.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        category: existingTransaction.category || "",
        paymentMethod: existingTransaction.paymentMethod || "Credit Card",
        notes: existingTransaction.notes || "",
      })
    }
  }, [existingTransaction])

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0"
    }

    if (!formData.date) {
      newErrors.date = "Date is required"
    }

    if (!formData.category) {
      newErrors.category = "Please select a category"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSuccessMessage("")
    setErrors({})

    try {
      const transactionData = {
        description: formData.description,
        amount: Number(formData.amount),
        date: formData.date,
        category: formData.category,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        budgetId: budgetId,
      }

      let result

      if (existingTransaction && existingTransaction._id) {
        // Update existing transaction
        result = await updateTransaction(existingTransaction._id, transactionData)
        setSuccessMessage("Transaction updated successfully!")
      } else {
        // Add new transaction
        result = await addTransaction(transactionData)
        setSuccessMessage("Transaction added successfully!")

        // Reset form if adding a new transaction
        setFormData({
          description: "",
          amount: "",
          date: new Date().toISOString().split("T")[0],
          category: "",
          paymentMethod: "Credit Card",
          notes: "",
        })
      }

      // Notify parent component
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess(result)
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (err) {
      console.error("Error submitting transaction:", err)
      setErrors({
        submit: err.message || "Failed to save transaction. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  // Default categories if none provided
  const defaultCategories = [
    { name: "Housing" },
    { name: "Food" },
    { name: "Transportation" },
    { name: "Utilities" },
    { name: "Entertainment" },
    { name: "Healthcare" },
    { name: "Personal Care" },
    { name: "Education" },
    { name: "Savings" },
    { name: "Debt" },
    { name: "Gifts" },
    { name: "Other" },
  ]

  // Use provided categories or default ones
  const displayCategories = categories.length > 0 ? categories : defaultCategories

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {existingTransaction ? "Edit Transaction" : "Add New Transaction"}
      </h2>

      {successMessage && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.description ? "border-red-300" : ""
            }`}
            placeholder="e.g., Grocery shopping, Rent payment"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount ($)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`block w-full pl-7 pr-12 sm:text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.amount ? "border-red-300" : ""
              }`}
              placeholder="0.00"
              step="0.01"
              min="0.01"
            />
          </div>
          {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.date ? "border-red-300" : ""
            }`}
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.category ? "border-red-300" : ""
            }`}
          >
            <option value="">Select a category</option>
            {displayCategories.map((category, index) => (
              <option key={category._id || `category-${index}`} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Add any additional details about this transaction"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && typeof onCancel === "function" && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                {existingTransaction ? "Updating..." : "Saving..."}
              </>
            ) : existingTransaction ? (
              "Update Transaction"
            ) : (
              "Add Transaction"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default TransactionForm

