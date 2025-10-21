import { useNotificationBadge } from '@/hooks/use-notification-badge'
import { useNotificationToasts } from '@/hooks/use-notification-toasts'

/**
 * Comprehensive notification provider that handles:
 * - Browser tab favicon badge
 * - Browser tab title updates
 * - Toast notifications for new notifications
 * - Real-time polling
 */
export function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize both notification systems
  useNotificationBadge()
  useNotificationToasts()

  return <>{children}</>
}
