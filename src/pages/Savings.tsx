import React, { useState } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { motion } from 'framer-motion'

export default function Savings() {
  const { savingsGoals, addSavingsGoal, deleteSavingsGoal, updateSavingsGoal } = useExpenses()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<{ id: string; title: string; target: number; current: number; description?: string } | null>(null)
  const [formData, setFormData] = useState({ title: '', target: '', current: '', description: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingGoal) {
      updateSavingsGoal(editingGoal.id, {
        title: formData.title,
        target: Number(formData.target),
        current: Number(formData.current),
        description: formData.description,
      })
    } else {
      addSavingsGoal({
        title: formData.title,
        target: Number(formData.target),
        current: Number(formData.current),
        description: formData.description,
      })
    }
    setIsModalOpen(false)
    setEditingGoal(null)
    setFormData({ title: '', target: '', current: '', description: '' })
  }

  const handleEdit = (goal: any) => {
    setEditingGoal(goal)
    setFormData({
      title: goal.title,
      target: goal.target.toString(),
      current: goal.current.toString(),
      description: goal.description || '',
    })
    setIsModalOpen(true)
  }

  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Savings Goals</h1>
          <p className="text-text-muted mt-1">Track your savings goals and progress</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savingsGoals.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-text-muted text-lg">No savings goals yet. Start saving!</div>
          </div>
        ) : (
          savingsGoals.map((goal, idx) => {
            const progress = getProgress(goal.current, goal.target)
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-text-muted text-sm mt-1">{goal.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="text-text-muted hover:text-primary transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSavingsGoal(goal.id)}
                        className="text-text-muted hover:text-danger transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">UGX {goal.current.toLocaleString()}</span>
                      <span className="text-text-muted">UGX {goal.target.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-right text-sm font-medium text-primary mt-1">
                      {progress.toFixed(1)}%
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Remaining:</span>
                    <span className="font-semibold">UGX {(goal.target - goal.current).toLocaleString()}</span>
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
              {editingGoal ? 'Edit Savings Goal' : 'Add Savings Goal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Goal Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Vacation Fund"
                required
              />
              <Input
                label="Target Amount"
                type="number"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                placeholder="1000000"
                required
              />
              <Input
                label="Current Savings"
                type="number"
                value={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                placeholder="0"
                required
              />
              <Input
                label="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A note about this goal..."
              />
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingGoal(null)
                    setFormData({ title: '', target: '', current: '', description: '' })
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingGoal ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}