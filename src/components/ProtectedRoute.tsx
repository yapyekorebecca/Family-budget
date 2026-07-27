import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader2 } from 'lucide-react'

/**
 * ProtectedRoute Component
 * -----------------------------------------------------------
 * Wraps authenticated pages. If the user is NOT logged in:
 *   → Redirect to /login?next=... (so after login they come back to where they wanted)
 * 
 * If the user IS logged in:
 *   → Render the child page
 * 
 * If loading (restoring session from localStorage):
 *   → Show a friendly loading spinner so user knows something's happening
 * 
 * USAGE in App.tsx:
 *   <Route element={<ProtectedRoute><Page /></ProtectedRoute>} />
 */
interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // ---- Case 1: Still loading (restoring from localStorage on mount)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0fdfa]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-gray-500 text-sm">Restoring your session...</p>
        </div>
      </div>
    )
  }

  // ---- Case 2: NOT logged in → Kick them to login page!
  // Pass `next` as search param so after login, they go back to the page they wanted
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    )
  }

  // ---- Case 3: Logged in! Render the page they requested!
  return <>{children}</>
}

export default ProtectedRoute
