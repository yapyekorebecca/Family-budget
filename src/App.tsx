import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ExpenseProvider } from './context/ExpenseContext'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Analytics from './pages/Analytics'
import Budgets from './pages/Budgets'
import Family from './pages/Family'
import Savings from './pages/Savings'
import Settings from './pages/Settings'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ExpenseProvider>
          <Router>
            <Routes>
              {/* --- PUBLIC ROUTES (anyone can visit --- */}
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />

              {/* --- PROTECTED ROUTES (only authenticated users!) --- */}
              {/* Wrap the entire Layout group with ProtectedRoute so ALL nested routes are private! */}
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                {/* If they visit root AND are already logged in, send them to dashboard */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="budgets" element={<Budgets />} />
                <Route path="family" element={<Family />} />
                <Route path="savings" element={<Savings />} />
                <Route path="settings" element={<Settings />} />

                {/* Catch-all inside protected routes → redirect to dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>

              {/* --- Catch-all for everything else --- */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ExpenseProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
