import { Navigate, Outlet } from "react-router-dom"
import { isAuthenticated } from "../../Services/authService"

function ProtectedRoute() {
  // Check if the user is authenticated
  const isAuth = isAuthenticated()

  // If not authenticated, redirect to login page
  if (!isAuth) {
    return <Navigate to="/login" replace />
  }

  // If authenticated, render the child routes
  return <Outlet />
}

export default ProtectedRoute
