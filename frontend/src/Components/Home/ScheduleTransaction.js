"use client"

import { useState } from "react"
import { Calendar, Clock, DollarSign, Tag, User, CheckCircle } from "react-feather"

const ScheduleTransaction = () => {
  const [transactionType, setTransactionType] = useState("payment")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate transaction scheduling
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  return (
    <section className="mb-20">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
          <h2 className="text-3xl font-bold mb-4">Schedule Future Transactions</h2>
          <p className="text-lg opacity-90 max-w-2xl">
            Plan ahead by scheduling your payments, transfers, and deposits. Never miss a bill payment again.
          </p>
        </div>

        <div className="p-8">
          {showSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">Transaction Scheduled!</h3>
              <p className="text-green-700 mb-0">
                Your transaction has been scheduled successfully. You can view it in the Transaction Center.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Transaction Type</label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      transactionType === "payment"
                        ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                        : "bg-gray-100 text-gray-700 border border-gray-300"
                    }`}
                    onClick={() => setTransactionType("payment")}
                  >
                    <DollarSign size={16} className="mr-2" />
                    Payment
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      transactionType === "transfer"
                        ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                        : "bg-gray-100 text-gray-700 border border-gray-300"
                    }`}
                    onClick={() => setTransactionType("transfer")}
                  >
                    <User size={16} className="mr-2" />
                    Transfer
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      transactionType === "deposit"
                        ? "bg-green-100 text-green-700 border-2 border-green-300"
                        : "bg-gray-100 text-gray-700 border border-gray-300"
                    }`}
                    onClick={() => setTransactionType("deposit")}
                  >
                    <DollarSign size={16} className="mr-2" />
                    Deposit
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
                    {transactionType === "payment"
                      ? "Recipient/Payee"
                      : transactionType === "transfer"
                        ? "Recipient"
                        : "Source"}
                  </label>
                  <input
                    type="text"
                    id="recipient"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={
                      transactionType === "payment"
                        ? "Enter payee name"
                        : transactionType === "transfer"
                          ? "Enter recipient name"
                          : "Enter source"
                    }
                    required
                  />
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      id="amount"
                      className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-gray-500" />
                    </div>
                    <input
                      type="date"
                      id="date"
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Time (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock size={16} className="text-gray-500" />
                    </div>
                    <input
                      type="time"
                      id="time"
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag size={16} className="text-gray-500" />
                    </div>
                    <select
                      id="category"
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    >
                      <option value="">Select a category</option>
                      <option value="utilities">Utilities</option>
                      <option value="rent">Rent/Mortgage</option>
                      <option value="food">Food & Dining</option>
                      <option value="transport">Transportation</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="shopping">Shopping</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                    Repeat
                  </label>
                  <select
                    id="frequency"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="once">Once (Don't repeat)</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                  Note (Optional)
                </label>
                <textarea
                  id="note"
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a note about this transaction"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button type="button" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 mr-3">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Schedule Transaction
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-gray-50 p-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Tips for Scheduling Transactions</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Schedule bill payments a few days before the due date to avoid late fees.
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Set up recurring transfers to your savings account to build your emergency fund.
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Use the note field to add reminders about what the transaction is for.
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              You can edit or cancel scheduled transactions up to 24 hours before they are due.
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default ScheduleTransaction

