import axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth-store'

// API Configuration - Using production URL for admin dashboard
const API_BASE_URL = 'https://api.vaya-luyten.com/api'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for refresh token
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const { auth } = useAuthStore.getState()

    if (auth.accessToken) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for token refresh and error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Skip interceptor for login requests to prevent redirect loops
    if (originalRequest.url?.includes('/auth/login')) {
      return Promise.reject(error)
    }

    // Handle 401 errors (token expired) - only for authenticated requests
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const { auth } = useAuthStore.getState()

      // Only attempt refresh if user is already authenticated
      if (auth.isAuthenticated && auth.accessToken) {
        try {
          // Attempt to refresh token using cookies (Vaya API approach)
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {},
            {
              withCredentials: true,
            }
          )

          const { accessToken } = response.data.payload
          auth.setAccessToken(accessToken)

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return apiClient(originalRequest)
        } catch (refreshError) {
          // Refresh failed, logout user
          auth.logout()
          window.location.href = '/sign-in'
          return Promise.reject(refreshError)
        }
      } else {
        // Not authenticated, redirect to login
        auth.logout()
        window.location.href = '/sign-in'
      }
    }

    return Promise.reject(error)
  }
)

// Auth API endpoints - Updated to match Vaya API structure
export const authAPI = {
  // Test API connectivity
  healthCheck: async () => {
    const response = await apiClient.get('/health')
    return response.data
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password })
    // Vaya API returns: { success: true, payload: { accessToken, user }, message }
    return response.data.payload
  },

  refreshToken: async () => {
    // Vaya API uses cookies for refresh token, not body
    const response = await apiClient.post('/auth/refresh')
    return response.data.payload
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout')
    return response.data
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/me')
    // Vaya API returns: { success: true, payload: userProfile, message }
    return response.data.payload
  },
}

// Admin API endpoints
export const adminAPI = {
  // Driver Management
  getPendingDrivers: async () => {
    const response = await apiClient.get('/admin/drivers/pending')
    return response.data.payload
  },

  getAllDrivers: async () => {
    const response = await apiClient.get('/admin/drivers')
    return response.data.payload
  },

  approveDriver: async (driverProfileId: string, adminNotes?: string) => {
    const response = await apiClient.put(
      `/admin/drivers/${driverProfileId}/approve`,
      { adminNotes }
    )
    return response.data.payload
  },

  rejectDriver: async (driverProfileId: string, reason: string) => {
    const response = await apiClient.put(
      `/admin/drivers/${driverProfileId}/reject`,
      { reason }
    )
    return response.data.payload
  },

  getDriverPerformance: async (driverId: string) => {
    const response = await apiClient.get(
      `/api/trips/performance/driver/${driverId}`
    )
    return response.data.payload
  },

  getDriverEarnings: async (driverId: string) => {
    const response = await apiClient.get(
      `/api/trips/earnings/driver/${driverId}`
    )
    return response.data.payload
  },

  getDriverAnalytics: async (driverId: string, period: string) => {
    const response = await apiClient.get(
      `/api/trips/analytics/driver/${driverId}/period/${period}`
    )
    return response.data.payload
  },

  // Document Management
  getDocumentUrl: async (documentId: string) => {
    const response = await apiClient.get(`/drivers/documents/${documentId}/url`)
    return response.data.payload.signedUrl
  },

  // Route Management
  getRoutes: async () => {
    const response = await apiClient.get('/admin/routes')
    return response.data
  },

  toggleRoute: async (routeId: string, isActive: boolean) => {
    const response = await apiClient.put(`/admin/routes/${routeId}/toggle`, {
      isActive,
    })
    return response.data
  },

  // User Management
  updateUserRole: async (userId: string, role: string) => {
    const response = await apiClient.put(`/admin/users/${userId}/role`, {
      role,
    })
    return response.data
  },

  getAllUsers: async () => {
    const response = await apiClient.get('/admin/users')
    return response.data
  },

  // Wallet Management
  getPendingDeposits: async (limit = 50, offset = 0) => {
    const response = await apiClient.get(
      `/wallet/admin/deposits/pending?limit=${limit}&offset=${offset}`
    )
    return response.data.data
  },

  approveDeposit: async (depositId: string, adminNotes?: string) => {
    const response = await apiClient.put(
      `/wallet/admin/deposits/${depositId}/approve`,
      { adminNotes }
    )
    return response.data.data
  },

  rejectDeposit: async (depositId: string, adminNotes: string) => {
    const response = await apiClient.put(
      `/wallet/admin/deposits/${depositId}/reject`,
      { adminNotes }
    )
    return response.data.data
  },

  getPendingWithdrawals: async (limit = 50, offset = 0) => {
    const response = await apiClient.get(
      `/wallet/admin/withdrawals/pending?limit=${limit}&offset=${offset}`
    )
    return response.data.data
  },

  approveWithdrawal: async (withdrawalId: string, adminNotes?: string) => {
    const response = await apiClient.put(
      `/wallet/admin/withdrawals/${withdrawalId}/approve`,
      { adminNotes }
    )
    return response.data.data
  },

  rejectWithdrawal: async (withdrawalId: string, adminNotes: string) => {
    const response = await apiClient.put(
      `/wallet/admin/withdrawals/${withdrawalId}/reject`,
      { adminNotes }
    )
    return response.data.data
  },

  getDepositProofUrl: async (depositId: string) => {
    const response = await apiClient.get(`/wallet/deposits/${depositId}/proof`)
    return response.data.data.proofUrl
  },

  debugTransactions: async () => {
    const response = await apiClient.get('/wallet/debug/transactions')
    return response.data.data
  },

  // Notification Management
  sendMaintenanceAlert: async (data: Record<string, unknown>) => {
    const response = await apiClient.post(
      '/admin/notifications/maintenance',
      data
    )
    return response.data
  },

  sendFeatureUpdate: async (data: Record<string, unknown>) => {
    const response = await apiClient.post(
      '/admin/notifications/feature-update',
      data
    )
    return response.data
  },

  sendSystemAlert: async (data: Record<string, unknown>) => {
    const response = await apiClient.post(
      '/admin/notifications/system-alert',
      data
    )
    return response.data
  },

  // System Monitoring
  getWebSocketHealth: async () => {
    const response = await apiClient.get('/websocket/health')
    return response.data
  },

  getWebSocketStats: async () => {
    const response = await apiClient.get('/websocket/stats')
    return response.data
  },

  getTripStats: async (driverId: string) => {
    const response = await apiClient.get(`/api/trips/stats/driver/${driverId}`)
    return response.data
  },
}

export default apiClient
