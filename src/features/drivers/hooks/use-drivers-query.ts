import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '@/lib/api-client'
import {
  type DriverProfile,
  type DriverPerformance,
  type DriverEarnings,
  type DriverAnalytics,
} from '../data/schema'

// Hook for fetching pending drivers
export function usePendingDriversQuery() {
  return useQuery({
    queryKey: ['drivers', 'pending'],
    queryFn: async () => {
      const response = await adminAPI.getPendingDrivers()
      return response as DriverProfile[]
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

// Hook for fetching all drivers
export function useAllDriversQuery() {
  return useQuery({
    queryKey: ['drivers', 'all'],
    queryFn: async () => {
      const response = await adminAPI.getAllDrivers()
      return response as DriverProfile[]
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

// Hook for fetching driver performance
export function useDriverPerformanceQuery(driverId: string) {
  return useQuery({
    queryKey: ['drivers', driverId, 'performance'],
    queryFn: async () => {
      const response = await adminAPI.getDriverPerformance(driverId)
      return response as DriverPerformance
    },
    enabled: !!driverId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

// Hook for fetching driver earnings
export function useDriverEarningsQuery(driverId: string) {
  return useQuery({
    queryKey: ['drivers', driverId, 'earnings'],
    queryFn: async () => {
      const response = await adminAPI.getDriverEarnings(driverId)
      return response as DriverEarnings
    },
    enabled: !!driverId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

// Hook for fetching driver analytics by period
export function useDriverAnalyticsQuery(driverId: string, period: string) {
  return useQuery({
    queryKey: ['drivers', driverId, 'analytics', period],
    queryFn: async () => {
      const response = await adminAPI.getDriverAnalytics(driverId, period)
      return response as DriverAnalytics
    },
    enabled: !!driverId && !!period,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

// Hook for approving a driver
export function useApproveDriverMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      driverProfileId,
    }: {
      driverProfileId: string
      adminNotes?: string
    }) => {
      return await adminAPI.approveDriver(driverProfileId)
    },
    onSuccess: () => {
      // Invalidate and refetch pending drivers
      queryClient.invalidateQueries({ queryKey: ['drivers', 'pending'] })
    },
  })
}

// Hook for rejecting a driver
export function useRejectDriverMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      driverProfileId,
      reason,
    }: {
      driverProfileId: string
      reason: string
    }) => {
      return await adminAPI.rejectDriver(driverProfileId, reason)
    },
    onSuccess: () => {
      // Invalidate and refetch pending drivers
      queryClient.invalidateQueries({ queryKey: ['drivers', 'pending'] })
    },
  })
}
