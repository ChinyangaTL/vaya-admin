import { useQuery } from '@tanstack/react-query'
import { adminAPI } from '@/lib/api-client'
import { type User } from '../data/schema'

export function useUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await adminAPI.getAllUsers()
      return response.payload as User[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
