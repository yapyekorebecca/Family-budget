import React, { useState, useEffect, useCallback } from 'react'
import { ApiBudget, getBudgets, createBudget, updateBudget, deleteBudget } from '../api/budgets'
import { getExpenses } from '../api/expenses'
import { extractApiErrors } from '../api/client'
import { Plus, Trash2, Edit2, Loader2 } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { motion } from 'framer-motion'
import { CategoryType } from '../types'

const CATEGORIES: CategoryType[] = ['Food', 'Transport', 'Rent', 'Utilities', 'School', 'Shopping', 'Health', 'Entertainment', 'Other']

const emptyForm = {
  category: 'Food' as CategoryType,
  amount: '',
  month: new Date().toISOString().slice(0, 7),
}

export default function Budgets() {
  const [budgets, setBudgets] = useState<ApiBudget[]>([])
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [apiErrors, setApiErrors] = useState<string[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<ApiBudget | null>(null)
  const [formData, setFormData] = useState(emptyForm)

  // ── Load budgets + actual spending from backend ────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [budgetRes, expenseRes] = await Promise.all([getBudgets(), getExpenses()])

      if (budgetRes.success) setBudgets(budgetRes.data)

      // Compute how much has been spent per category from real expense data
      if (expenseRes.success) {
        const totals: Record<string, number> = {}
        expenseRes.data.forEach((e) => {
          totals[e.category] = (totals[e.category] ?? 0) + parseFloat(e.amount)
        })
        setCategoryTotals(totals)
      }
    } catch (err) {
      setApiErrors(extractApiErrors(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setApiErrors([])
    try {
      if (editingBudget) {
        const res = await updateBudget(editingBudget.id, {
          category: formData.category,
          amount: Number(formData.amount),
          month: formData.month,
        })
        setBudgets((prev) => prev.map((b) => (b.id === editingBudget.id ? res.data : b)))
      } else {
        const res = await createBudget({
          category: formData.category,
          amount: Number(formData.amount),
          month: formData.month,
        })
        setBudgets((prev) => [res.data, ...prev])
      }
      setIsModalOpen(false)
      setEditingBudget(null)
      setFormData(emptyForm)
    } catch (err) {
      setApiErrors(extractApiErrors(err))
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (budget: ApiBudget) => {
    setEditingBudget(budget)
    setFormData({
      category: budget.category,
      amount: budget.amount,
      month: budget.month,
    })
    setApiErrors([])
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteBudget(id)
      setBudgets((prev) => prev.filter((b) => b.id !== id))
    } catch (err) {
      setApiErrors(extractApiErrors(err))
    }
  }

  const getProgress = (spent: number, budget: number) => {
    if (budget === 0) return 0
    return Math.min((spent / budget) * 100, 100)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
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
          <h1 className="text-2xl font-bold">Budgets</h1>
          <p className="text-text-muted mt-1">Set and track your category budgets</p>
        </div>
        <Button onClick={() => { setApiErrors([]); setEditingBudget(null); setFormData(emptyForm); setIsModalOpen(true) }} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Budget
        </Button>
      </div>

      {apiErrors.length > 0 && (
        <div className="p-3 rounded-xl bg-danger/10 text-danger text-sm space-y-1">
          {apiErrors.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-text-muted text-lg">No budgets yet. Start budgeting!</div>
          </div>
        ) : (
          budgets.map((budget, idx) => {
            const budgetAmount = parseFloat(budget.amount)
            const spent = categoryTotals[budget.category] ?? 0
            const progress = getProgress(spent, budgetAmount)
            const isOverBudget = spent > budgetAmount
            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{budget.category}</h3>
                      <p className="text-text-muted text-sm mt-1">{budget.month}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(budget)} className="text-text-muted hover:text-primary transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(budget.id)} className="text-text-muted hover:text-danger transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">UGX {spent.toLocaleString()}</span>
                      <span className={isOverBudget ? 'text-danger' : 'text-text-muted'}>
                        UGX {budgetAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-danger' : 'bg-primary'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className={`text-right text-sm font-medium mt-1 ${isOverBudget ? 'text-danger' : 'text-primary'}`}>
                      {progress.toFixed(1)}%
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Remaining:</span>
                    <span className={`font-semibold ${isOverBudget ? 'text-danger' : ''}`}>
                      UGX {(budgetAmount - spent).toLocaleString()}
                    </span>
                  </div>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-lg font-bold mb-6">
              {editingBudget ? 'Edit Budget' : 'Add Budget'}
            </h2>

            {apiErrors.length > 0 && (
              <div className="mb-4 p-3 rounded-xl bg-danger/10 text-danger text-sm space-y-1">
                {apiErrors.map((e, i) => <div key={i}>{e}</div>)}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Select label="Category" value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                options={CATEGORIES.map((cat) => ({ label: cat, value: cat }))} required />
              <Input label="Budget Amount" type="number" value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="50000" required />
              <Input label="Month" type="month" value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })} required />
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1"
                  onClick={() => { setIsModalOpen(false); setEditingBudget(null); setApiErrors([]) }}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving
                    ? <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    : editingBudget ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
