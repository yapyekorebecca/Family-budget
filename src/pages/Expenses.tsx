import { useState, useMemo } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import { CategoryType } from '../types'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { Trash2, Edit2, Plus, Search, X, Receipt, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORIES: CategoryType[] = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Healthcare', 'Education', 'Other']

const categoryIcons: Record<CategoryType, string> = {
  Food: '🍔', Transport: '🚗', Entertainment: '🎬', Utilities: '💡',
  Shopping: '🛍️', Healthcare: '🏥', Education: '📚', Other: '📌',
}

const categoryColors: Record<CategoryType, string> = {
  Food: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/40',
  Transport: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40',
  Entertainment: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/40',
  Utilities: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/40',
  Shopping: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800/40',
  Healthcare: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800/40',
  Education: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/40',
  Other: 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/40',
}

export default function Expenses() {
  const { expenses, addExpense, deleteExpense, updateExpense } = useExpenses()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<CategoryType | ''>('')
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '' as CategoryType | '',
    date: new Date().toISOString().split('T')[0],
  })

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchesSearch = e.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === '' || e.category === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [expenses, searchTerm, filterCategory])

  const totalFiltered = useMemo(() => filteredExpenses.reduce((s, e) => s + e.amount, 0), [filteredExpenses])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description || !formData.amount || !formData.category) return

    if (editingId) {
      updateExpense(editingId, {
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category as CategoryType,
        date: formData.date,
      })
      setEditingId(null)
    } else {
      addExpense({
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category as CategoryType,
        date: formData.date,
      })
    }

    setFormData({ description: '', amount: '', category: '', date: new Date().toISOString().split('T')[0] })
    setShowForm(false)
  }

  const handleEdit = (id: string) => {
    const expense = expenses.find(e => e.id === id)
    if (expense) {
      setFormData({
        description: expense.description,
        amount: expense.amount.toString(),
        category: expense.category,
        date: expense.date,
      })
      setEditingId(id)
      setShowForm(true)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ description: '', amount: '', category: '', date: new Date().toISOString().split('T')[0] })
  }

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider border border-violet-200 dark:border-violet-800/50">
              <Receipt className="w-3 h-3" />
              {expenses.length} {expenses.length === 1 ? 'Entry' : 'Entries'}
            </span>
          </div>
          <h1 className="text-4xl font-black text-text dark:text-dark-text tracking-tight">Expenses</h1>
          <p className="text-text-muted dark:text-dark-text-muted mt-1">Track and manage your spending</p>
        </div>
        <motion.button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus className="w-5 h-5" strokeWidth={3} />
          New Expense
        </motion.button>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-surface dark:bg-dark-surface rounded-3xl p-8 max-w-md w-full pointer-events-auto shadow-2xl border border-border dark:border-dark-border relative overflow-hidden"
                initial={{ scale: 0.92, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 20 }}
                transition={{ type: 'spring', bounce: 0.25 }}
                onClick={e => e.stopPropagation()}
              >
                {/* Decorative corner gradient */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-bl-full pointer-events-none" />

                <div className="flex items-center justify-between mb-7">
                  <div>
                    <h2 className="text-2xl font-black text-text dark:text-dark-text">
                      {editingId ? 'Edit Expense' : 'New Expense'}
                    </h2>
                    <p className="text-sm text-text-muted dark:text-dark-text-muted mt-0.5">
                      {editingId ? 'Update the expense details' : 'Add a new spending entry'}
                    </p>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-surface-alt dark:hover:bg-dark-surface-alt rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-text-muted dark:text-dark-text-muted" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Description"
                    placeholder="e.g., Grocery shopping"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                  <Input
                    label="Amount ($)"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  />
                  <Select
                    label="Category"
                    value={formData.category}
                    options={CATEGORIES.map(cat => ({ value: cat, label: `${categoryIcons[cat]} ${cat}` }))}
                    onChange={e => setFormData({ ...formData, category: e.target.value as CategoryType })}
                  />
                  <Input
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />

                  <div className="flex gap-3 justify-end pt-3">
                    <Button variant="outline" type="button" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow"
                    >
                      {editingId ? 'Update' : 'Add'} Expense
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Filters row */}
      <div className="flex gap-3 flex-col md:flex-row items-stretch md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-dark-text-muted pointer-events-none" strokeWidth={2.5} />
          <input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-border dark:border-dark-border rounded-xl bg-surface dark:bg-dark-surface text-text dark:text-dark-text placeholder:text-text-muted dark:placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-primary-dark/40 transition-shadow text-sm"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-dark-text-muted pointer-events-none" />
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value as CategoryType | '')}
            className="pl-9 pr-4 py-3 border border-border dark:border-dark-border rounded-xl bg-surface dark:bg-dark-surface text-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm font-medium w-full md:w-48 appearance-none"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{categoryIcons[cat]} {cat}</option>
            ))}
          </select>
        </div>

        {/* Summary pill */}
        {filteredExpenses.length > 0 && (
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border text-sm">
            <span className="text-text-muted dark:text-dark-text-muted">{filteredExpenses.length} results</span>
            <span className="w-1 h-1 rounded-full bg-border dark:bg-dark-border" />
            <span className="font-bold text-text dark:text-dark-text">${totalFiltered.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Expenses List */}
      <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-border dark:border-dark-border shadow-sm overflow-hidden">
        {filteredExpenses.length > 0 ? (
          <div className="divide-y divide-border dark:divide-dark-border">
            <AnimatePresence>
              {filteredExpenses.map((expense, idx) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.25 }}
                  className="flex items-center gap-4 px-6 py-4 group hover:bg-surface-alt dark:hover:bg-dark-surface-alt transition-colors cursor-default"
                >
                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border ${categoryColors[expense.category]}`}>
                    {categoryIcons[expense.category]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text dark:text-dark-text truncate">{expense.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${categoryColors[expense.category]}`}>
                        {expense.category}
                      </span>
                      <span className="text-xs text-text-muted dark:text-dark-text-muted">
                        {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <p className="text-lg font-black text-text dark:text-dark-text tabular-nums mx-4">
                    ${expense.amount.toFixed(2)}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      onClick={() => handleEdit(expense.id)}
                      className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-indigo-500" strokeWidth={2} />
                    </motion.button>
                    <motion.button
                      onClick={() => deleteExpense(expense.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" strokeWidth={2} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-semibold text-text-muted dark:text-dark-text-muted">
              {searchTerm || filterCategory ? 'No matching expenses' : 'No expenses yet'}
            </p>
            <p className="text-sm text-text-muted dark:text-dark-text-muted mt-2">
              {searchTerm || filterCategory
                ? 'Try adjusting your search or filters'
                : 'Click "New Expense" to add your first entry'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
