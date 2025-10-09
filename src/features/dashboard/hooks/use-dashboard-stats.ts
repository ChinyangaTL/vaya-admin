import { useQuery } from '@tanstack/react-query'
import { adminAPI } from '@/lib/api-client'

export interface DashboardStats {
  platform: {
    wallet: {
      id: string
      balance: string
      totalCommission: string
      totalRegularCommission: string
      totalStudentCommission: string
      createdAt: string
      updatedAt: string
    }
    recentTransactions: Array<{
      id: string
      amount: string
      type: string
      description: string
      commission_type: string | null
      created_at: string
    }>
    revenueTrends: Array<{
      date: string
      regular: number
      student: number
      total: number
    }>
  }
  users: {
    total: number
    riders: number
    drivers: number
    activeDrivers: number
    pendingDrivers: number
  }
  studentVerification: {
    stats: Record<string, number>
  }
  trips: {
    today: number
    thisMonth: number
    completedThisMonth: number
    completionRate: number
  }
  bookings: {
    thisMonth: number
    totalPassengers: number
  }
  financial: {
    totalWalletBalance: string
    pendingDeposits: number
    pendingWithdrawals: number
  }
}

export interface RealtimeActivity {
  activeTrips: number
  recentTrips: number
  recentBookings: number
  onlineUsers: number
  lastUpdated: string
}

// Hook for fetching dashboard statistics
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await adminAPI.getDashboardStats()
      return response as DashboardStats
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

// Hook for fetching real-time activity
export function useRealtimeActivity() {
  return useQuery({
    queryKey: ['realtime-activity'],
    queryFn: async () => {
      const response = await adminAPI.getRealtimeActivity()
      return response as RealtimeActivity
    },
    staleTime: 10 * 1000, // 10 seconds
    refetchOnWindowFocus: true,
    refetchInterval: 15 * 1000, // Refetch every 15 seconds
  })
}







