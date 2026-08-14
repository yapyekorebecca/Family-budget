import React, { useState } from 'react'
import { useFamily } from '../context/FamilyContext'
import { FamilyMember } from '../api/family'
import { Trash2, UserPlus, Home, Loader2 } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { motion } from 'framer-motion'

const RELATIONSHIPS: FamilyMember['relationship'][] = [
  'Father', 'Mother', 'Child', 'Guardian', 'Sibling', 'Grandparent', 'Other',
]

// ─── Create-family screen shown when user has no family yet ───────────────────

function CreateFamilyScreen() {
  const { initFamily, saving, errors } = useFamily()
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) await initFamily(name.trim())
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">Create Your Family</h2>
          <p className="text-text-muted text-sm mb-6">
            Give your household a name. All your budgets, expenses and savings will belong to this family.
          </p>

          {errors.length > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-danger/10 text-danger text-sm text-left space-y-1">
              {errors.map((e, i) => <div key={i}>{e}</div>)}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Family name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. The Mukasa Family"
              required
            />
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Create Family'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Family() {
  const { family, members, loading, saving, errors, addFamilyMember, removeFamilyMember, clearErrors } = useFamily()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    relationship: 'Other' as FamilyMember['relationship'],
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!family) {
    return <CreateFamilyScreen />
  }

  const handleOpenModal = () => {
    clearErrors()
    setFormData({ full_name: '', relationship: 'Other' })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await addFamilyMember(formData)
    if (ok) {
      setIsModalOpen(false)
      setFormData({ full_name: '', relationship: 'Other' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{family.family_name}</h1>
          <p className="text-text-muted mt-1">
            {family.member_count} member{family.member_count !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleOpenModal} className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      {/* Members grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-text-muted text-lg">No family members yet. Add someone!</div>
          </div>
        ) : (
          members.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.07 }}
            >
              <Card className="p-6 text-center">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.full_name}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary text-2xl font-bold">
                      {member.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-bold mb-1">{member.full_name}</h3>
                <span className="inline-block px-3 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  {member.relationship}
                </span>
                <button
                  onClick={() => removeFamilyMember(member.id)}
                  disabled={saving}
                  className="text-text-muted hover:text-danger transition-colors flex items-center gap-2 mx-auto text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Add member modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-lg font-bold mb-6">Add Family Member</h2>

            {errors.length > 0 && (
              <div className="mb-4 p-3 rounded-xl bg-danger/10 text-danger text-sm space-y-1">
                {errors.map((e, i) => <div key={i}>{e}</div>)}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter full name"
                required
              />
              <Select
                label="Relationship"
                value={formData.relationship}
                onChange={(e) =>
                  setFormData({ ...formData, relationship: e.target.value as FamilyMember['relationship'] })
                }
                options={RELATIONSHIPS.map((r) => ({ label: r, value: r }))}
                required
              />
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Add'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
