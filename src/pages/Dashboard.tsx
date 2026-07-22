import { Calendar, Download, ChevronDown, CheckCircle2, Circle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { motion } from 'framer-motion'

const incomeData = [
  { name: 'Salary', value: 85000, color: '#38bdf8' },
  { name: 'Selling', value: 35000, color: '#4ade80' },
  { name: 'Donation', value: 15142, color: '#14b8a6' },
]

const spentData = [
  { name: 'Utilities', value: 19.5, color: '#ef4444' },
  { name: 'Others', value: 8.9, color: '#22c55e' },
  { name: 'Groceries', value: 28.9, color: '#fbbf24' },
  { name: 'Others 2', value: 8.0, color: '#14b8a6' },
  { name: 'Entertainment', value: 5.0, color: '#a855f7' },
  { name: 'Rent', value: 29.5, color: '#d946ef' },
]

const barData = [
  { name: 'Mon', income: 130, spent: 120 },
  { name: 'Tue', income: 110, spent: 100 },
  { name: 'Wed', income: 130, spent: 110 },
  { name: 'Thu', income: 117, spent: 100 },
  { name: 'Fri', income: 140, spent: 120 },
  { name: 'Sat', income: 50, spent: 40 },
  { name: 'Sun', income: 32, spent: 30 },
]

const goals = [
  { title: 'New Car Purchase', description: 'Save $15,000 for a down payment on a new car within three years.', completed: true },
  { title: 'Pay Off Credit Card Debt', description: 'Eliminate $5,000 in credit card debt within the next six months.', completed: false },
  { title: 'Vacation Fund', description: 'Save $2,000 for a family vacation next summer.', completed: false },
  { title: 'Monthly Savings', description: 'Contribute $500 per month to a high-yield savings account.', completed: false },
]

export default function Dashboard() {
  const totalIncome = incomeData.reduce((sum, item) => sum + item.value, 0)

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
        {/* Total Income */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-surface rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Total Income</h3>
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                All accounts <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div className="h-52 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {incomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold">${totalIncome.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              {incomeData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-text-muted">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Total Spent */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="bg-surface rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Total Spent</h3>
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                All accounts <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-6">$30 671</div>
            <div className="space-y-3">
              {spentData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold w-12" style={{ color: item.color }}>{item.value}%</span>
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

        {/* Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="bg-surface rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Cards</h3>
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                All cards <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div className="space-y-3">
              {/* Card 1 */}
              <div className="bg-gradient-to-br from-teal-400 to-teal-200 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-80">Balance</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-white/50" />
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-4">$2301</div>
                <div className="flex items-center justify-between">
                  <button className="text-xs bg-white/20 px-4 py-2 rounded-lg">See card details</button>
                  <div className="flex gap-0.5">
                    <div className="w-5 h-5 rounded-full bg-white/50" />
                    <div className="w-5 h-5 rounded-full bg-white/30 -ml-2" />
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-gradient-to-br from-orange-200 to-yellow-200 rounded-xl p-6 text-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-70">Balance</span>
                </div>
                <div className="text-3xl font-bold mb-4">$2301</div>
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
            <h3 className="text-sm font-medium mb-4">Compare Net Income and Spent</h3>
            <div className="flex items-center justify-start gap-8 mb-4">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-gradient-to-b from-teal-400 to-yellow-300" />
                <span className="text-text-muted">Net Income</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-gradient-to-b from-orange-300 to-red-400" />
                <span className="text-text-muted">Outcome</span>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <Tooltip />
                  <Bar dataKey="income" radius={[4, 4, 1, 1]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="url(#colorIncome)" />
                    ))}
                  </Bar>
                  <Bar dataKey="spent" radius={[4, 4, 1, 1]}>
                    {barData.map((entry, index) => (
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

        {/* Goals */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="bg-surface rounded-2xl p-6">
            <h3 className="text-sm font-medium mb-4">Goals</h3>
            <div className="space-y-4">
              {goals.map((goal, idx) => (
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
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
