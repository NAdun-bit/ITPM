"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

function SavingsGoalForm({ goal, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split("T")[0],
    category: "Other",
    description: "",
    monthlyContribution: "",
    priority: "Medium",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name || "",
        targetAmount: goal.targetAmount ? goal.targetAmount.toString() : "",
        startDate: goal.startDate
          ? new Date(goal.startDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        endDate: goal.endDate ? new Date(goal.endDate).toISOString().split("T")[0] : "",
        category: goal.category || "Other",
        description: goal.description || "",
        monthlyContribution: goal.monthlyContribution ? goal.monthlyContribution.toString() : "",
        priority: goal.priority || "Medium",
      })
    }
  }, [goal])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Goal name is required"
    }

    if (
      !formData.targetAmount ||
      isNaN(Number.parseFloat(formData.targetAmount)) ||
      Number.parseFloat(formData.targetAmount) <= 0
    ) {
      newErrors.targetAmount = "Please enter a valid target amount greater than 0"
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required"
    } else {
      const endDate = new Date(formData.endDate)
      const today = new Date()
      if (endDate <= today) {
        newErrors.endDate = "End date must be in the future"
      }
    }

    if (
      formData.monthlyContribution &&
      (isNaN(Number.parseFloat(formData.monthlyContribution)) || Number.parseFloat(formData.monthlyContribution) < 0)
    ) {
      newErrors.monthlyContribution = "Monthly contribution must be a positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Format data for API
      const goalData = {
        ...formData,
        targetAmount: Number.parseFloat(formData.targetAmount),
        monthlyContribution: formData.monthlyContribution ? Number.parseFloat(formData.monthlyContribution) : 0,
      }

      console.log("Submitting savings goal data:", goalData)
      const success = await onSubmit(goalData)

      if (success) {
        // Reset form if it's a new goal (not editing)
        if (!goal) {
          setFormData({
            name: "",
            targetAmount: "",
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split("T")[0],
            category: "Other",
            description: "",
            monthlyContribution: "",
            priority: "Medium",
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

  return (
    <motion.div variants={formVariants} initial="hidden" animate="visible">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Goal Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.name ? "border-red-300" : ""
                }`}
                placeholder="Vacation, Emergency Fund, New Car, etc."
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <motion.div variants={itemVariants}>
              <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">
                Target Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="targetAmount"
                  id="targetAmount"
                  className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md ${
                    errors.targetAmount ? "border-red-300" : ""
                  }`}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  value={formData.targetAmount}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">USD</span>
                </div>
              </div>
              {errors.targetAmount && <p className="mt-1 text-sm text-red-600">{errors.targetAmount}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="monthlyContribution" className="block text-sm font-medium text-gray-700">
                Monthly Contribution (Optional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="monthlyContribution"
                  id="monthlyContribution"
                  className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md ${
                    errors.monthlyContribution ? "border-red-300" : ""
                  }`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.monthlyContribution}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">USD</span>
                </div>
              </div>
              {errors.monthlyContribution && <p className="mt-1 text-sm text-red-600">{errors.monthlyContribution}</p>}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <motion.div variants={itemVariants}>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                Target End Date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.endDate ? "border-red-300" : ""
                  }`}
                  value={formData.endDate}
                  onChange={handleChange}
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <motion.div variants={itemVariants}>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Travel">Travel</option>
                <option value="Education">Education</option>
                <option value="Emergency">Emergency</option>
                <option value="Retirement">Retirement</option>
                <option value="Home">Home</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Other">Other</option>
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={3}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Add details about your savings goal"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </motion.div>
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
            ) : goal ? (
              "Update Savings Goal"
            ) : (
              "Create Savings Goal"
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  )
}

export default SavingsGoalForm