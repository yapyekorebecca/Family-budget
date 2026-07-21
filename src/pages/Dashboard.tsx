import { useExpenses } from '../context/ExpenseContext'
import { TrendingDown, TrendingUp, DollarSign, Calendar, ArrowRight, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMemo } from 'react'

const categoryIcons: Record<string, string> = {
  Food: '🍔', Transport: '🚗', Entertainment: '🎬', Utilities: '💡',
  Shopping: '🛍️', Healthcare: '🏥', Education: '📚', Other: '📌',
}

const categoryColors: Record<string, string> = {
  Food: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  Transport: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  Entertainment: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  Utilities: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  Shopping: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
  Healthcare: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  Education: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  Other: 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400',
}

export default function Dashboard() {
  const { expenses } = useExpenses()

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0)
    const thisMonth = new Date().getMonth()
    const thisYear = new Date().getFullYear()
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear

    const monthExpenses = expenses.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear
    })
    const lastMonthExpenses = expenses.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear
    })

    const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
    const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0)
    const avgPerExpense = expenses.length > 0 ? total / expenses.length : 0
    const trend = lastMonthTotal > 0 ? ((monthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0

    return { total, monthTotal, avgPerExpense, count: expenses.length, trend }
  }, [expenses])

  const recentExpenses = expenses.slice(0, 6)

  const statCards = [
    {
      label: 'This Month',
      value: `$${stats.monthTotal.toFixed(2)}`,
      subtitle: stats.trend !== 0
        ? `${stats.trend > 0 ? '+' : ''}${stats.trend.toFixed(1)}% vs last month`
        : 'No comparison data',
      icon: DollarSign,
      gradient: 'from-amber-400 via-orange-400 to-orange-500',
      glow: 'shadow-orange-500/25',
      bg: 'from-amber-50 to-orange-50 dark:from-orange-950/30 dark:to-amber-950/20',
      iconBg: 'from-amber-400 to-orange-500',
      trendUp: stats.trend < 0,
    },
    {
      label: 'Total Spent',
      value: `$${stats.total.toFixed(2)}`,
      subtitle: 'All time',
      icon: TrendingUp,
      gradient: 'from-violet-500 via-indigo-500 to-indigo-600',
      glow: 'shadow-indigo-500/25',
      bg: 'from-violet-50 to-indigo-50 dark:from-indigo-950/30 dark:to-violet-950/20',
      iconBg: 'from-violet-500 to-indigo-600',
    },
    {
      label: 'Avg. Expense',
      value: `$${stats.avgPerExpense.toFixed(2)}`,
      subtitle: 'Per transaction',
      icon: TrendingDown,
      gradient: 'from-emerald-400 via-teal-400 to-green-500',
      glow: 'shadow-emerald-500/25',
      bg: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20',
      iconBg: 'from-emerald-400 to-teal-500',
    },
    {
      label: 'Transactions',
      value: stats.count.toString(),
      subtitle: 'Total entries',
      icon: Calendar,
      gradient: 'from-rose-400 via-pink-500 to-rose-500',
      glow: 'shadow-rose-500/25',
      bg: 'from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/20',
      iconBg: 'from-rose-400 to-rose-500',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider border border-orange-200 dark:border-orange-800/50">
              <Zap className="w-3 h-3" />
              Live Overview
            </span>
          </div>
          <h1 className="text-4xl font-black text-text dark:text-dark-text tracking-tight">
            Welcome back! 👋
          </h1>
          <p className="text-text-muted dark:text-dark-text-muted mt-1 text-base">
            Here's what's happening with your family budget.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={idx}
              whileHover={{ translateY: -6, scale: 1.01 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`relative bg-gradient-to-br ${stat.bg} rounded-2xl p-6 border border-white/60 dark:border-white/5 shadow-xl ${stat.glow} overflow-hidden group cursor-default`}
            >
              {/* Background decoration */}
              <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.iconBg} opacity-10 group-hover:opacity-20 transition-opacity blur-xl`} />

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-bold text-text-muted dark:text-dark-text-muted uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black text-text dark:text-dark-text mt-2 tabular-nums">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.iconBg} shadow-md flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5">
                <span className="text-xs text-text-muted dark:text-dark-text-muted">{stat.subtitle}</span>
              </div>

              {/* Bottom gradient line */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.gradient} opacity-60`} />
            </motion.div>
          )
        })}
      </motion.div>

      {/* Recent Expenses */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-orange-400 to-orange-600" />
            <h2 className="text-xl font-black text-text dark:text-dark-text">Recent Transactions</h2>
          </div>
          {recentExpenses.length > 0 && (
            <a
              href="/expenses"
              className="flex items-center gap-1.5 text-sm font-semibold text-primary dark:text-primary-light hover:gap-2.5 transition-all"
            >
              View All <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-border dark:border-dark-border shadow-sm overflow-hidden">
          {recentExpenses.length > 0 ? (
            <div className="divide-y divide-border dark:divide-dark-border">
              {recentExpenses.map((expense, idx) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.06 }}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  className="flex items-center gap-4 px-6 py-4 cursor-default group transition-colors"
                >
                  {/* Category icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${categoryColors[expense.category] || categoryColors.Other}`}>
                    {categoryIcons[expense.category] || '📌'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text dark:text-dark-text truncate">{expense.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-text-muted dark:text-dark-text-muted">{expense.category}</span>
                      <span className="w-1 h-1 rounded-full bg-border dark:bg-dark-border" />
                      <span className="text-xs text-text-muted dark:text-dark-text-muted">
                        {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-base font-black text-text dark:text-dark-text tabular-nums">
                      ${expense.amount.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="text-6xl mb-4">💸</div>
              <p className="font-semibold text-text-muted dark:text-dark-text-muted text-lg">No expenses yet</p>
              <p className="text-sm text-text-muted dark:text-dark-text-muted mt-2 max-w-xs mx-auto">
                Start adding your expenses to see them here and track your spending.
              </p>
              <a
                href="/expenses"
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-shadow"
              >
                Add Your First Expense <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
