"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"

function ExpenseViewPage() {
  const { id } = useParams()
  const [expense, setExpense] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await fetch(`/api/expenses/${id}`)
        if (!res.ok) throw new Error("Failed to fetch expense")
        const data = await res.json()
        setExpense(data)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error("Error fetching expense:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchExpense()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>
  }

  if (!expense) {
    return <p className="text-center text-gray-500 mt-10">No expense data found.</p>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-white rounded shadow"
    >
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Expense Details</h1>

      <div className="space-y-4">
        <div>
          <span className="font-semibold text-gray-700">Description:</span> {expense.description}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Amount:</span> ${expense.amount.toFixed(2)}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Date:</span> {new Date(expense.date).toLocaleDateString()}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Status:</span> {expense.status}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Split Type:</span> {expense.splitType}
        </div>

        <div>
          <h2 className="text-lg font-semibold mt-6 mb-2">Participants</h2>
          <ul className="divide-y divide-gray-200">
            {expense.participants.map((p, idx) => (
              <li key={idx} className="py-2">
                <p>
                  <span className="font-medium">{p.name}</span> - ${p.share.toFixed(2)} {p.hasPaid ? "(Paid)" : "(Pending)"}
                </p>
                {p.email && <p className="text-sm text-gray-500">{p.email}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

export default ExpenseViewPage
