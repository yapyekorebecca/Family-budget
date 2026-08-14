import { Calendar, Download, ChevronDown, CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { motion } from 'framer-motion'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { getExpenses, ApiExpense } from '../api/expenses'
import { getBudgets, ApiBudget } from '../api/budgets'
import { getGoals, ApiGoal } from '../api/goals'

const budgetColors: Record<string, string> = {
  Food: '#38bdf8',
  Rent: '#4ade80',
  Transport: '#14b8a6',
  Utilities: '#ef4444',
  School: '#a855f7',
  Savings: '#fbbf24',
  Entertainment: '#d946ef',
  Shopping: '#f97316',
  Health: '#10b981',
  Other: '#94a3b8',
}

export default function Dashboard() {
  const [expenses, setExpenses] = useState<ApiExpense[]>([])
  const [budgets, setBudgets] = useState<ApiBudget[]>([])
  const [goals, setGoals] = useState<ApiGoal[]>([])
  const [loading, setLoading] = useState(true)

  const currentMonth = new Date().toISOString().slice(0, 7)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [expRes, budRes, goalRes] = await Promise.all([getExpenses(), getBudgets(), getGoals()])
      if (expRes.success) setExpenses(expRes.data)
      if (budRes.success) setBudgets(budRes.data)
      if (goalRes.success) setGoals(goalRes.data)
    } catch {
      // silently fail — dashboard is read-only
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // ── Budget pie chart data ──────────────────────────────────────────────────
  const monthlyBudgetData = useMemo(() =>
    budgets
      .filter((b) => b.month === currentMonth)
      .map((b) => ({
        name: b.category,
        value: parseFloat(b.amount),
        color: budgetColors[b.category] ?? '#94a3b8',
      }))
      .filter((i) => i.value > 0),
    [budgets, currentMonth]
  )

  const totalMonthlyBudget = monthlyBudgetData.reduce((s, i) => s + i.value, 0)

  // ── Current month expenses ────────────────────────────────────────────────
  const currentMonthExpenses = useMemo(
    () => expenses.filter((e) => e.date.startsWith(currentMonth)),
    [expenses, currentMonth]
  )

  const totalSpent = useMemo(
    () => currentMonthExpenses.reduce((s, e) => s + parseFloat(e.amount), 0),
    [currentMonthExpenses]
  )

  // ── Spending % by category ────────────────────────────────────────────────
  const spentData = useMemo(() => {
    const totals: Record<string, number> = {}
    currentMonthExpenses.forEach((e) => {
      totals[e.category] = (totals[e.category] ?? 0) + parseFloat(e.amount)
    })
    return Object.entries(totals)
      .map(([name, amount]) => ({
        name,
        value: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
        color: budgetColors[name] ?? '#94a3b8',
      }))
      .filter((i) => i.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [currentMonthExpenses, totalSpent])

  // ── Weekly bar chart ───────────────────────────────────────────────────────
  const barData = useMemo(() => {
    const weeklyBudget = totalMonthlyBudget / 4
    return ['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, idx) => {
      const start = idx * 7 + 1
      const end = (idx + 1) * 7
      const weekSpent = currentMonthExpenses
        .filter((e) => {
          const day = parseInt(e.date.split('-')[2])
          return day >= start && day <= end
        })
        .reduce((s, e) => s + parseFloat(e.amount), 0)
      return { name: week, budget: weeklyBudget / 1000, spent: weekSpent / 1000 }
    })
  }, [currentMonthExpenses, totalMonthlyBudget])

  const remainingBudget = totalMonthlyBudget - totalSpent

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-xs text-text-muted mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-text-muted" />
            <span>{currentMonth}</span>
            <ChevronDown className="w-3 h-3" />
          </div>
          <button className="p-2 hover:bg-background rounded-lg">
            <Download className="w-4 h-4 text-text-muted" />
          </button>
        </div>
      </div>

      {/* Row 1: 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Budget pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-surface rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Monthly Budget</h3>
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                All categories <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div className="h-52 relative">
              {monthlyBudgetData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-text-muted text-sm">
                  No budgets for this month
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={monthlyBudgetData} cx="50%" cy="50%" innerRadius={60} outerRadius={75} paddingAngle={5} dataKey="value" stroke="none">
                        {monthlyBudgetData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [`UGX ${(v as number).toLocaleString()}`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-bold">UGX {totalMonthlyBudget.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
              {monthlyBudgetData.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
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
              {spentData.length === 0 ? (
                <div className="text-text-muted text-sm text-center py-4">No expenses this month</div>
              ) : (
                spentData.slice(0, 6).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold w-12" style={{ color: item.color }}>{item.value.toFixed(1)}%</span>
                    <span className="text-xs text-text-muted flex-1">{item.name}</span>
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* Budget Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="bg-surface rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Budget Status</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-teal-400 to-teal-200 rounded-xl p-6 text-white">
                <span className="text-sm opacity-80">Remaining Budget</span>
                <div className="text-2xl font-bold mt-1 mb-4">UGX {Math.abs(remainingBudget).toLocaleString()}</div>
                <div className={`text-xs ${remainingBudget < 0 ? 'text-red-200' : 'text-white/80'}`}>
                  {remainingBudget < 0 ? '⚠️ Over budget' : '✓ Within budget'}
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-200 to-yellow-200 rounded-xl p-6 text-gray-800">
                <span className="text-sm opacity-70">{goals.length > 0 ? goals[0].title : 'Savings Goal'}</span>
                <div className="text-2xl font-bold mt-1">
                  {goals.length > 0 ? `${goals[0].progress_percent.toFixed(0)}%` : '0%'}
                </div>
                <div className="text-sm mt-1">
                  Target: UGX {goals.length > 0 ? parseFloat(goals[0].target_amount).toLocaleString() : '0'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
          <div className="bg-surface rounded-2xl p-6">
            <h3 className="text-sm font-medium mb-4">Monthly Spending Overview</h3>
            <div className="flex items-center gap-8 mb-4">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-teal-400" />
                <span className="text-text-muted">Budget</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-orange-400" />
                <span className="text-text-muted">Actual Spending</span>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <Tooltip formatter={(v) => [`UGX ${((v as number) * 1000).toLocaleString()}`, '']} />
                  <Bar dataKey="budget" fill="#2dd4bf" radius={[4, 4, 1, 1]} />
                  <Bar dataKey="spent" fill="#f97316" radius={[4, 4, 1, 1]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Savings goals list */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="bg-surface rounded-2xl p-6">
            <h3 className="text-sm font-medium mb-4">Savings Goals</h3>
            <div className="space-y-4">
              {goals.length === 0 ? (
                <div className="text-center py-8 text-text-muted text-sm">
                  No savings goals yet. Create one to get started!
                </div>
              ) : (
                goals.slice(0, 4).map((goal, idx) => {
                  const done = parseFloat(goal.current_amount) >= parseFloat(goal.target_amount)
                  return (
                    <div key={idx} className="flex gap-3">
                      {done
                        ? <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        : <Circle className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" />}
                      <div>
                        <h4 className={`text-sm font-medium ${done ? 'text-text-muted line-through' : ''}`}>
                          {goal.title}
                        </h4>
                        <p className="text-xs text-text-muted mt-0.5">
                          UGX {parseFloat(goal.current_amount).toLocaleString()} / {parseFloat(goal.target_amount).toLocaleString()} ({goal.progress_percent.toFixed(0)}%)
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
