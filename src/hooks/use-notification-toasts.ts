import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useAdminNotificationStatsQuery } from '@/features/notifications/hooks/use-notifications-query'

/**
 * Hook to manage real-time notification polling and toast notifications
 * Shows toast notifications for new notifications and polls for updates
 */
export function useNotificationToasts() {
  const { data: stats, refetch } = useAdminNotificationStatsQuery()
  const lastNotificationIdRef = useRef<string | undefined>(undefined)
  const isPollingRef = useRef(false)

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    const pollInterval = setInterval(() => {
      if (!isPollingRef.current) {
        isPollingRef.current = true
        refetch().finally(() => {
          isPollingRef.current = false
        })
      }
    }, 30 * 1000) // 30 seconds

    return () => clearInterval(pollInterval)
  }, [refetch])

  // Show toast notifications for new notifications
  useEffect(() => {
    if (!stats?.recentNotifications) return

    const recentNotifications = stats.recentNotifications
    const latestNotification = recentNotifications[0]

    // Check if this is a new notification
    if (
      latestNotification &&
      latestNotification.id !== lastNotificationIdRef.current &&
      lastNotificationIdRef.current !== undefined // Don't show toast on initial load
    ) {
      // Show toast notification
      const notificationType = latestNotification.type
      let toastType: 'success' | 'warning' | 'error' = 'success'
      let icon = '🔔'

      // Customize toast based on notification type
      switch (notificationType) {
        case 'DEPOSIT_REQUEST':
          toastType = 'success'
          icon = '💰'
          break
        case 'WITHDRAWAL_REQUEST':
          toastType = 'warning'
          icon = '💸'
          break
        case 'DRIVER_REGISTRATION':
          toastType = 'success'
          icon = '🚗'
          break
        case 'STUDENT_VERIFICATION':
          toastType = 'success'
          icon = '🎓'
          break
        case 'SYSTEM_ALERT':
          toastType = 'error'
          icon = '⚠️'
          break
        default:
          toastType = 'success'
          icon = '🔔'
      }

      toast[toastType](`${icon} ${latestNotification.title}`, {
        description: latestNotification.message,
        duration: 5000,
        action: {
          label: 'View',
          onClick: () => {
            // Navigate to notifications page
            window.location.href = '/notifications'
          },
        },
      })
    }

    // Update the last notification ID
    if (latestNotification) {
      lastNotificationIdRef.current = latestNotification.id
    }
  }, [stats?.recentNotifications])

  return {
    unreadCount: stats?.unreadNotifications || 0,
    totalCount: stats?.totalNotifications || 0,
  }
}
