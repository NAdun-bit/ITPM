import axios from "axios"

// Create an axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:8070/api/expenses",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request/response interceptors for better debugging
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method?.toUpperCase(), config.url, config.data)
    return config
  },
  (error) => {
    console.error("Request Error:", error)
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.data)
    return response
  },
  (error) => {
    console.error("Response Error:", error.response?.status, error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export const fetchExpenses = async () => {
  try {
    const res = await api.get("/")
    return res.data
  } catch (error) {
    console.error("Error fetching expenses:", error)
    throw error
  }
}

export const addExpense = async (expenseData) => {
  try {
    // The route in your backend is /api/expenses/add
    const res = await api.post("/add", expenseData)
    return res.data
  } catch (error) {
    console.error("Error adding expense:", error)
    throw error
  }
}

export const updateExpense = async (id, expenseData) => {
  try {
    const res = await api.put(`/${id}`, expenseData)
    return res.data
  } catch (error) {
    console.error("Error updating expense:", error)
    throw error
  }
}

export const deleteExpense = async (id) => {
  try {
    const res = await api.delete(`/${id}`)
    return res.data
  } catch (error) {
    console.error("Error deleting expense:", error)
    throw error
  }
}
