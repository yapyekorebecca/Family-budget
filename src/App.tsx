import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ExpenseProvider } from './context/ExpenseContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Statistics from './pages/Statistics'
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
              <Route path="statistics" element={<Statistics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </ExpenseProvider>
    </ThemeProvider>
  )
}

export default App
