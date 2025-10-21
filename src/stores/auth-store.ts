import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'vaya_admin_token'
// Refresh token is handled via httpOnly cookies by the Vaya API

// Vaya-specific user interface based on actual API structure
export interface VayaUser {
  id: string
  email: string
  role: 'RIDER' | 'DRIVER' | 'FLEET_MANAGER' | 'ADMIN'
  // Optional fields that might be present
  phone?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
  first_name?: string
  last_name?: string
  profile_picture?: string
}

interface AuthState {
  auth: {
    user: VayaUser | null
    accessToken: string
    isAuthenticated: boolean
    isLoading: boolean
    setUser: (user: VayaUser | null) => void
    setAccessToken: (accessToken: string) => void
    setAuthData: (accessToken: string, user: VayaUser) => void
    setLoading: (loading: boolean) => void
    fetchProfile: () => Promise<void>
    reset: () => void
    logout: () => void
  }
}

export const useAuthStore = create<AuthState>()((set, get) => {
  const cookieAccessToken = getCookie(ACCESS_TOKEN)

  const initAccessToken = cookieAccessToken ? JSON.parse(cookieAccessToken) : ''

  return {
    auth: {
      user: null,
      accessToken: initAccessToken,
      isAuthenticated: !!initAccessToken,
      isLoading: false, // Don't set loading on initial state

      setUser: (user) =>
        set((state) => ({
          ...state,
          auth: {
            ...state.auth,
            user,
            isAuthenticated: !!user && !!state.auth.accessToken,
          },
        })),

      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken), 60 * 60 * 24) // 24 hours
          return {
            ...state,
            auth: {
              ...state.auth,
              accessToken,
              isAuthenticated: !!accessToken && !!state.auth.user,
            },
          }
        }),

      setAuthData: (accessToken, user) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken), 60 * 60 * 24) // 24 hours
          return {
            ...state,
            auth: {
              ...state.auth,
              accessToken,
              user,
              isAuthenticated: true,
            },
          }
        }),

      setLoading: (loading) =>
        set((state) => ({
          ...state,
          auth: { ...state.auth, isLoading: loading },
        })),

      fetchProfile: async () => {
        const { auth } = get()

        if (!auth.accessToken) {
          return
        }

        // Prevent multiple simultaneous calls
        if (auth.isLoading) {
          return
        }

        try {
          // Set loading state
          set((state) => ({
            ...state,
            auth: { ...state.auth, isLoading: true },
          }))

          // Import authAPI dynamically to avoid circular dependency
          const { authAPI } = await import('@/lib/api-client')
          const userProfile = await authAPI.getProfile()

          // Ensure user object has all required fields
          const completeUser: VayaUser = {
            ...userProfile,
            // Set defaults for optional fields if not provided
            phone: userProfile.phone || '',
            is_active: userProfile.is_active ?? true,
            created_at: userProfile.created_at || new Date().toISOString(),
            updated_at: userProfile.updated_at || new Date().toISOString(),
          }

          set((state) => ({
            ...state,
            auth: {
              ...state.auth,
              user: completeUser,
              isAuthenticated: true,
              isLoading: false,
            },
          }))
        } catch (error) {
          // Profile fetch failed, clear auth state
          set((state) => ({
            ...state,
            auth: {
              ...state.auth,
              user: null,
              accessToken: '',
              isAuthenticated: false,
              isLoading: false,
            },
          }))

          // Clear the cookie as well
          removeCookie(ACCESS_TOKEN)
        }
      },

      logout: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          // Refresh token cookie is cleared by the server on logout
          return {
            ...state,
            auth: {
              ...state.auth,
              user: null,
              accessToken: '',
              isAuthenticated: false,
              isLoading: false,
            },
          }
        }),

      reset: () => {
        const { logout } = get().auth
        logout()
      },
    },
  }
})
