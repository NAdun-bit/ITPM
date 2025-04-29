// Base URL for API calls
const API_BASE_URL = "http://localhost:8070/api/budgets"

// Fetch all budgets
export const fetchBudgets = async () => {
  try {
    console.log("Fetching budgets from:", API_BASE_URL)
    const response = await fetch(API_BASE_URL)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to fetch budgets: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching budgets:", error)
    throw error
  }
}

// Add a new budget
export const addBudget = async (budgetData) => {
  try {
    console.log("Adding budget to:", `${API_BASE_URL}/add`)
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budgetData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to add budget: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error adding budget:", error)
    throw error
  }
}

// Update an existing budget
export const updateBudget = async (id, budgetData) => {
  try {
    console.log(`Updating budget with id ${id} at:`, `${API_BASE_URL}/${id}`)
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budgetData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to update budget: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating budget:", error)
    throw error
  }
}

// Delete a budget
export const deleteBudget = async (id) => {
  try {
    console.log(`Deleting budget with id ${id} at:`, `${API_BASE_URL}/${id}`)
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to delete budget: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error deleting budget:", error)
    throw error
  }
}

// Get budget with expense data for a specific month/year
export const fetchMonthlyBudget = async (month, year) => {
  try {
    console.log(`Fetching monthly budget for ${month}/${year} from:`, `${API_BASE_URL}/monthly/${month}/${year}`)
    const response = await fetch(`${API_BASE_URL}/monthly/${month}/${year}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to fetch monthly budget: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching monthly budget:", error)
    throw error
  }
}

// Add a custom category to a budget
export const addCustomCategory = async (budgetId, categoryData) => {
  try {
    console.log(`Adding custom category to budget ${budgetId}`)
    const response = await fetch(`${API_BASE_URL}/${budgetId}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to add custom category: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error adding custom category:", error)
    throw error
  }
}

// Reset or carry forward budget
export const resetBudget = async (budgetId, carryForward) => {
  try {
    console.log(`Resetting budget ${budgetId} with carry forward: ${carryForward}`)
    const response = await fetch(`${API_BASE_URL}/${budgetId}/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ carryForward }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to reset budget: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error resetting budget:", error)
    throw error
  }
}

// Get category breakdown for visualization
export const getBudgetVisualization = async (budgetId) => {
  try {
    console.log(`Getting visualization data for budget ${budgetId}`)
    const response = await fetch(`${API_BASE_URL}/${budgetId}/visualization`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to get visualization data: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting visualization data:", error)
    throw error
  }
}

// Update category actual spending for a category
export const updateCategoryActual = async (budgetId, categoryId, actualAmount) => {
  try {
    console.log(`Updating category actual amount at:`, `${API_BASE_URL}/${budgetId}/category/${categoryId}`)
    const response = await fetch(`${API_BASE_URL}/${budgetId}/category/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ actualAmount }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to update category actual amount: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating category actual amount:", error)
    throw error
  }
}

