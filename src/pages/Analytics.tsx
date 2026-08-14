import { useState, useEffect, useMemo, useCallback } from 'react'
import { getExpenses, ApiExpense } from '../api/expenses'
import { extractApiErrors } from '../api/client'
import Card from '../components/ui/Card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { CategoryType } from '../types'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const CATEGORIES: CategoryType[] = ['Food', 'Transport', 'Rent', 'Utilities', 'School', 'Shopping', 'Health', 'Entertainment', 'Other']
const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16', '#64748b']

export default function Analytics() {
  const [expenses, setExpenses] = useState<ApiExpense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getExpenses()
      if (res.success) setExpenses(res.data)
    } catch (err) {
      setError(extractApiErrors(err)[0] ?? 'Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchExpenses() }, [fetchExpenses])

  const totalAmount = useMemo(
    () => expenses.reduce((s, e) => s + parseFloat(e.amount), 0),
    [expenses]
  )

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    expenses.forEach((e) => {
      totals[e.category] = (totals[e.category] ?? 0) + parseFloat(e.amount)
    })
    return totals
  }, [expenses])

  const pieData = CATEGORIES
    .map((cat, idx) => ({ name: cat, value: categoryTotals[cat] ?? 0, color: COLORS[idx] }))
    .filter((i) => i.value > 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-danger">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-text-muted mt-1">Detailed financial insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Spending by Category</h2>
            <div className="h-80">
              {pieData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-text-muted text-sm">
                  No expense data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`UGX ${(v as number).toLocaleString()}`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Category Breakdown</h2>
            <div className="space-y-4">
              {CATEGORIES.map((cat, idx) => {
                const amount = categoryTotals[cat] ?? 0
                if (amount === 0) return null
                const pct = totalAmount > 0 ? (amount / totalAmount) * 100 : 0
                return (
                  <div key={cat} className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                    <div className="flex-1">
                      <div className="font-medium">{cat}</div>
                      <div className="w-full h-2 bg-border rounded-full mt-1">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: COLORS[idx] }} />
                      </div>
                    </div>
                    <div className="font-bold">UGX {amount.toLocaleString()}</div>
                    <div className="text-text-muted text-sm">{pct.toFixed(1)}%</div>
                  </div>
                )
              })}
              {pieData.length === 0 && (
                <div className="text-text-muted text-sm text-center py-8">No expense data yet</div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
