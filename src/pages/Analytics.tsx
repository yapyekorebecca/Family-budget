import { useExpenses } from '../context/ExpenseContext'
import Card from '../components/ui/Card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { CategoryType } from '../types'
import { motion } from 'framer-motion'

const CATEGORIES: CategoryType[] = ['Food', 'Transport', 'Rent', 'Utilities', 'School', 'Shopping', 'Health', 'Entertainment', 'Other']
const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16', '#64748b']

export default function Analytics() {
  const { expenses, getTotalByCategory } = useExpenses()
  const categoryTotals = getTotalByCategory()

  const pieData = CATEGORIES.map((cat, idx) => ({
    name: cat,
    value: categoryTotals[cat] || 0,
    color: COLORS[idx],
  })).filter(item => item.value > 0)

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
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`UGX ${(value as number).toLocaleString()}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Category Breakdown</h2>
            <div className="space-y-4">
              {CATEGORIES.map((cat, idx) => {
                const amount = categoryTotals[cat] || 0
                if (amount === 0) return null
                return (
                  <div key={cat} className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                    <div className="flex-1">
                      <div className="font-medium">{cat}</div>
                      <div className="w-full h-2 bg-border rounded-full mt-1">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(amount / (expenses.reduce((s, e) => s + e.amount, 0) || 1)) * 100}%`, backgroundColor: COLORS[idx] }}
                        />
                      </div>
                    </div>
                    <div className="font-bold">UGX {amount.toLocaleString()}</div>
                    <div className="text-text-muted text-sm">
                      {((amount / (expenses.reduce((s, e) => s + e.amount, 0) || 1)) * 100).toFixed(1)}%
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}