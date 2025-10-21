import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminAPI } from '@/lib/api-client'
import {
  type NotificationStats,
  type NotificationsResponse,
} from '../data/schema'

export function useAdminNotificationsQuery(params?: {
  limit?: number
  offset?: number
  unreadOnly?: boolean
  type?: string
}) {
  return useQuery({
    queryKey: ['admin-notifications', params],
    queryFn: async () => {
      const response = await adminAPI.getAdminNotifications(params)
      return response.payload as NotificationsResponse
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  })
}

export function useAdminNotificationStatsQuery() {
  return useQuery({
    queryKey: ['admin-notification-stats'],
    queryFn: async () => {
      const response = await adminAPI.getAdminNotificationStats()
      return response.payload as NotificationStats
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  })
}

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await adminAPI.markNotificationAsRead(notificationId)
      return response
    },
    onSuccess: () => {
      // Invalidate and refetch notifications and stats
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] })
      queryClient.invalidateQueries({ queryKey: ['admin-notification-stats'] })
    },
    onError: (error: any) => {
      toast.error('Failed to mark notification as read', {
        description: error.response?.data?.message || error.message,
      })
    },
  })
}

export function useMarkAllNotificationsAsReadMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await adminAPI.markAllNotificationsAsRead()
      return response
    },
    onSuccess: () => {
      toast.success('All notifications marked as read')
      // Invalidate and refetch notifications and stats
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] })
      queryClient.invalidateQueries({ queryKey: ['admin-notification-stats'] })
    },
    onError: (error: any) => {
      toast.error('Failed to mark all notifications as read', {
        description: error.response?.data?.message || error.message,
      })
    },
  })
}

export function useDeleteNotificationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await adminAPI.deleteNotification(notificationId)
      return response
    },
    onSuccess: () => {
      toast.success('Notification deleted')
      // Invalidate and refetch notifications and stats
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] })
      queryClient.invalidateQueries({ queryKey: ['admin-notification-stats'] })
    },
    onError: (error: any) => {
      toast.error('Failed to delete notification', {
        description: error.response?.data?.message || error.message,
      })
    },
  })
}
