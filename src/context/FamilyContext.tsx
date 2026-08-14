import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import {
  getFamily,
  createFamily,
  updateFamily,
  deleteFamily,
  getMembers as _getMembers,
  addMember,
  updateMember,
  deleteMember,
  Family,
  FamilyMember,
} from '../api/family'
import { extractApiErrors } from '../api/client'
import { useAuth } from './AuthContext'

// ─── Context shape ────────────────────────────────────────────────────────────

interface FamilyContextType {
  // State
  family: Family | null
  members: FamilyMember[]
  loading: boolean
  saving: boolean
  errors: string[]

  // Family actions
  initFamily: (familyName: string) => Promise<boolean>
  renameFamily: (familyName: string) => Promise<boolean>
  removeFamily: () => Promise<boolean>

  // Member actions
  addFamilyMember: (data: Pick<FamilyMember, 'full_name' | 'relationship'> & { avatar?: string }) => Promise<boolean>
  editFamilyMember: (id: number, data: Partial<Pick<FamilyMember, 'full_name' | 'relationship' | 'avatar'>>) => Promise<boolean>
  removeFamilyMember: (id: number) => Promise<boolean>

  clearErrors: () => void
  refresh: () => Promise<void>
}

// ─── Create context ───────────────────────────────────────────────────────────

const FamilyContext = createContext<FamilyContextType | undefined>(undefined)

// ─── Provider ─────────────────────────────────────────────────────────────────

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()

  const [family, setFamily] = useState<Family | null>(null)
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  // ── Fetch family + members on mount (only when authenticated) ──────────────
  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await getFamily()
      if (res.success) {
        setFamily(res.data)
        setMembers(res.data.members)
      }
    } catch {
      // 404 just means no family created yet — that's fine
      setFamily(null)
      setMembers([])
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refresh()
  }, [refresh])

  // ── Helpers ────────────────────────────────────────────────────────────────

  const withSaving = async (fn: () => Promise<boolean>): Promise<boolean> => {
    setSaving(true)
    setErrors([])
    try {
      return await fn()
    } finally {
      setSaving(false)
    }
  }

  const handleError = (err: unknown): false => {
    setErrors(extractApiErrors(err))
    return false
  }

  // ── Family actions ─────────────────────────────────────────────────────────

  const initFamily = (familyName: string) =>
    withSaving(async () => {
      try {
        const res = await createFamily(familyName)
        if (res.success) {
          setFamily(res.data)
          setMembers(res.data.members ?? [])
          return true
        }
        return false
      } catch (err) {
        return handleError(err)
      }
    })

  const renameFamily = (familyName: string) =>
    withSaving(async () => {
      try {
        const res = await updateFamily(familyName)
        if (res.success) {
          setFamily(res.data)
          return true
        }
        return false
      } catch (err) {
        return handleError(err)
      }
    })

  const removeFamily = () =>
    withSaving(async () => {
      try {
        await deleteFamily()
        setFamily(null)
        setMembers([])
        return true
      } catch (err) {
        return handleError(err)
      }
    })

  // ── Member actions ─────────────────────────────────────────────────────────

  const addFamilyMember = (data: Pick<FamilyMember, 'full_name' | 'relationship'> & { avatar?: string }) =>
    withSaving(async () => {
      try {
        const res = await addMember(data)
        if (res.success) {
          setMembers((prev) => [...prev, res.data])
          setFamily((prev) => prev ? { ...prev, member_count: prev.member_count + 1 } : prev)
          return true
        }
        return false
      } catch (err) {
        return handleError(err)
      }
    })

  const editFamilyMember = (id: number, data: Partial<Pick<FamilyMember, 'full_name' | 'relationship' | 'avatar'>>) =>
    withSaving(async () => {
      try {
        const res = await updateMember(id, data)
        if (res.success) {
          setMembers((prev) => prev.map((m) => (m.id === id ? res.data : m)))
          return true
        }
        return false
      } catch (err) {
        return handleError(err)
      }
    })

  const removeFamilyMember = (id: number) =>
    withSaving(async () => {
      try {
        await deleteMember(id)
        setMembers((prev) => prev.filter((m) => m.id !== id))
        setFamily((prev) => prev ? { ...prev, member_count: Math.max(0, prev.member_count - 1) } : prev)
        return true
      } catch (err) {
        return handleError(err)
      }
    })

  const clearErrors = useCallback(() => setErrors([]), [])

  // ── Value ──────────────────────────────────────────────────────────────────

  const value: FamilyContextType = {
    family,
    members,
    loading,
    saving,
    errors,
    initFamily,
    renameFamily,
    removeFamily,
    addFamilyMember,
    editFamilyMember,
    removeFamilyMember,
    clearErrors,
    refresh,
  }

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFamily(): FamilyContextType {
  const ctx = useContext(FamilyContext)
  if (!ctx) throw new Error('useFamily must be used within a FamilyProvider')
  return ctx
}
