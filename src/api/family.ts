import apiClient from './client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FamilyMember {
  id: number
  family: number
  full_name: string
  relationship: 'Father' | 'Mother' | 'Child' | 'Guardian' | 'Sibling' | 'Grandparent' | 'Other'
  avatar?: string | null
  created_at: string
}

export interface Family {
  id: number
  family_name: string
  owner_email: string
  member_count: number
  members: FamilyMember[]
  created_at: string
  updated_at: string
}

export interface FamilyResponse {
  success: boolean
  message?: string
  data: Family
}

export interface MemberResponse {
  success: boolean
  message?: string
  data: FamilyMember
}

export interface MembersListResponse {
  success: boolean
  data: FamilyMember[]
}

// ─── Family endpoints ─────────────────────────────────────────────────────────

export async function getFamily(): Promise<FamilyResponse> {
  const res = await apiClient.get<FamilyResponse>('/api/family/')
  return res.data
}

export async function createFamily(familyName: string): Promise<FamilyResponse> {
  const res = await apiClient.post<FamilyResponse>('/api/family/', { family_name: familyName })
  return res.data
}

export async function updateFamily(familyName: string): Promise<FamilyResponse> {
  const res = await apiClient.patch<FamilyResponse>('/api/family/', { family_name: familyName })
  return res.data
}

export async function deleteFamily(): Promise<{ success: boolean; message: string }> {
  const res = await apiClient.delete('/api/family/')
  return res.data
}

// ─── Member endpoints ─────────────────────────────────────────────────────────

export async function getMembers(): Promise<MembersListResponse> {
  const res = await apiClient.get<MembersListResponse>('/api/family/members/')
  return res.data
}

export async function addMember(
  data: Pick<FamilyMember, 'full_name' | 'relationship'> & { avatar?: string }
): Promise<MemberResponse> {
  const res = await apiClient.post<MemberResponse>('/api/family/members/', data)
  return res.data
}

export async function updateMember(
  id: number,
  data: Partial<Pick<FamilyMember, 'full_name' | 'relationship' | 'avatar'>>
): Promise<MemberResponse> {
  const res = await apiClient.patch<MemberResponse>(`/api/family/members/${id}/`, data)
  return res.data
}

export async function deleteMember(id: number): Promise<{ success: boolean; message: string }> {
  const res = await apiClient.delete(`/api/family/members/${id}/`)
  return res.data
}
