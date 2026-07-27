import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

// -------------------------
// API Configuration
// -------------------------
// Vite env var: VITE_API_BASE_URL (create .env.local in frontend root to override)
// Defaults to Django's local dev server on port 8000
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

// -------------------------
// Create the AXIOS INSTANCE (reusable throughout the app)
// -------------------------
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // 10 second timeout - fail fast if backend is down
  timeout: 10000,
})

// -------------------------
// REQUEST INTERCEPTOR 🔑
// Runs BEFORE every request leaves the frontend
// Attaches the JWT access token from localStorage to the "Authorization" header
// -------------------------
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. Get the token from localStorage (stored here after login/register)
    const accessToken = localStorage.getItem('access_token')

    // 2. If we have a token, attach it to the Authorization header
    // Format expected by Django Simple JWT: "Bearer <token>"
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error: AxiosError) => {
    // Any request setup errors come through here (very rare)
    return Promise.reject(error)
  }
)

// -------------------------
// RESPONSE INTERCEPTOR 🛟
// Runs AFTER every response comes back from Django
//  - 2xx = success, just pass the response through
//  - 401 Unauthorized = token is expired or invalid → force logout
// -------------------------
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // SUCCESS (200, 201, etc.) - just pass it through
    return response
  },
  async (error: AxiosError) => {
    // ERROR (400, 401, 403, 404, 500, etc.)
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // SPECIAL CASE: 401 UNAUTHORIZED (token expired / invalid)
    // If we get a 401, we know the user's login session is dead
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Clear everything from localStorage - effectively "log out"
      // In Task 4 we can add automatic token refresh here (try refresh_token)
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')

      // If we're not already on the login page, redirect there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?session_expired=true'
      }
    }

    // Pass the error up so individual components can display validation messages
    return Promise.reject(error)
  }
)

// -------------------------
// Helper: Extract clean error messages from Django responses
// Django returns errors in various shapes. Normalize them to string[].
// -------------------------
export function extractApiErrors(error: unknown): string[] {
  const messages: string[] = []

  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as Record<string, unknown> | undefined

    if (!responseData) {
      // Network error, timeout, CORS, backend down
      messages.push(error.message || 'Network error. Please check your connection and try again.')
      return messages
    }

    // Case 1: Our custom { message: "..." } format
    if (typeof responseData.message === 'string') {
      messages.push(responseData.message)
    }

    // Case 2: DRF serializer errors: { email: ["Already exists"], password: ["Too short"] }
    Object.entries(responseData).forEach(([key, value]) => {
      // Skip keys we already added as message
      if (key === 'message' || key === 'success' || key === 'detail') return

      if (Array.isArray(value)) {
        // DRF format: string[] of errors for this field
        value.forEach((msg) => {
          if (typeof msg === 'string') {
            // Capitalize field name for friendlier messages
            const fieldPretty = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
            messages.push(`${fieldPretty}: ${msg}`)
          }
        })
      } else if (typeof value === 'string') {
        messages.push(`${key}: ${value}`)
      }
    })

    // Case 3: Simple JWT errors like { detail: "Invalid credentials" }
    if (typeof responseData.detail === 'string') {
      messages.push(responseData.detail)
    }
  } else if (error instanceof Error) {
    messages.push(error.message)
  } else {
    messages.push('An unexpected error occurred. Please try again.')
  }

  // Deduplicate (just in case)
  return [...new Set(messages)]
}

export default apiClient
