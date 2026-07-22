import React, { useState } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { motion } from 'framer-motion'
import { CategoryType } from '../types'

export default function Budgets() {
  const { budgets, addBudget, deleteBudget, updateBudget, getTotalByCategory } = useExpenses()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<{ id: string; category: CategoryType; amount: number; month: string } | null>(null)
  const [formData, setFormData] = useState({ category: 'Food' as CategoryType, amount: '', month: new Date().toISOString().slice(0, 7) })
  const categoryTotals = getTotalByCategory()

  const categories: CategoryType[] = ['Food', 'Transport', 'Rent', 'Utilities', 'School', 'Shopping', 'Health', 'Entertainment', 'Other']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingBudget) {
      updateBudget(editingBudget.id, {
        category: formData.category,
        amount: Number(formData.amount),
        month: formData.month,
      })
    } else {
      addBudget({
        category: formData.category,
        amount: Number(formData.amount),
        month: formData.month,
      })
    }
    setIsModalOpen(false)
    setEditingBudget(null)
    setFormData({ category: 'Food', amount: '', month: new Date().toISOString().slice(0, 7) })
  }

  const handleEdit = (budget: any) => {
    setEditingBudget(budget)
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      month: budget.month,
    })
    setIsModalOpen(true)
  }

  const getProgress = (spent: number, budget: number) => {
    if (budget === 0) return 0
    return Math.min((spent / budget) * 100, 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Budgets</h1>
          <p className="text-text-muted mt-1">Set and track your category budgets</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Budget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-text-muted text-lg">No budgets yet. Start budgeting!</div>
          </div>
        ) : (
          budgets.map((budget, idx) => {
            const spent = categoryTotals[budget.category] || 0
            const progress = getProgress(spent, budget.amount)
            const isOverBudget = spent > budget.amount
            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{budget.category}</h3>
                      <p className="text-text-muted text-sm mt-1">{budget.month}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="text-text-muted hover:text-primary transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteBudget(budget.id)}
                        className="text-text-muted hover:text-danger transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">UGX {spent.toLocaleString()}</span>
                      <span className={isOverBudget ? 'text-danger' : 'text-text-muted'}>UGX {budget.amount.toLocaleString()}</span>
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
                      UGX {(budget.amount - spent).toLocaleString()}
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
            <h2 className="text-2xl font-bold mb-6">
              {editingBudget ? 'Edit Budget' : 'Add Budget'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                options={categories.map((cat) => ({ label: cat, value: cat }))}
                required
              />
              <Input
                label="Budget Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="50000"
                required
              />
              <Input
                label="Month"
                type="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                required
              />
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingBudget(null)
                    setFormData({ category: 'Food', amount: '', month: new Date().toISOString().slice(0, 7) })
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingBudget ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}