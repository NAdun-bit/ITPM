// Base URL for API calls
const API_BASE_URL = "http://localhost:8070/api/transactions"

// Fetch all transactions
export const fetchTransactions = async () => {
  try {
    console.log("Fetching transactions from:", API_BASE_URL)
    const response = await fetch(API_BASE_URL)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching transactions:", error)
    throw error
  }
}

// Add a new transaction
export const addTransaction = async (transactionData) => {
  try {
    console.log("Adding transaction to:", `${API_BASE_URL}/add`)
    console.log("Transaction data:", JSON.stringify(transactionData))

    const response = await fetch(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to add transaction: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error adding transaction:", error)
    throw error
  }
}

// Update an existing transaction
export const updateTransaction = async (id, transactionData) => {
  try {
    console.log(`Updating transaction with id ${id} at:`, `${API_BASE_URL}/${id}`)
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to update transaction: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating transaction:", error)
    throw error
  }
}

// Delete a transaction
export const deleteTransaction = async (id) => {
  try {
    console.log(`Deleting transaction with id ${id} at:`, `${API_BASE_URL}/${id}`)
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to delete transaction: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error deleting transaction:", error)
    throw error
  }
}

// Search and filter transactions
export const searchTransactions = async (searchParams) => {
  try {
    console.log("Searching transactions with params:", searchParams)
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchParams),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Failed to search transactions: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error searching transactions:", error)
    throw error
  }
}
