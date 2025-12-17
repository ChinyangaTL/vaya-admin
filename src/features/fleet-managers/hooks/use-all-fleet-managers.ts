import { useQuery } from '@tanstack/react-query'
import { adminAPI } from '@/lib/api-client'
import { FleetManagerProfile } from '../types'

export function useAllFleetManagers() {
  return useQuery<FleetManagerProfile[]>({
    queryKey: ['all-fleet-managers'],
    queryFn: async () => {
      const res = await adminAPI.getAllFleetManagers()
      return res ?? []
    },
    staleTime: 60 * 1000,
  })
}

