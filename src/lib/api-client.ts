import axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth-store'

// API Configuration - Using production URL for admin dashboard
// const API_BASE_URL = 'http://localhost:3000/api'
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
          // Only redirect if not already on auth pages to prevent loops
          if (
            !window.location.pathname.startsWith('/sign-in') &&
            !window.location.pathname.startsWith('/sign-up')
          ) {
            window.location.href = '/sign-in'
          }
          return Promise.reject(refreshError)
        }
      } else {
        // Not authenticated, redirect to login
        auth.logout()
        // Only redirect if not already on auth pages to prevent loops
        if (
          !window.location.pathname.startsWith('/sign-in') &&
          !window.location.pathname.startsWith('/sign-up')
        ) {
          window.location.href = '/sign-in'
        }
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

  register: async (userData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    role: 'RIDER' | 'DRIVER'
  }) => {
    const response = await apiClient.post('/auth/register', userData)
    // Vaya API returns: { success: true, payload: { id, email, role }, message }
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

  // Student Verification Management
  getPendingStudentVerifications: async () => {
    const response = await apiClient.get('/admin/students/pending')
    return response.data.payload
  },

  approveStudentVerification: async (userId: string, adminNotes?: string) => {
    const response = await apiClient.put(`/admin/students/${userId}/approve`, {
      adminNotes,
    })
    return response.data.payload
  },

  rejectStudentVerification: async (
    userId: string,
    rejectionReason: string,
    adminNotes?: string
  ) => {
    const response = await apiClient.put(`/admin/students/${userId}/reject`, {
      rejectionReason,
      adminNotes,
    })
    return response.data.payload
  },

  // Dashboard Statistics
  getDashboardStats: async () => {
    const response = await apiClient.get('/dashboard/stats')
    return response.data.payload
  },

  getRealtimeActivity: async () => {
    const response = await apiClient.get('/dashboard/realtime')
    return response.data.payload
  },

  // Platform Wallet Management
  getPlatformWalletSummary: async () => {
    const response = await apiClient.get('/platform-wallet/summary')
    return response.data.payload
  },

  getPlatformTransactions: async (limit = 50, offset = 0) => {
    const response = await apiClient.get(
      `/platform-wallet/transactions?limit=${limit}&offset=${offset}`
    )
    return response.data.payload
  },

  getPlatformTransactionById: async (transactionId: string) => {
    const response = await apiClient.get(
      `/platform-wallet/transactions/${transactionId}`
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

  getStudentDocumentUrl: async (filePath: string) => {
    const response = await apiClient.get(
      `/auth/student-documents/${encodeURIComponent(filePath)}/url`
    )
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

  deleteUser: async (userId: string) => {
    const response = await apiClient.delete(`/admin/users/${userId}`)
    return response.data
  },

  deleteUsers: async (userIds: string[]) => {
    const response = await apiClient.delete('/admin/users/batch', {
      data: { userIds },
    })
    return response.data
  },

  // User search
  searchUserByEmail: async (email: string) => {
    const response = await apiClient.get(
      `/admin/users/search/email?email=${encodeURIComponent(email)}`
    )
    return response.data.payload
  },

  searchUserByPhone: async (phone: string) => {
    const response = await apiClient.get(
      `/admin/users/search/phone?phone=${encodeURIComponent(phone)}`
    )
    return response.data.payload
  },

  resetUserPassword: async (userId: string, newPassword: string) => {
    const response = await apiClient.put(
      `/admin/users/${userId}/reset-password`,
      {
        newPassword,
      }
    )
    return response.data
  },

  // Admin wallet tracking
  getAdminUserWalletSummary: async (userId: string) => {
    const response = await apiClient.get(
      `/admin/wallet/users/${userId}/summary`
    )
    return response.data.data
  },

  getAdminUserTransactionHistory: async (
    userId: string,
    filters?: {
      limit?: number
      offset?: number
      type?: string
      date_from?: string
      date_to?: string
    }
  ) => {
    const params = new URLSearchParams()
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.offset) params.append('offset', filters.offset.toString())
    if (filters?.type) params.append('type', filters.type)
    if (filters?.date_from) params.append('date_from', filters.date_from)
    if (filters?.date_to) params.append('date_to', filters.date_to)

    const response = await apiClient.get(
      `/admin/wallet/users/${userId}/transactions?${params.toString()}`
    )
    return response.data.data
  },

  getAdminUserDepositHistory: async (
    userId: string,
    limit = 50,
    offset = 0
  ) => {
    const response = await apiClient.get(
      `/admin/wallet/users/${userId}/deposits?limit=${limit}&offset=${offset}`
    )
    return response.data.data
  },

  getAdminUserWithdrawalHistory: async (
    userId: string,
    limit = 50,
    offset = 0
  ) => {
    const response = await apiClient.get(
      `/admin/wallet/users/${userId}/withdrawals?limit=${limit}&offset=${offset}`
    )
    return response.data.data
  },

  // Admin Notifications
  getAdminNotifications: async (params?: {
    limit?: number
    offset?: number
    unreadOnly?: boolean
    type?: string
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    if (params?.unreadOnly)
      queryParams.append('unreadOnly', params.unreadOnly.toString())
    if (params?.type) queryParams.append('type', params.type)

    const response = await apiClient.get(
      `/admin/notifications?${queryParams.toString()}`
    )
    return response.data
  },

  getAdminNotificationStats: async () => {
    const response = await apiClient.get('/admin/notifications/stats')
    return response.data
  },

  markNotificationAsRead: async (notificationId: string) => {
    const response = await apiClient.put(
      `/admin/notifications/${notificationId}/read`
    )
    return response.data
  },

  markAllNotificationsAsRead: async () => {
    const response = await apiClient.put('/admin/notifications/read-all')
    return response.data
  },

  deleteNotification: async (notificationId: string) => {
    const response = await apiClient.delete(
      `/admin/notifications/${notificationId}`
    )
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

  // Queue Monitoring
  getQueueStats: async () => {
    const response = await apiClient.get('/admin/queues/stats')
    return response.data.data
  },

  getQueueStatsByName: async (queueName: string) => {
    const response = await apiClient.get(`/admin/queues/${queueName}/stats`)
    return response.data.data
  },

  pauseQueue: async (queueName: string) => {
    const response = await apiClient.post(`/admin/queues/${queueName}/pause`)
    return response.data.data
  },

  resumeQueue: async (queueName: string) => {
    const response = await apiClient.post(`/admin/queues/${queueName}/resume`)
    return response.data.data
  },

  clearQueue: async (queueName: string) => {
    const response = await apiClient.delete(`/admin/queues/${queueName}/clear`)
    return response.data.data
  },

  getSystemHealth: async () => {
    const response = await apiClient.get('/admin/queues/health')
    return response.data.data
  },

  // Failed Job Management
  getFailedJobs: async (queueName: string, limit = 50, offset = 0) => {
    const response = await apiClient.get(
      `/admin/queues/${queueName}/failed?limit=${limit}&offset=${offset}`
    )
    return response.data.data
  },

  retryFailedJob: async (queueName: string, jobId: string) => {
    const response = await apiClient.post(
      `/admin/queues/${queueName}/jobs/${jobId}/retry`
    )
    return response.data.data
  },

  retryAllFailedJobs: async (queueName: string) => {
    const response = await apiClient.post(
      `/admin/queues/${queueName}/failed/retry-all`
    )
    return response.data.data
  },

  removeFailedJob: async (queueName: string, jobId: string) => {
    const response = await apiClient.delete(
      `/admin/queues/${queueName}/jobs/${jobId}/remove`
    )
    return response.data.data
  },

  getJobDetails: async (queueName: string, jobId: string) => {
    const response = await apiClient.get(
      `/admin/queues/${queueName}/jobs/${jobId}`
    )
    return response.data.data
  },

  // Bug Report Management
  getBugReports: async (params?: {
    status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    limit?: number
    offset?: number
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    if (params?.severity) queryParams.append('severity', params.severity)
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())

    const response = await apiClient.get(
      `/admin/bug-reports${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    )
    return response.data
  },

  getBugReport: async (id: string) => {
    const response = await apiClient.get(`/admin/bug-reports/${id}`)
    return response.data
  },

  updateBugReport: async (
    id: string,
    data: {
      title?: string
      description?: string
      status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
      severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      resolutionNotes?: string
      assignedTo?: string | null
    }
  ) => {
    const response = await apiClient.put(`/admin/bug-reports/${id}`, data)
    return response.data
  },

  deleteBugReport: async (id: string) => {
    const response = await apiClient.delete(`/admin/bug-reports/${id}`)
    return response.data
  },

  getBugReportAttachmentUrl: async (filePath: string) => {
    const encodedPath = encodeURIComponent(filePath)
    const response = await apiClient.get(
      `/support/bugs/attachments/${encodedPath}/url`
    )
    return response.data.payload.signedUrl
  },
}

export default apiClient
