import React, { useState, useEffect, useCallback } from 'react'
import { ApiGoal, getGoals, createGoal, updateGoal, deleteGoal } from '../api/goals'
import { extractApiErrors } from '../api/client'
import { Plus, Trash2, Edit2, Loader2 } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { motion } from 'framer-motion'

const emptyForm = {
  title: '',
  targetAmount: '',
  currentAmount: '',
  deadline: '',
  description: '',
}

export default function Savings() {
  const [goals, setGoals] = useState<ApiGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [apiErrors, setApiErrors] = useState<string[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<ApiGoal | null>(null)
  const [formData, setFormData] = useState(emptyForm)

  // ── Load from backend ──────────────────────────────────────────────────────
  const fetchGoals = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getGoals()
      if (res.success) setGoals(res.data)
    } catch (err) {
      setApiErrors(extractApiErrors(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchGoals() }, [fetchGoals])

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setApiErrors([])
    try {
      if (editingGoal) {
        const res = await updateGoal(editingGoal.id, {
          title: formData.title,
          target_amount: Number(formData.targetAmount),
          current_amount: Number(formData.currentAmount),
          deadline: formData.deadline || undefined,
          description: formData.description,
        })
        setGoals((prev) => prev.map((g) => (g.id === editingGoal.id ? res.data : g)))
      } else {
        const res = await createGoal({
          title: formData.title,
          target_amount: Number(formData.targetAmount),
          current_amount: Number(formData.currentAmount),
          deadline: formData.deadline || undefined,
          description: formData.description,
        })
        setGoals((prev) => [res.data, ...prev])
      }
      setIsModalOpen(false)
      setEditingGoal(null)
      setFormData(emptyForm)
    } catch (err) {
      setApiErrors(extractApiErrors(err))
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (goal: ApiGoal) => {
    setEditingGoal(goal)
    setFormData({
      title: goal.title,
      targetAmount: goal.target_amount,
      currentAmount: goal.current_amount,
      deadline: goal.deadline ?? '',
      description: goal.description,
    })
    setApiErrors([])
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteGoal(id)
      setGoals((prev) => prev.filter((g) => g.id !== id))
    } catch (err) {
      setApiErrors(extractApiErrors(err))
    }
  }

  const getProgress = (current: string, target: string) => {
    const t = parseFloat(target)
    return t === 0 ? 0 : Math.min((parseFloat(current) / t) * 100, 100)
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
          <h1 className="text-2xl font-bold">Savings Goals</h1>
          <p className="text-text-muted mt-1">Track your savings goals and progress</p>
        </div>
        <Button onClick={() => { setApiErrors([]); setEditingGoal(null); setFormData(emptyForm); setIsModalOpen(true) }} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Goal
        </Button>
      </div>

      {apiErrors.length > 0 && (
        <div className="p-3 rounded-xl bg-danger/10 text-danger text-sm space-y-1">
          {apiErrors.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-text-muted text-lg">No savings goals yet. Start saving!</div>
          </div>
        ) : (
          goals.map((goal, idx) => {
            const progress = getProgress(goal.current_amount, goal.target_amount)
            const target = parseFloat(goal.target_amount)
            const current = parseFloat(goal.current_amount)
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-text-muted text-sm mt-1">{goal.description}</p>
                      )}
                      {goal.deadline && (
                        <p className="text-text-muted text-xs mt-1">
                          Due: {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(goal)} className="text-text-muted hover:text-primary transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(goal.id)} className="text-text-muted hover:text-danger transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">UGX {current.toLocaleString()}</span>
                      <span className="text-text-muted">UGX {target.toLocaleString()}</span>
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
                    <span className="font-semibold">UGX {(target - current).toLocaleString()}</span>
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
              {editingGoal ? 'Edit Savings Goal' : 'Add Savings Goal'}
            </h2>

            {apiErrors.length > 0 && (
              <div className="mb-4 p-3 rounded-xl bg-danger/10 text-danger text-sm space-y-1">
                {apiErrors.map((e, i) => <div key={i}>{e}</div>)}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Goal Title" value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Vacation Fund" required />
              <Input label="Target Amount" type="number" value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                placeholder="1000000" required />
              <Input label="Current Savings" type="number" value={formData.currentAmount}
                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                placeholder="0" required />
              <Input label="Deadline (optional)" type="date" value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />
              <Input label="Description (optional)" value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A note about this goal..." />
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1"
                  onClick={() => { setIsModalOpen(false); setEditingGoal(null); setApiErrors([]) }}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving
                    ? <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    : editingGoal ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
