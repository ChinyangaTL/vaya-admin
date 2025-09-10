import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '@/lib/api-client'
import { type PendingDriverProfile } from '../data/schema'

// Hook for fetching pending drivers
export function usePendingDriversQuery() {
  return useQuery({
    queryKey: ['pending-drivers'],
    queryFn: async () => {
      const response = await adminAPI.getPendingDrivers()
      return response as PendingDriverProfile[]
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

// Hook for approving a driver
export function useApproveDriverMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      driverProfileId,
      adminNotes,
    }: {
      driverProfileId: string
      adminNotes?: string
    }) => {
      return await adminAPI.approveDriver(driverProfileId, adminNotes)
    },
    onSuccess: () => {
      // Invalidate and refetch pending drivers
      queryClient.invalidateQueries({ queryKey: ['pending-drivers'] })
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
      queryClient.invalidateQueries({ queryKey: ['pending-drivers'] })
    },
  })
}
