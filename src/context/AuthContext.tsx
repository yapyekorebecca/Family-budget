import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import {
  register as apiRegister,
  login as apiLogin,
  logout as apiLogout,
  getProfile as apiGetProfile,
  User,
  AuthTokens,
} from '../api/auth'
import { extractApiErrors } from '../api/client'

// -------------------------
// 1. TypeScript: Define the shape of our context
// -------------------------
interface AuthContextType {
  // State
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  loading: boolean          // true while checking localStorage / fetching profile on mount
  authLoading: boolean   // true while login/register API call in-flight
  errors: string[]    // validation errors from backend

  // Actions
  register: (params: {
    email: string
    password: string
    password_confirm: string
    first_name?: string
    last_name?: string
  }) => Promise<boolean>

  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  clearErrors: () => void
  fetchProfile: () => Promise<void>
}

// -------------------------
// 2. Create the context (undefined until Provider wraps the app)
// -------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// -------------------------
// 3. localStorage KEYS (DRY Principle - define constants to avoid typos
// -------------------------
const STORAGE_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  USER: 'user',
} as const

// -------------------------
// 4. The PROVIDER component - wraps our entire app (see usage in App.tsx)
// -------------------------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- State ---
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [loading, setLoading] = useState(true) // Start true - we're checking localStorage on mount
  const [authLoading, setAuthLoading] = useState(false)  // True during login/register API calls
  const [errors, setErrors] = useState<string[]>([])

  // --- Derived state (just a helper to save typing in components)
  const isAuthenticated = !!user && !!tokens

  // ==============================================================
  // HELPER: Persist to localStorage - called after login/register
  // ==============================================================
  const persistAuthState = useCallback((userData: User, tokenData: AuthTokens) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCESS, tokenData.access)
      localStorage.setItem(STORAGE_KEYS.REFRESH, tokenData.refresh)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
    } catch (err) {
      console.warn('Failed to save auth state to localStorage:', err)
    }
  }, [])

  // ==============================================================
  // HELPER: Clear localStorage & state - called on logout / 401
  // ==============================================================
  const clearAuthState = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS)
      localStorage.removeItem(STORAGE_KEYS.REFRESH)
      localStorage.removeItem(STORAGE_KEYS.USER)
    } catch (err) {
      console.warn('Failed to clear auth state:', err)
    } finally {
      setUser(null)
      setTokens(null)
      setErrors([])
    }
  }, [])

  // ==============================================================
  // ACTION: Register a NEW user account
  // Returns true on success, false if validation errors
  // ==============================================================
  const register = useCallback<AuthContextType['register']>(async (params) => {
    setAuthLoading(true)
    setErrors([])
    try {
      const res = await apiRegister(params)

      // API returned success (HTTP 201 Created)
      if (res.success) {
        const { user: userData, tokens: tokenData } = res.data
        setUser(userData)
        setTokens(tokenData)
        persistAuthState(userData, tokenData)
        setAuthLoading(false)
        return true
      }

      // If we don't get here on error (would've thrown), but just in case
      setAuthLoading(false)
      return false
    } catch (err) {
        const errs = extractApiErrors(err)
        setErrors(errs)
        setAuthLoading(false)
        return false
      }
  }, [persistAuthState])

  // ==============================================================
  // ACTION: Login existing user
  // ==============================================================
  const login = useCallback<AuthContextType['login']>(async (email, password) => {
    setAuthLoading(true)
    setErrors([])
    try {
      const res = await apiLogin({ email, password })

      if (res.success) {
        const { user: userData, tokens: tokenData } = res.data
        setUser(userData)
        setTokens(tokenData)
        persistAuthState(userData, tokenData)
        setAuthLoading(false)
        return true
      }

      setAuthLoading(false)
      return false
    } catch (err) {
      const errs = extractApiErrors(err)
      setErrors(errs)
      setAuthLoading(false)
      return false
    }
  }, [persistAuthState])

  // ==============================================================
  // ACTION: Logout - blacklist refresh token in Django + clear state
  // ==============================================================
  const logout = useCallback<AuthContextType['logout']>(async () => {
    setAuthLoading(true)
    try {
      // 1. Tell Django to blacklist the refresh token (best effort)
      if (tokens?.refresh) {
        try {
          await apiLogout(tokens.refresh)
        } catch (e) {
          console.info('Logout API failed, clearing local state anyway', e)
        }
      }
    } finally {
      // 2. Always clear local state even if API fails
      clearAuthState()
      setAuthLoading(false)
    }
  }, [tokens, clearAuthState])

  // ==============================================================
  // ACTION: Fetch fresh profile data from backend (optional helper)
  // ==============================================================
  const fetchProfile = useCallback<AuthContextType['fetchProfile']>(async () => {
    try {
      const res = await apiGetProfile()
      if (res.success) {
        setUser(res.data)
        // Update localStorage copy too
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data))
      }
    } catch (err) {
      console.warn('Failed to fetch profile', err)
    }
  }, [])

  // ==============================================================
  // ACTION: Clear validation errors (call this when user starts typing again
  // ==============================================================
  const clearErrors = useCallback(() => setErrors([]), [])

  // ==============================================================
  // USE EFFECT ON MOUNT:
  // When the app loads - try to restore auth from localStorage
  // AND verify the token is still valid by hitting /profile
  // ==============================================================
  useEffect(() => {
    const restoreSessionFromStorage = async () => {
      try {
        const savedAccess = localStorage.getItem(STORAGE_KEYS.ACCESS)
        const savedRefresh = localStorage.getItem(STORAGE_KEYS.REFRESH)
        const savedUserStr = localStorage.getItem(STORAGE_KEYS.USER)

        // Nothing saved → we're a guest
        if (!savedAccess || !savedRefresh) {
          setLoading(false)
          return
        }

        // Optimistically restore cached user
        let savedUser: User | null = null
        if (savedUserStr) {
          try {
            savedUser = JSON.parse(savedUserStr)
            setUser(savedUser)
          } catch { /* ignore */ }
        }

        setTokens({ access: savedAccess, refresh: savedRefresh })

        // Verify token still valid by fetching live profile from Django
        // (If 401 response interceptor will auto-clear everything)
        try {
          const res = await apiGetProfile()
          if (res.success) {
            setUser(res.data)
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data))
          }
        } catch (e) {
            // Interceptor already handled 401 (cleared state on 401
          console.warn('Token invalid on restore', e)
        }
      } finally {
        setLoading(false)
      }
    }

    restoreSessionFromStorage()
  }, [])

  // ==============================================================
  // VALUE OBJECT: Everything passed down via Provider to consumers
  // ==============================================================
  const value: AuthContextType = {
    user,
    tokens,
    isAuthenticated,
    loading,
    authLoading,
    errors,
    register,
    login,
    logout,
    clearErrors,
    fetchProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// -------------------------
// 5. CUSTOM HOOK (the "easy button" for components)
// Usage in any component:  const { user, login, logout } = useAuth()
// -------------------------
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
