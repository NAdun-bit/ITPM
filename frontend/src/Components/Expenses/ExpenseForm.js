"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

function ExpenseForm({ expense, onSubmit }) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    splitType: "equal",
    status: "Pending",
    participants: [{ name: "", email: "", share: 0, hasPaid: false }],
  })

  // Add the exchange rate state and fetching logic after the existing useState declarations
  const [exchangeRate, setExchangeRate] = useState(null)

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Add this useEffect to fetch the exchange rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=LKR")
        const data = await response.json()
        setExchangeRate(data.rates.LKR)
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error)
      }
    }

    fetchExchangeRate()
  }, [])

  // Fix the date formatting in the useEffect that sets form data from expense
  // Replace the existing useEffect with this updated one
  useEffect(() => {
    if (expense) {
      // Format the date properly for the date input
      let formattedDate = new Date().toISOString().split("T")[0]

      if (expense.date) {
        // Create a new Date object and handle timezone issues
        const expenseDate = new Date(expense.date)
        // Add timezone offset to get the correct date
        expenseDate.setMinutes(expenseDate.getMinutes() + expenseDate.getTimezoneOffset())
        formattedDate = expenseDate.toISOString().split("T")[0]
      }

      setFormData({
        description: expense.description || "",
        amount: expense.amount ? expense.amount.toString() : "",
        date: formattedDate,
        splitType: expense.splitType || "equal",
        status: expense.status || "Pending",
        participants:
          expense.participants && expense.participants.length > 0
            ? expense.participants.map((p) => ({
                name: p.name || "",
                email: p.email || "",
                share: p.share || 0,
                hasPaid: p.hasPaid || false,
              }))
            : [{ name: "", email: "", share: 0, hasPaid: false }],
      })
    }
  }, [expense])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.description || !formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.amount || isNaN(Number.parseFloat(formData.amount)) || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0"
    }

    if (!formData.date) {
      newErrors.date = "Date is required"
    }

    if (!formData.participants || formData.participants.length === 0) {
      newErrors.participants = "At least one participant is required"
    } else {
      const participantErrors = []
      formData.participants.forEach((participant, index) => {
        const errors = {}
        if (!participant.name || !participant.name.trim()) {
          errors.name = "Name is required"
        }
        if (
          formData.splitType === "custom" &&
          (isNaN(Number.parseFloat(participant.share)) || Number.parseFloat(participant.share) < 0)
        ) {
          errors.share = "Please enter a valid share amount"
        }
        if (Object.keys(errors).length > 0) {
          participantErrors[index] = errors
        }
      })

      if (participantErrors.length > 0) {
        newErrors.participantDetails = participantErrors
      }
    }

    if (formData.splitType === "custom") {
      const totalShares = formData.participants.reduce((sum, p) => sum + (Number.parseFloat(p.share) || 0), 0)
      if (Math.abs(totalShares - Number.parseFloat(formData.amount)) > 0.01) {
        newErrors.splitTotal = `Total shares (${totalShares.toFixed(2)}) must equal the expense amount (${Number.parseFloat(formData.amount).toFixed(2)})`
      }
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

    // If changing split type, update participant shares
    if (name === "splitType") {
      if (value === "equal") {
        const equalShare = Number.parseFloat(formData.amount) / formData.participants.length || 0
        setFormData((prev) => ({
          ...prev,
          splitType: value,
          participants: prev.participants.map((p) => ({
            ...p,
            share: equalShare,
          })),
        }))
      } else if (value === "custom") {
        setFormData((prev) => ({
          ...prev,
          splitType: value,
        }))
      }
    }

    // If changing amount and split type is equal, update participant shares
    if (name === "amount" && formData.splitType === "equal") {
      const equalShare = Number.parseFloat(value) / formData.participants.length || 0
      setFormData((prev) => ({
        ...prev,
        amount: value,
        participants: prev.participants.map((p) => ({
          ...p,
          share: equalShare,
        })),
      }))
    }
  }

  const handleParticipantChange = (index, e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : value

    setFormData((prev) => {
      const newParticipants = [...prev.participants]
      newParticipants[index] = {
        ...newParticipants[index],
        [name]: newValue,
      }

      // If changing share in custom split, only update that participant
      if (name === "share" && prev.splitType === "custom") {
        return {
          ...prev,
          participants: newParticipants,
        }
      }

      // If changing participant count in equal split, recalculate shares
      if (prev.splitType === "equal") {
        const equalShare = Number.parseFloat(prev.amount) / newParticipants.length || 0
        return {
          ...prev,
          participants: newParticipants.map((p) => ({
            ...p,
            share: equalShare,
          })),
        }
      }

      return {
        ...prev,
        participants: newParticipants,
      }
    })
  }

  const addParticipant = () => {
    setFormData((prev) => {
      const equalShare =
        prev.splitType === "equal" ? Number.parseFloat(prev.amount) / (prev.participants.length + 1) || 0 : 0

      return {
        ...prev,
        participants: [
          ...prev.participants.map((p) => ({
            ...p,
            share: prev.splitType === "equal" ? equalShare : p.share,
          })),
          { name: "", email: "", share: equalShare, hasPaid: false },
        ],
      }
    })
  }

  const removeParticipant = (index) => {
    if (formData.participants.length <= 1) {
      return // Don't remove the last participant
    }

    setFormData((prev) => {
      const newParticipants = prev.participants.filter((_, i) => i !== index)

      // Recalculate shares for equal split
      if (prev.splitType === "equal") {
        const equalShare = Number.parseFloat(prev.amount) / newParticipants.length || 0
        return {
          ...prev,
          participants: newParticipants.map((p) => ({
            ...p,
            share: equalShare,
          })),
        }
      }

      return {
        ...prev,
        participants: newParticipants,
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Log the form data for debugging
    console.log("Form data before validation:", formData)

    if (!validateForm()) {
      console.error("Form validation failed:", errors)
      return
    }

    setIsSubmitting(true)

    try {
      // Format data for API
      const expenseData = {
        ...formData,
        amount: Number.parseFloat(formData.amount),
        participants: formData.participants.map((p) => ({
          ...p,
          share: Number.parseFloat(p.share) || 0,
        })),
      }

      // Log the data being sent to the API
      console.log("Sending expense data to API:", expenseData)

      const success = await onSubmit(expenseData)
      console.log("API response success:", success)

      if (success) {
        // Reset form if it's a new expense (not editing)
        if (!expense) {
          setFormData({
            description: "",
            amount: "",
            date: new Date().toISOString().split("T")[0],
            splitType: "equal",
            status: "Pending",
            participants: [{ name: "", email: "", share: 0, hasPaid: false }],
          })
        }
      }
    } catch (err) {
      console.error("Error submitting form:", err)

      // Display more specific error information
      if (err.response && err.response.data) {
        setErrors({
          form: err.response.data.message || "Server error. Please check the console for details.",
        })
      } else {
        setErrors({
          form: "Failed to connect to the server. Please check your network connection.",
        })
      }
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
        {errors.form && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {errors.form}</span>
          </div>
        )}

        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="description"
                id="description"
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.description ? "border-red-300" : ""
                }`}
                placeholder="Dinner, Rent, Movie tickets, etc."
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <motion.div variants={itemVariants}>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md ${
                    errors.amount ? "border-red-300" : ""
                  }`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">USD</span>
                </div>
              </div>
              {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
              {exchangeRate && formData.amount && (
                <p className="mt-1 text-sm text-gray-500">
                  ≈ LKR {(Number(formData.amount) * exchangeRate).toFixed(2)}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="date"
                  id="date"
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.date ? "border-red-300" : ""
                  }`}
                  value={formData.date}
                  onChange={handleChange}
                />
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="splitType" className="block text-sm font-medium text-gray-700">
              Split Type
            </label>
            <select
              id="splitType"
              name="splitType"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={formData.splitType}
              onChange={handleChange}
            >
              <option value="equal">Equal Split</option>
              <option value="custom">Custom Split</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {formData.splitType === "equal"
                ? "The expense will be divided equally among all participants."
                : "Specify how much each person should pay."}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Participants</label>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={addParticipant}
              >
                <svg
                  className="-ml-0.5 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Person
              </button>
            </div>

            {errors.participants && <p className="mt-1 text-sm text-red-600">{errors.participants}</p>}

            <div className="mt-2 space-y-4">
              {formData.participants.map((participant, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-gray-900">Person {index + 1}</h4>
                    {formData.participants.length > 1 && (
                      <button
                        type="button"
                        className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => removeParticipant(index)}
                      >
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`participant-name-${index}`} className="block text-xs font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        id={`participant-name-${index}`}
                        name="name"
                        className={`mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                          errors.participantDetails?.[index]?.name ? "border-red-300" : ""
                        }`}
                        value={participant.name}
                        onChange={(e) => handleParticipantChange(index, e)}
                      />
                      {errors.participantDetails?.[index]?.name && (
                        <p className="mt-1 text-xs text-red-600">{errors.participantDetails[index].name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor={`participant-email-${index}`} className="block text-xs font-medium text-gray-700">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        id={`participant-email-${index}`}
                        name="email"
                        className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={participant.email}
                        onChange={(e) => handleParticipantChange(index, e)}
                      />
                    </div>

                    {formData.splitType === "custom" && (
                      <div>
                        <label
                          htmlFor={`participant-share-${index}`}
                          className="block text-xs font-medium text-gray-700"
                        >
                          Share Amount
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-xs">$</span>
                          </div>
                          <input
                            type="number"
                            id={`participant-share-${index}`}
                            name="share"
                            className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md ${
                              errors.participantDetails?.[index]?.share ? "border-red-300" : ""
                            }`}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            value={participant.share}
                            onChange={(e) => handleParticipantChange(index, e)}
                          />
                        </div>
                        {errors.participantDetails?.[index]?.share && (
                          <p className="mt-1 text-xs text-red-600">{errors.participantDetails[index].share}</p>
                        )}
                        {exchangeRate && participant.share && (
                          <p className="mt-1 text-xs text-gray-500">
                            ≈ LKR {(Number(participant.share) * exchangeRate).toFixed(2)}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center h-10">
                      <input
                        id={`participant-paid-${index}`}
                        name="hasPaid"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={participant.hasPaid}
                        onChange={(e) => handleParticipantChange(index, e)}
                      />
                      <label htmlFor={`participant-paid-${index}`} className="ml-2 block text-sm text-gray-700">
                        Has paid
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {errors.splitTotal && <p className="mt-2 text-sm text-red-600">{errors.splitTotal}</p>}

            {formData.splitType === "equal" && formData.amount && formData.participants.length > 0 && (
              <p className="mt-2 text-sm text-gray-500">
                Each person will pay ${(Number.parseFloat(formData.amount) / formData.participants.length).toFixed(2)}
                {exchangeRate && (
                  <span className="ml-1">
                    (≈ LKR{" "}
                    {((Number.parseFloat(formData.amount) * exchangeRate) / formData.participants.length).toFixed(2)})
                  </span>
                )}
              </p>
            )}
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
            ) : expense ? (
              "Update Expense"
            ) : (
              "Create Expense"
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  )
}

export default ExpenseForm
