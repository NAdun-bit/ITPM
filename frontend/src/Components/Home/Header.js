"use client"
import { Link, useNavigate } from "react-router-dom"
import { isAuthenticated, logoutUser, getCurrentUser } from "../../Services/authService"

function Header() {
  const navigate = useNavigate()
  const isAuth = isAuthenticated()
  const currentUser = getCurrentUser()

  const handleLogout = () => {
    logoutUser()
    navigate("/login")
  }

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              FinTrack
            </Link>
            {isAuth && (
              <nav className="ml-8 hidden md:flex space-x-4">
                <Link to="/" className="hover:text-blue-200 transition-colors">
                  Dashboard
                </Link>
                <Link to="/expenses" className="hover:text-blue-200 transition-colors">
                  Expenses
                </Link>
                <Link to="/savings" className="hover:text-blue-200 transition-colors">
                  Savings
                </Link>
                <Link to="/budget" className="hover:text-blue-200 transition-colors">
                  Budget
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuth ? (
              <>
                <div className="hidden md:flex items-center">
                  <span className="mr-2">Welcome, {currentUser?.firstName || currentUser?.username || "User"}</span>
                  <div className="relative group">
                    <button className="flex items-center focus:outline-none">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold border-2 border-white">
                        {currentUser?.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Your Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="md:hidden bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
