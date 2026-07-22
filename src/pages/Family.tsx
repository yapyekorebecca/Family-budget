import React, { useState } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import { Trash2, UserPlus } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { motion } from 'framer-motion'

export default function Family() {
  const { familyMembers, addFamilyMember, deleteFamilyMember } = useExpenses()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addFamilyMember({ name: formData.name })
    setIsModalOpen(false)
    setFormData({ name: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Family Members</h1>
          <p className="text-text-muted mt-1">Manage your family members</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {familyMembers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-text-muted text-lg">No family members yet. Add someone!</div>
          </div>
        ) : (
          familyMembers.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 text-primary text-2xl font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <button
                  onClick={() => deleteFamilyMember(member.id)}
                  className="mt-4 text-text-muted hover:text-danger transition-colors flex items-center gap-2 mx-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-6">Add Family Member</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
                required
              />
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsModalOpen(false)
                    setFormData({ name: '' })
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}