import { useState, useMemo, useEffect, useCallback } from 'react'
import { CategoryType } from '../types'
import { ApiExpense, getExpenses, createExpense, updateExpense, deleteExpense } from '../api/expenses'
import { extractApiErrors } from '../api/client'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Card from '../components/ui/Card'
import { Trash2, Edit2, Plus, Search, X, Loader2 } from 'lucide-react'
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

const emptyForm = {
  title: '',
  amount: '',
  category: 'Food' as CategoryType,
  date: new Date().toISOString().split('T')[0],
  notes: '',
  family_member_name: '',
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<ApiExpense[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [apiErrors, setApiErrors] = useState<string[]>([])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<CategoryType | ''>('')
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [formData, setFormData] = useState(emptyForm)

  // ── Load from backend on mount ─────────────────────────────────────────────
  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getExpenses()
      if (res.success) setExpenses(res.data)
    } catch (err) {
      setApiErrors(extractApiErrors(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchExpenses() }, [fetchExpenses])

  // ── Derived / filtered list ────────────────────────────────────────────────
  const filteredExpenses = useMemo(() => {
    let filtered = expenses.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === '' || e.category === filterCategory
      return matchesSearch && matchesCategory
    })
    return filtered.sort((a, b) =>
      sortBy === 'date'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : parseFloat(b.amount) - parseFloat(a.amount)
    )
  }, [expenses, searchTerm, filterCategory, sortBy])

  const totalFiltered = useMemo(
    () => filteredExpenses.reduce((s, e) => s + parseFloat(e.amount), 0),
    [filteredExpenses]
  )

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.amount) return
    setSaving(true)
    setApiErrors([])
    try {
      if (editingId !== null) {
        const res = await updateExpense(editingId, {
          title: formData.title,
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date,
          notes: formData.notes,
          family_member_name: formData.family_member_name,
        })
        setExpenses((prev) => prev.map((ex) => (ex.id === editingId ? res.data : ex)))
        setEditingId(null)
      } else {
        const res = await createExpense({
          title: formData.title,
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date,
          notes: formData.notes,
          family_member_name: formData.family_member_name,
        })
        setExpenses((prev) => [res.data, ...prev])
      }
      setFormData(emptyForm)
      setShowForm(false)
    } catch (err) {
      setApiErrors(extractApiErrors(err))
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (expense: ApiExpense) => {
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      notes: expense.notes,
      family_member_name: expense.family_member_name,
    })
    setEditingId(expense.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteExpense(id)
      setExpenses((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      setApiErrors(extractApiErrors(err))
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData(emptyForm)
    setApiErrors([])
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-text-muted mt-1">Track and manage your spending</p>
        </div>
        <Button onClick={() => { setApiErrors([]); setShowForm(true) }} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Expense
        </Button>
      </div>

      {/* Summary cards */}
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
            UGX {filteredExpenses.length > 0
              ? Math.round(totalFiltered / filteredExpenses.length).toLocaleString()
              : '0'}
          </div>
        </Card>
      </div>

      {/* Filters */}
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
          {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
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

      {/* Add / Edit modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={handleCancel} />
            <motion.div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <Card className="p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">
                    {editingId !== null ? 'Edit Expense' : 'New Expense'}
                  </h2>
                  <button onClick={handleCancel} className="text-text-muted hover:text-text">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {apiErrors.length > 0 && (
                  <div className="mb-4 p-3 rounded-xl bg-danger/10 text-danger text-sm space-y-1">
                    {apiErrors.map((e, i) => <div key={i}>{e}</div>)}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input label="Title" value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Grocery shopping" required />
                  <Input label="Amount (UGX)" type="number" value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0" required />
                  <Select label="Category" value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                    options={CATEGORIES.map((cat) => ({ label: cat, value: cat }))} />
                  <Input label="Date" type="date" value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                  <Input label="Family Member (optional)" value={formData.family_member_name}
                    onChange={(e) => setFormData({ ...formData, family_member_name: e.target.value })}
                    placeholder="e.g. John" />
                  <Input label="Notes (optional)" value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional notes..." />
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={saving}>
                      {saving
                        ? <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        : editingId !== null ? 'Update' : 'Add'}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* List */}
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
              transition={{ delay: idx * 0.04 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${categoryColors[expense.category]} text-xl font-bold`}>
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
                      {expense.family_member_name && (
                        <span className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary font-medium">
                          {expense.family_member_name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-text text-base">
                      UGX {parseFloat(expense.amount).toLocaleString()}
                    </div>
                    <div className="flex gap-2 mt-2 justify-end">
                      <button onClick={() => handleEdit(expense)} className="text-text-muted hover:text-primary transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(expense.id)} className="text-text-muted hover:text-danger transition-colors">
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
