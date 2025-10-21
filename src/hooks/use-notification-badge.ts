import { useEffect, useRef } from 'react'
import { useAdminNotificationStatsQuery } from '@/features/notifications/hooks/use-notifications-query'

/**
 * Hook to manage browser tab favicon badge for unread notifications
 * Updates the favicon to show notification count when there are unread notifications
 */
export function useNotificationBadge() {
  const { data: stats } = useAdminNotificationStatsQuery()
  const originalTitleRef = useRef<string | undefined>(undefined)
  const originalFaviconRef = useRef<string | undefined>(undefined)

  const unreadCount = stats?.unreadNotifications || 0

  useEffect(() => {
    // Store original title and favicon on first load
    if (!originalTitleRef.current) {
      originalTitleRef.current = document.title
    }
    if (!originalFaviconRef.current) {
      const faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      originalFaviconRef.current = faviconLink?.href || '/favicon.png'
    }

    // Update favicon and title based on unread count
    if (unreadCount > 0) {
      // Update title to show notification count
      document.title = `(${unreadCount}) ${originalTitleRef.current}`
      
      // Create a canvas to draw the favicon with badge
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = 32
      canvas.height = 32

      if (ctx) {
        // Create a new image for the favicon
        const img = new Image()
        img.onload = () => {
          // Draw the original favicon
          ctx.drawImage(img, 0, 0, 32, 32)
          
          // Draw notification badge circle
          ctx.fillStyle = '#ef4444' // red-500
          ctx.beginPath()
          ctx.arc(24, 8, 8, 0, 2 * Math.PI)
          ctx.fill()
          
          // Draw notification count text
          ctx.fillStyle = 'white'
          ctx.font = 'bold 10px Arial'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          
          const countText = unreadCount > 99 ? '99+' : unreadCount.toString()
          ctx.fillText(countText, 24, 8)
          
          // Update favicon
          const faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement
          if (faviconLink) {
            faviconLink.href = canvas.toDataURL('image/png')
          }
        }
        img.src = originalFaviconRef.current
      }
    } else {
      // Restore original title and favicon
      document.title = originalTitleRef.current
      
      const faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      if (faviconLink) {
        faviconLink.href = originalFaviconRef.current
      }
    }
  }, [unreadCount])

  return { unreadCount }
}
