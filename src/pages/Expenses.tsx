import { useState, useMemo } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import { CategoryType } from '../types'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Card from '../components/ui/Card'
import { Trash2, Edit2, Plus, Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORIES: CategoryType[] = ['Food', 'Transport', 'Rent', 'Utilities', 'School', 'Shopping', 'Health', 'Entertainment', 'Other']

const categoryColors: Record<CategoryType, string> = {
  Food: 'bg-orange-100 text-orange-600 border-orange-200',
  Transport: 'bg-blue-100 text-blue-600 border-blue-200',
  Rent: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  Utilities: 'bg-yellow-100 text-yellow-600 border-yellow-200',
  School: 'bg-purple-100 text-purple-600 border-purple-200',
  Shopping: 'bg-pink-100 text-pink-600 border-pink-200',
  Health: 'bg-red-100 text-red-600 border-red-200',
  Entertainment: 'bg-violet-100 text-violet-600 border-violet-200',
  Other: 'bg-slate-100 text-slate-600 border-slate-200',
}

export default function Expenses() {
  const { expenses, addExpense, deleteExpense, updateExpense, familyMembers } = useExpenses()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<CategoryType | ''>('')
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food' as CategoryType,
    date: new Date().toISOString().split('T')[0],
    notes: '',
    familyMember: '',
  })

  const filteredExpenses = useMemo(() => {
    let filtered = expenses.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || (e.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      const matchesCategory = filterCategory === '' || e.category === filterCategory
      return matchesSearch && matchesCategory
    })

    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else {
        return b.amount - a.amount
      }
    })
  }, [expenses, searchTerm, filterCategory, sortBy])

  const totalFiltered = useMemo(() => filteredExpenses.reduce((s, e) => s + e.amount, 0), [filteredExpenses])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.amount) return

    if (editingId) {
      updateExpense(editingId, {
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        notes: formData.notes,
        familyMember: formData.familyMember,
      })
      setEditingId(null)
    } else {
      addExpense({
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        notes: formData.notes,
        familyMember: formData.familyMember,
      })
    }

    setFormData({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], notes: '', familyMember: '' })
    setShowForm(false)
  }

  const handleEdit = (id: string) => {
    const expense = expenses.find(e => e.id === id)
    if (expense) {
      setFormData({
        title: expense.title,
        amount: expense.amount.toString(),
        category: expense.category,
        date: expense.date,
        notes: expense.notes || '',
        familyMember: expense.familyMember || '',
      })
      setEditingId(id)
      setShowForm(true)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], notes: '', familyMember: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-text-muted mt-1">Track and manage your spending</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-text-muted text-sm">Total Expenses</div>
          <div className="text-xl font-bold text-text">UGX {totalFiltered.toLocaleString()}</div>
        </Card>
        <Card className="p-4">
          <div className="text-text-muted text-sm">Number of Transactions</div>
          <div className="text-xl font-bold text-text">{filteredExpenses.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-text-muted text-sm">Average per Transaction</div>
          <div className="text-xl font-bold text-text">
            UGX {filteredExpenses.length > 0 ? Math.round(totalFiltered / filteredExpenses.length).toLocaleString() : '0'}
          </div>
        </Card>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as CategoryType | '')}
          className="px-4 py-3 rounded-xl border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
          className="px-4 py-3 rounded-xl border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>
      </div>

      <AnimatePresence>
        {showForm && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={handleCancel} />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
                <Card className="p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">
                    {editingId ? 'Edit Expense' : 'New Expense'}
                  </h2>
                  <button onClick={handleCancel} className="text-text-muted hover:text-text">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Grocery shopping"
                    required
                  />
                  <Input
                    label="Amount (UGX)"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0"
                    required
                  />
                  <Select
                    label="Category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                    options={CATEGORIES.map(cat => ({ label: cat, value: cat }))}
                  />
                  <Input
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                  {familyMembers.length > 0 && (
                    <Select
                      label="Family Member (optional)"
                      value={formData.familyMember}
                      onChange={(e) => setFormData({ ...formData, familyMember: e.target.value })}
                      options={[
                        { label: 'Not specified', value: '' },
                        ...familyMembers.map(member => ({ label: member.name, value: member.id }))
                      ]}
                    />
                  )}
                  <Input
                    label="Notes (optional)"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional notes..."
                  />

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      {editingId ? 'Update' : 'Add'}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-text-muted text-lg">
              {searchTerm || filterCategory ? 'No matching expenses' : 'No expenses yet'}
            </div>
          </div>
        ) : (
          filteredExpenses.map((expense, idx) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${categoryColors[expense.category]} text-xl`}>
                    {expense.category.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-text">{expense.title}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColors[expense.category]}`}>
                        {expense.category}
                      </span>
                      <span className="text-text-muted text-sm">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                      {expense.familyMember && familyMembers.find(m => m.id === expense.familyMember) && (
                        <span className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary font-medium">
                          {familyMembers.find(m => m.id === expense.familyMember)?.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-text text-base">UGX {expense.amount.toLocaleString()}</div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(expense.id)} className="text-text-muted hover:text-primary transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteExpense(expense.id)} className="text-text-muted hover:text-danger transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}