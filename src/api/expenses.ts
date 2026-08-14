import apiClient from './client'
import { CategoryType } from '../types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiExpense {
  id: number
  title: string
  amount: string       // Django returns Decimals as strings
  category: CategoryType
  date: string
  notes: string
  family_member_name: string
  created_at: string
  updated_at: string
}

interface ListResponse {
  success: boolean
  data: ApiExpense[]
}

interface DetailResponse {
  success: boolean
  message?: string
  data: ApiExpense
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export async function getExpenses(params?: {
  category?: string
  month?: string
}): Promise<ListResponse> {
  const res = await apiClient.get<ListResponse>('/api/expenses/', { params })
  return res.data
}

export async function createExpense(data: {
  title: string
  amount: number
  category: CategoryType
  date: string
  notes?: string
  family_member_name?: string
}): Promise<DetailResponse> {
  const res = await apiClient.post<DetailResponse>('/api/expenses/', data)
  return res.data
}

export async function updateExpense(
  id: number,
  data: Partial<{
    title: string
    amount: number
    category: CategoryType
    date: string
    notes: string
    family_member_name: string
  }>
): Promise<DetailResponse> {
  const res = await apiClient.patch<DetailResponse>(`/api/expenses/${id}/`, data)
  return res.data
}

export async function deleteExpense(id: number): Promise<{ success: boolean; message: string }> {
  const res = await apiClient.delete(`/api/expenses/${id}/`)
  return res.data
}
