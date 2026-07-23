import { Calendar, Download, ChevronDown, CheckCircle2, Circle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { motion } from 'framer-motion'
import { useExpenses } from '../context/ExpenseContext'
import { useMemo } from 'react'

// Budget allocation colors
const budgetColors: Record<string, string> = {
  'Food': '#38bdf8',
  'Rent': '#4ade80',
  'Transport': '#14b8a6',
  'Utilities': '#ef4444',
  'School': '#a855f7',
  'Savings': '#fbbf24',
  'Entertainment': '#d946ef',
}

export default function Dashboard() {
  const { expenses, savingsGoals, budgets, getTotalByCategory } = useExpenses()
  
  // Calculate current month
  const currentMonth = new Date().toISOString().slice(0, 7)
  
  // Get monthly budget allocation
  const monthlyBudgetData = useMemo(() => {
    const categories = ['Food', 'Rent', 'Transport', 'Utilities', 'School', 'Savings', 'Entertainment']
    return categories.map(cat => ({
      name: cat,
      value: budgets.find(b => b.category === cat && b.month === currentMonth)?.amount || 0,
      color: budgetColors[cat] || '#94a3b8'
    })).filter(item => item.value > 0)
  }, [budgets, currentMonth])
  
  const totalMonthlyBudget = monthlyBudgetData.reduce((sum, item) => sum + item.value, 0)
  
  // Calculate expenses for current month
  const currentMonthExpenses = useMemo(() => {
    return expenses.filter(e => e.date.startsWith(currentMonth))
  }, [expenses, currentMonth])
  
  const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0)
  
  // Calculate spending by category with percentages
  const spentData = useMemo(() => {
    const categoryTotals = getTotalByCategory()
    const categories = ['Food', 'Rent', 'Transport', 'Utilities', 'Shopping', 'Health', 'Entertainment']
    
    return categories.map(cat => {
      const amount = categoryTotals[cat as keyof typeof categoryTotals] || 0
      return {
        name: cat,
        value: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
        color: budgetColors[cat] || '#94a3b8'
      }
    }).filter(item => item.value > 0)
  }, [currentMonthExpenses, totalSpent, getTotalByCategory])
  
  // Calculate weekly spending data (Budget vs Actual)
  const barData = useMemo(() => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    const weeklyBudget = totalMonthlyBudget / 4
    
    return weeks.map((week, idx) => {
      const weekStart = idx * 7 + 1
      const weekEnd = (idx + 1) * 7
      
      const weekExpenses = currentMonthExpenses.filter(e => {
        const day = parseInt(e.date.split('-')[2])
        return day >= weekStart && day <= weekEnd
      })
      
      const weekSpent = weekExpenses.reduce((sum, e) => sum + e.amount, 0)
      
      return {
        name: week,
        budget: weeklyBudget / 1000, // Scale for display
        spent: weekSpent / 1000, // Scale for display
      }
    })
  }, [currentMonthExpenses, totalMonthlyBudget])
  
  // Get savings goals
  const goals = useMemo(() => {
    return savingsGoals.map(goal => ({
      title: goal.title,
      description: `Target: UGX ${goal.target.toLocaleString()} | Current: UGX ${goal.current.toLocaleString()} (${Math.round((goal.current / goal.target) * 100)}%)`,
      completed: goal.current >= goal.target
    }))
  }, [savingsGoals])
  
  // Calculate remaining budget
  const remainingBudget = totalMonthlyBudget - totalSpent

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-xs text-text-muted mt-1">Today is 19 September 2022</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-text-muted" />
            <span>Jul 2 - Today 2022</span>
            <ChevronDown className="w-3 h-3" />
          </div>
          <button className="p-2 hover:bg-background rounded-lg">
            <Download className="w-4 h-4 text-text-muted" />
          </button>
        </div>
      </div>

      {/* First Row: 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Budget */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-surface rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Monthly Budget</h3>
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                All categories <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div className="h-52 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={monthlyBudgetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {monthlyBudgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`UGX ${(value as number).toLocaleString()}`, '']} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold">UGX {totalMonthlyBudget.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 flex-wrap">
              {monthlyBudgetData.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-text-muted">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Monthly Expenses */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="bg-surface rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Monthly Expenses</h3>
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                Total Spent <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-6">UGX {totalSpent.toLocaleString()}</div>
            <div className="space-y-3">
              {spentData.slice(0, 6).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold w-12" style={{ color: item.color }}>{item.value.toFixed(1)}%</span>
                  <span className="text-xs text-text-muted flex-1">{item.name}</span>
                  <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Budget Status Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="bg-surface rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Budget Status</h3>
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                Current <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div className="space-y-3">
              {/* Card 1 - Remaining Budget */}
              <div className="bg-gradient-to-br from-teal-400 to-teal-200 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-80">Remaining Budget</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-white/50" />
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-4">UGX {Math.abs(remainingBudget).toLocaleString()}</div>
                <div className="flex items-center justify-between">
                  <button className="text-xs bg-white/20 px-4 py-2 rounded-lg">View Budget Details</button>
                  <div className="flex gap-0.5">
                    <div className="w-5 h-5 rounded-full bg-white/50" />
                    <div className="w-5 h-5 rounded-full bg-white/30 -ml-2" />
                  </div>
                </div>
              </div>

              {/* Card 2 - Savings Goal */}
              <div className="bg-gradient-to-br from-orange-200 to-yellow-200 rounded-xl p-6 text-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-70">
                    {savingsGoals.length > 0 ? savingsGoals[0].title : 'Emergency Fund'}
                  </span>
                </div>
                <div className="text-2xl font-bold mb-4">
                  {savingsGoals.length > 0 
                    ? `${Math.round((savingsGoals[0].current / savingsGoals[0].target) * 100)}%` 
                    : '0%'}
                </div>
                <div className="text-sm">
                  Target: UGX {savingsGoals.length > 0 ? savingsGoals[0].target.toLocaleString() : '0'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Second Row: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart (spans 2 columns) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
          <div className="bg-surface rounded-2xl p-6">
            <h3 className="text-sm font-medium mb-4">Monthly Spending Overview</h3>
            <div className="flex items-center justify-start gap-8 mb-4">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-gradient-to-b from-teal-400 to-yellow-300" />
                <span className="text-text-muted">Budget</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-gradient-to-b from-orange-300 to-red-400" />
                <span className="text-text-muted">Actual Spending</span>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <Tooltip formatter={(value) => [`UGX ${((value as number) * 1000).toLocaleString()}`, '']} />
                  <Bar dataKey="budget" radius={[4, 4, 1, 1]}>
                    {barData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill="url(#colorIncome)" />
                    ))}
                  </Bar>
                  <Bar dataKey="spent" radius={[4, 4, 1, 1]}>
                    {barData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill="url(#colorSpent)" />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2dd4bf" />
                      <stop offset="100%" stopColor="#fde047" />
                    </linearGradient>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fdba74" />
                      <stop offset="100%" stopColor="#f87171" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Savings Goals */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="bg-surface rounded-2xl p-6">
            <h3 className="text-sm font-medium mb-4">Savings Goals</h3>
            <div className="space-y-4">
              {goals.length === 0 ? (
                <div className="text-center py-8 text-text-muted text-sm">
                  No savings goals yet. Create one to get started!
                </div>
              ) : (
                goals.slice(0, 4).map((goal, idx) => (
                  <div key={idx} className="flex gap-3">
                    {goal.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className={`text-sm font-medium ${goal.completed ? 'text-text-muted line-through' : ''}`}>{goal.title}</h4>
                      <p className="text-xs text-text-muted mt-1 leading-relaxed">{goal.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
