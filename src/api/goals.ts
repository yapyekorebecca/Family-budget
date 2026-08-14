import apiClient from './client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiGoal {
  id: number
  title: string
  target_amount: string     // Django Decimal → string
  current_amount: string
  deadline?: string | null
  description: string
  progress_percent: number
  created_at: string
  updated_at: string
}

interface ListResponse {
  success: boolean
  data: ApiGoal[]
}

interface DetailResponse {
  success: boolean
  message?: string
  data: ApiGoal
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export async function getGoals(): Promise<ListResponse> {
  const res = await apiClient.get<ListResponse>('/api/goals/')
  return res.data
}

export async function createGoal(data: {
  title: string
  target_amount: number
  current_amount: number
  deadline?: string
  description?: string
}): Promise<DetailResponse> {
  const res = await apiClient.post<DetailResponse>('/api/goals/', data)
  return res.data
}

export async function updateGoal(
  id: number,
  data: Partial<{
    title: string
    target_amount: number
    current_amount: number
    deadline: string
    description: string
  }>
): Promise<DetailResponse> {
  const res = await apiClient.patch<DetailResponse>(`/api/goals/${id}/`, data)
  return res.data
}

export async function deleteGoal(id: number): Promise<{ success: boolean; message: string }> {
  const res = await apiClient.delete(`/api/goals/${id}/`)
  return res.data
}
