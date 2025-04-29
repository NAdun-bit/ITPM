"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./Components/Home/Header"
import Home from "./Components/Home/Home"
import Footer from "./Components/Home/Footer"
import ExpenseDashboard from "./Components/Expenses/ExpenseDashboard"
import SavingsDashboard from "./Components/Savings/SavingsDashboard"
import BudgetDashboard from "./Components/Budget/BudgetDashboard"
import BudgetFeatures from "./Components/Budget/BudgetFeatures"
import TransactionManager from "./Components/Budget/TransactionManager"
import TransactionForm from "./Components/Budget/TransactionForm"
import LoginForm from "./Components/Auth/LoginForm"
import RegisterForm from "./Components/Auth/RegisterForm"
import UserProfile from "./Components/Auth/UserProfile"
import ProtectedRoute from "./Components/Auth/ProtectedRoute"
import { isAuthenticated } from "./Services/authService"
import "./App.css"
import { motion, AnimatePresence } from "framer-motion"

function App() {
  const [loading, setLoading] = useState(true)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Router>
      <div className="App">
        <AnimatePresence>
          {loading ? (
            <motion.div
              key="loader"
              className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
              />
              <motion.h2
                className="absolute mt-24 text-white text-xl font-bold"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              >
               Coin Control
              </motion.h2>
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/expenses" element={<ExpenseDashboard />} />
                <Route path="/savings" element={<SavingsDashboard />} />
                <Route path="/budget" element={<BudgetDashboard />} />
                <Route path="/budget-features" element={<BudgetFeatures />} />
                <Route path="/transactions" element={<TransactionManager />} />
                <Route path="/Form" element={<TransactionForm />} />
                <Route path="/Login" element={<LoginForm />} />
                <Route path="/Register" element={<RegisterForm />} />

              </Routes>
              <Footer />

              {/* Floating Action Button */}
              <motion.div
                className="fixed bottom-6 right-6 z-40"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
              >
                <motion.button
                  className="bg-blue-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, backgroundColor: "#3b82f6" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Router>
  )
}

export default App

