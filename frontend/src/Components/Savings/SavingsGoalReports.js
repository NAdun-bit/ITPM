"use client"

import { useState } from "react"
import { motion } from "framer-motion"

function SavingsGoalReports({ savingsGoals = [] }) {
  const [reportType, setReportType] = useState("summary")
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  })

  // Ensure savingsGoals is an array
  const goalsArray = Array.isArray(savingsGoals) ? savingsGoals : []

  const filteredGoals = goalsArray.filter((goal) => {
    if (!goal || !goal.startDate) return false

    const goalStartDate = new Date(goal.startDate)
    const startDate = new Date(dateRange.startDate)
    const endDate = new Date(dateRange.endDate)
    return goalStartDate >= startDate && goalStartDate <= endDate
  })

  const generateCSV = () => {
    if (filteredGoals.length === 0) return

    let csvContent = ""

    if (reportType === "summary") {
      // Summary report headers
      csvContent = "Name,Target Amount,Current Amount,Progress %,Start Date,End Date,Category,Priority\n"

      // Add data rows
      filteredGoals.forEach((goal) => {
        const progressPercentage = goal.progressPercentage || 0
        const row = [
          `"${goal.name}"`,
          goal.targetAmount.toFixed(2),
          goal.currentAmount.toFixed(2),
          progressPercentage.toFixed(2),
          new Date(goal.startDate).toLocaleDateString(),
          new Date(goal.endDate).toLocaleDateString(),
          goal.category,
          goal.priority,
        ]
        csvContent += row.join(",") + "\n"
      })
    } else if (reportType === "detailed") {
      // Detailed report headers
      csvContent =
        "Name,Target Amount,Current Amount,Remaining Amount,Progress %,Start Date,End Date,Days Remaining,Category,Priority,Description\n"

      // Add data rows
      filteredGoals.forEach((goal) => {
        const progressPercentage = goal.progressPercentage || 0
        const today = new Date()
        const endDate = new Date(goal.endDate)
        const daysRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)))

        const row = [
          `"${goal.name}"`,
          goal.targetAmount.toFixed(2),
          goal.currentAmount.toFixed(2),
          (goal.targetAmount - goal.currentAmount).toFixed(2),
          progressPercentage.toFixed(2),
          new Date(goal.startDate).toLocaleDateString(),
          new Date(goal.endDate).toLocaleDateString(),
          daysRemaining,
          goal.category,
          goal.priority,
          `"${goal.description || ""}"`,
        ]
        csvContent += row.join(",") + "\n"
      })
    } else if (reportType === "contributions") {
      // Contributions report
      csvContent = "Goal Name,Contribution Date,Amount,Note\n"

      // Add data rows
      filteredGoals.forEach((goal) => {
        if (goal.contributions && goal.contributions.length > 0) {
          goal.contributions.forEach((contribution) => {
            const row = [
              `"${goal.name}"`,
              new Date(contribution.date).toLocaleDateString(),
              contribution.amount.toFixed(2),
              `"${contribution.note || ""}"`,
            ]
            csvContent += row.join(",") + "\n"
          })
        }
      })
    }

    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `savings-goals-report-${reportType}-${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generatePDF = () => {
    alert(
      "PDF generation would be implemented here with a library like jsPDF or by sending the data to a server endpoint that generates PDFs.",
    )
  }

  const containerVariants = {
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
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6" variants={itemVariants}>
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Generate Reports</h3>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="report-type" className="block text-sm font-medium text-gray-700">
                Report Type
              </label>
              <select
                id="report-type"
                name="report-type"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="summary">Summary Report</option>
                <option value="detailed">Detailed Report</option>
                <option value="contributions">Contributions Report</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="start-date"
                id="start-date"
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                name="end-date"
                id="end-date"
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={generateCSV}
              disabled={filteredGoals.length === 0}
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download CSV
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={generatePDF}
              disabled={filteredGoals.length === 0}
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Report Preview</h3>

        {filteredGoals.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No savings goals found</h3>
              <p className="mt-1 text-sm text-gray-500">Adjust your date range to include savings goals.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {reportType === "summary"
                    ? "Summary Report"
                    : reportType === "detailed"
                      ? "Detailed Report"
                      : "Contributions Report"}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {dateRange.startDate} to {dateRange.endDate}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {filteredGoals.length} goal{filteredGoals.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                {reportType === "summary" && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Target Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Current Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Progress
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Category
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredGoals.map((goal) => {
                        const progressPercentage = goal.progressPercentage || 0
                        return (
                          <tr key={goal._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {goal.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${goal.targetAmount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${goal.currentAmount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <span className="mr-2">{progressPercentage.toFixed(1)}%</span>
                                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                  <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${progressPercentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{goal.category}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}

                {reportType === "detailed" && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Target Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Current Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Remaining
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          End Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Days Left
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Priority
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredGoals.map((goal) => {
                        const today = new Date()
                        const endDate = new Date(goal.endDate)
                        const daysRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)))

                        return (
                          <tr key={goal._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {goal.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${goal.targetAmount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${goal.currentAmount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${(goal.targetAmount - goal.currentAmount).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(goal.endDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {goal.isCompleted ? "Completed" : daysRemaining}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  goal.priority === "High"
                                    ? "bg-red-100 text-red-800"
                                    : goal.priority === "Medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                }`}
                              >
                                {goal.priority}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}

                {reportType === "contributions" && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Goal Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Note
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredGoals.flatMap((goal) => {
                        if (!goal.contributions || goal.contributions.length === 0) {
                          return [
                            <tr key={`${goal._id}-no-contributions`}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {goal.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={3}>
                                No contributions yet
                              </td>
                            </tr>,
                          ]
                        }

                        return goal.contributions.map((contribution, index) => (
                          <tr key={`${goal._id}-${index}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {goal.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(contribution.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${contribution.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{contribution.note || "-"}</td>
                          </tr>
                        ))
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default SavingsGoalReports
