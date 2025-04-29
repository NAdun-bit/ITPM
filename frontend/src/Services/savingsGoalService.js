// Base URL for API calls
const API_BASE_URL = "http://localhost:8070/api/savings-goals"

// Fetch all savings goals
export const fetchSavingsGoals = async () => {
  try {
    console.log("Fetching savings goals from:", API_BASE_URL)
    const response = await fetch(API_BASE_URL)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to fetch savings goals: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Savings goals fetched successfully:", data)
    return data
  } catch (error) {
    console.error("Error fetching savings goals:", error)
    throw error
  }
}

// Add a new savings goal
export const addSavingsGoal = async (goalData) => {
  try {
    console.log("Adding savings goal to:", `${API_BASE_URL}/add`)
    console.log("Goal data:", JSON.stringify(goalData))

    const response = await fetch(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goalData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to add savings goal: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Savings goal added successfully:", data)
    return data
  } catch (error) {
    console.error("Error adding savings goal:", error)
    throw error
  }
}

// Update an existing savings goal
export const updateSavingsGoal = async (id, goalData) => {
  try {
    console.log(`Updating savings goal with id ${id} at:`, `${API_BASE_URL}/${id}`)
    console.log("Update data:", JSON.stringify(goalData))

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goalData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to update savings goal: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Savings goal updated successfully:", data)
    return data
  } catch (error) {
    console.error("Error updating savings goal:", error)
    throw error
  }
}

// Delete a savings goal
export const deleteSavingsGoal = async (id) => {
  try {
    console.log(`Deleting savings goal with id ${id} at:`, `${API_BASE_URL}/${id}`)
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to delete savings goal: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Savings goal deleted successfully:", data)
    return data
  } catch (error) {
    console.error("Error deleting savings goal:", error)
    throw error
  }
}

// Add a contribution to a savings goal
export const addContribution = async (id, contributionData) => {
  try {
    console.log(`Adding contribution to savings goal ${id} at:`, `${API_BASE_URL}/${id}/contribute`)
    console.log("Contribution data:", JSON.stringify(contributionData))

    const response = await fetch(`${API_BASE_URL}/${id}/contribute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contributionData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to add contribution: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Contribution added successfully:", data)
    return data
  } catch (error) {
    console.error("Error adding contribution:", error)
    throw error
  }
}

// Get a report for a savings goal
export const getSavingsGoalReport = async (id) => {
  try {
    console.log(`Getting report for savings goal ${id} at:`, `${API_BASE_URL}/${id}/report`)
    const response = await fetch(`${API_BASE_URL}/${id}/report`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to get savings goal report: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Savings goal report fetched successfully:", data)
    return data
  } catch (error) {
    console.error("Error getting savings goal report:", error)
    throw error
  }
}

// Export report as CSV
export const exportReportAsCSV = (report) => {
  try {
    if (!report) {
      throw new Error("No report data to export")
    }

    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,"

    // Add header row
    csvContent +=
      "Goal Name,Target Amount,Current Amount,Remaining Amount,Progress %,Start Date,End Date,Days Remaining,Status\n"

    // Add data row
    const row = [
      `"${report.name}"`,
      report.targetAmount.toFixed(2),
      report.currentAmount.toFixed(2),
      report.remainingAmount.toFixed(2),
      report.amountProgress.toFixed(2),
      new Date(report.startDate).toLocaleDateString(),
      new Date(report.endDate).toLocaleDateString(),
      report.remainingDays,
      report.isCompleted ? "Completed" : report.isOnTrack ? "On Track" : "Behind Schedule",
    ]

    csvContent += row.join(",") + "\n\n"

    // Add contributions section
    csvContent += "Contributions\n"
    csvContent += "Date,Amount,Note\n"

    if (report.contributions && report.contributions.length > 0) {
      report.contributions.forEach((contribution) => {
        const contribRow = [
          new Date(contribution.date).toLocaleDateString(),
          contribution.amount.toFixed(2),
          `"${contribution.note || ""}"`,
        ]
        csvContent += contribRow.join(",") + "\n"
      })
    } else {
      csvContent += "No contributions yet\n"
    }

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `savings-goal-report-${report.name}-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)

    // Trigger download
    link.click()
    document.body.removeChild(link)

    return true
  } catch (error) {
    console.error("Error exporting report as CSV:", error)
    throw error
  }
}
