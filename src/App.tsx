import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ExpenseProvider } from './context/ExpenseContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
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
      <ExpenseProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="budgets" element={<Budgets />} />
              <Route path="family" element={<Family />} />
              <Route path="savings" element={<Savings />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </ExpenseProvider>
    </ThemeProvider>
  )
}

export default App