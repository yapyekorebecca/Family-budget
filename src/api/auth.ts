import apiClient from './client'

// -------------------------
// TypeScript Types (matches our Django JSON response format)
// -------------------------
export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  full_name?: string
  is_active?: boolean
  is_staff?: boolean
  date_joined?: string
  last_login?: string | null
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    tokens: AuthTokens
  }
}

export interface ProfileResponse {
  success: boolean
  message: string
  data: User
}

// -------------------------
// Register a NEW user (Django: POST /api/auth/register/)
// -------------------------
export async function register(params: {
  email: string
  password: string
  password_confirm: string
  first_name?: string
  last_name?: string
}): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/api/auth/register/', params)
  return response.data
}

// -------------------------
// Login existing user (Django: POST /api/auth/login/)
// -------------------------
export async function login(params: {
  email: string
  password: string
}): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/api/auth/login/', params)
  return response.data
}

// -------------------------
// Get profile for CURRENTLY logged-in user (Django: GET /api/auth/profile/)
// This REQUIRES the Bearer token! Our interceptor attaches it.
// -------------------------
export async function getProfile(): Promise<ProfileResponse> {
  const response = await apiClient.get<ProfileResponse>('/api/auth/profile/')
  return response.data
}

// -------------------------
// Logout - blacklist the refresh token on Django side (Django: POST /api/auth/logout/)
// -------------------------
export async function logout(refreshToken: string): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post('/api/auth/logout/', {
    refresh: refreshToken,
  })
  return response.data
}

// -------------------------
// Refresh the access token when it expires (Django: POST /api/auth/refresh/)
// Not used in this task, but ready for Task 4 token auto-refresh
// -------------------------
export async function refreshAccessToken(refreshToken: string): Promise<{
  success: boolean
  message: string
  data: AuthTokens
}> {
  const response = await apiClient.post('/api/auth/refresh/', {
    refresh: refreshToken,
  })
  return response.data
}
