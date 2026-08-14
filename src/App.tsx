import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { FamilyProvider } from './context/FamilyContext'
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
import Statistics from './pages/Statistics'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FamilyProvider>
          <Router>
            <Routes>
              {/* --- PUBLIC ROUTES --- */}
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />

              {/* --- PROTECTED ROUTES --- */}
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="statistics" element={<Statistics />} />
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
        </FamilyProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
