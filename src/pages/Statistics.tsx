import { useMemo, useState, useEffect, useCallback } from 'react'
import { getExpenses, ApiExpense } from '../api/expenses'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts'
import { motion } from 'framer-motion'
import { TrendingUp, PieChart as PieIcon, BarChart2, Activity, Loader2 } from 'lucide-react'

const COLORS = ['#f59e0b', '#6366f1', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-surface border border-dark-border rounded-xl px-4 py-3 shadow-2xl">
        {label && <p className="text-dark-text-muted text-xs mb-1">{label}</p>}
        <p className="text-dark-text font-bold">UGX {payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomPieLegend = ({ data }: { data: { name: string; value: number; color: string }[] }) => (
  <div className="grid grid-cols-2 gap-2 mt-4">
    {data.map((entry, idx) => (
      <div key={entry.name} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-alt dark:bg-dark-surface-alt">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-text-muted dark:text-dark-text-muted truncate">{entry.name}</p>
          <p className="text-sm font-bold text-text dark:text-dark-text">UGX {entry.value.toLocaleString()}</p>
        </div>
      </div>
    ))}
  </div>
)

export default function Statistics() {
  const [expenses, setExpenses] = useState<ApiExpense[]>([])
  const [loading, setLoading] = useState(true)

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getExpenses()
      if (res.success) setExpenses(res.data)
    } catch { /* silently ignore */ } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchExpenses() }, [fetchExpenses])

  const categoryStats = useMemo(() => {
    const totals: Record<string, number> = {}
    expenses.forEach((e) => {
      totals[e.category] = (totals[e.category] ?? 0) + parseFloat(e.amount)
    })
    return Object.entries(totals)
      .filter(([, amount]) => amount > 0)
      .map(([category, amount], idx) => ({
        name: category,
        value: amount,
        color: COLORS[idx % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
  }, [expenses])

  const monthlyStats = useMemo(() => {
    const monthMap: Record<string, number> = {}
    expenses.forEach((e) => {
      const d = new Date(e.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      monthMap[key] = (monthMap[key] ?? 0) + parseFloat(e.amount)
    })
    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, amount]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        amount,
      }))
  }, [expenses])

  const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)
  const topCategory = categoryStats[0]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const summaryCards = [
    {
      label: 'Total Spent',
      value: `UGX ${totalSpent.toLocaleString()}`,
      sub: 'All time',
      gradient: 'from-amber-400 to-orange-500',
      glow: 'shadow-orange-500/20',
      bg: 'from-amber-50 to-orange-50 dark:from-orange-950/30 dark:to-amber-950/20',
    },
    {
      label: 'Transactions',
      value: expenses.length.toString(),
      sub: 'Total entries',
      gradient: 'from-violet-500 to-indigo-600',
      glow: 'shadow-indigo-500/20',
      bg: 'from-violet-50 to-indigo-50 dark:from-indigo-950/30 dark:to-violet-950/20',
    },
    {
      label: 'Average Expense',
      value: `UGX ${expenses.length > 0 ? Math.round(totalSpent / expenses.length).toLocaleString() : '0'}`,
      sub: 'Per transaction',
      gradient: 'from-emerald-400 to-teal-500',
      glow: 'shadow-emerald-500/20',
      bg: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20',
    },
    {
      label: 'Top Category',
      value: topCategory ? topCategory.name : '-',
      sub: topCategory ? `UGX ${topCategory.value.toLocaleString()}` : 'No data',
      gradient: 'from-rose-400 to-pink-500',
      glow: 'shadow-rose-500/20',
      bg: 'from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/20',
    },
  ]

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
  }

  const hasData = expenses.length > 0

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800/50">
            <Activity className="w-3 h-3" />
            Analytics
          </span>
        </div>
        <h1 className="text-2xl font-black text-text dark:text-dark-text tracking-tight">Statistics</h1>
        <p className="text-text-muted dark:text-dark-text-muted mt-1">Visualize your spending patterns</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ translateY: -4 }}
            className={`relative bg-gradient-to-br ${card.bg} rounded-2xl p-5 border border-white/60 dark:border-white/5 shadow-lg ${card.glow} overflow-hidden`}
          >
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.gradient}`} />
            <p className="text-xs font-bold text-text-muted dark:text-dark-text-muted uppercase tracking-widest">{card.label}</p>
            <p className="text-xl font-black text-text dark:text-dark-text mt-1 tabular-nums">{card.value}</p>
            <p className="text-xs text-text-muted dark:text-dark-text-muted mt-1">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface dark:bg-dark-surface rounded-2xl border border-border dark:border-dark-border p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <PieIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-text dark:text-dark-text">Category Breakdown</h2>
              <p className="text-xs text-text-muted dark:text-dark-text-muted">Spending by category</p>
            </div>
          </div>

          {hasData && categoryStats.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    dataKey="value"
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {categoryStats.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <CustomPieLegend data={categoryStats} />
            </>
          ) : (
            <div className="h-60 flex flex-col items-center justify-center text-text-muted dark:text-dark-text-muted">
              <p className="font-medium">No data yet</p>
            </div>
          )}
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-surface dark:bg-dark-surface rounded-2xl border border-border dark:border-dark-border p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <BarChart2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-text dark:text-dark-text">Monthly Trend</h2>
              <p className="text-xs text-text-muted dark:text-dark-text-muted">Last 12 months</p>
            </div>
          </div>

          {monthlyStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={monthlyStats} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.07} vertical={false} />
                <XAxis dataKey="month" stroke="currentColor" opacity={0.5} style={{ fontSize: '11px' }} tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" opacity={0.5} style={{ fontSize: '11px' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)', radius: 8 }} />
                <Bar dataKey="amount" fill="url(#barGradient)" radius={[8, 8, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex flex-col items-center justify-center text-text-muted dark:text-dark-text-muted">
              <p className="font-medium">No data yet</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Line chart - spending over time */}
      {monthlyStats.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-surface dark:bg-dark-surface rounded-2xl border border-border dark:border-dark-border p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-text dark:text-dark-text">Spending Over Time</h2>
              <p className="text-xs text-text-muted dark:text-dark-text-muted">Cumulative view</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyStats} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.07} vertical={false} />
              <XAxis dataKey="month" stroke="currentColor" opacity={0.5} style={{ fontSize: '11px' }} tickLine={false} axisLine={false} />
              <YAxis stroke="currentColor" opacity={0.5} style={{ fontSize: '11px' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </motion.div>
  )
}
