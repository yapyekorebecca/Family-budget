import apiClient from './client'
import { CategoryType } from '../types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiBudget {
  id: number
  category: CategoryType
  amount: string       // Django Decimal → string
  month: string        // "YYYY-MM"
  created_at: string
  updated_at: string
}

interface ListResponse {
  success: boolean
  data: ApiBudget[]
}

interface DetailResponse {
  success: boolean
  message?: string
  data: ApiBudget
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export async function getBudgets(params?: { month?: string }): Promise<ListResponse> {
  const res = await apiClient.get<ListResponse>('/api/budgets/', { params })
  return res.data
}

export async function createBudget(data: {
  category: CategoryType
  amount: number
  month: string
}): Promise<DetailResponse> {
  const res = await apiClient.post<DetailResponse>('/api/budgets/', data)
  return res.data
}

export async function updateBudget(
  id: number,
  data: Partial<{ category: CategoryType; amount: number; month: string }>
): Promise<DetailResponse> {
  const res = await apiClient.patch<DetailResponse>(`/api/budgets/${id}/`, data)
  return res.data
}

export async function deleteBudget(id: number): Promise<{ success: boolean; message: string }> {
  const res = await apiClient.delete(`/api/budgets/${id}/`)
  return res.data
}
