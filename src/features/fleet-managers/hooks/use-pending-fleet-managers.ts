import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '@/lib/api-client'
import { FleetManagerProfile } from '../types'

export function usePendingFleetManagers() {
  return useQuery<FleetManagerProfile[]>({
    queryKey: ['pending-fleet-managers'],
    queryFn: async () => {
      const res = await adminAPI.getPendingFleetManagers()
      return res ?? []
    },
    staleTime: 60 * 1000,
  })
}

export function useApproveFleetManager() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      profileId,
      adminNotes,
    }: {
      profileId: string
      adminNotes?: string
    }) => adminAPI.approveFleetManager(profileId, adminNotes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pending-fleet-managers'] })
      qc.invalidateQueries({ queryKey: ['all-fleet-managers'] })
    },
  })
}

export function useRejectFleetManager() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      profileId,
      adminNotes,
    }: {
      profileId: string
      adminNotes: string
    }) => adminAPI.rejectFleetManager(profileId, adminNotes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pending-fleet-managers'] })
      qc.invalidateQueries({ queryKey: ['all-fleet-managers'] })
    },
  })
}

