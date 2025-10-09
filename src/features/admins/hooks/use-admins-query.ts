import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { Admin, CreateAdminInput } from '../data/schema'

export function useAdminsQuery() {
  return useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      const response = await apiClient.get<{
        success: boolean
        payload: Admin[]
      }>('/admin/admins')
      return response.data.payload || []
    },
  })
}

export function useCreateAdminMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateAdminInput) => {
      const response = await apiClient.post('/admin/create-admin', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      toast.success('Admin created successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error?.message || 'Failed to create admin'
      toast.error(message)
    },
  })
}
