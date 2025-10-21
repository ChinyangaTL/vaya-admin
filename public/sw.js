// Service Worker for Admin Push Notifications
const CACHE_NAME = 'vaya-admin-notifications-v1'

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install')
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate')
  event.waitUntil(self.clients.claim())
})

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received')

  if (!event.data) {
    console.log('Service Worker: No data in push event')
    return
  }

  try {
    const data = event.data.json()
    console.log('Service Worker: Push data:', data)

    const options = {
      body: data.message || 'New notification',
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: data.type || 'admin-notification',
      data: data.data || {},
      actions: [
        {
          action: 'view',
          title: 'View',
          icon: '/favicon.png',
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/favicon.png',
        },
      ],
      requireInteraction:
        data.priority === 'HIGH' || data.priority === 'URGENT',
      silent: false,
      vibrate:
        data.priority === 'HIGH' || data.priority === 'URGENT'
          ? [200, 100, 200]
          : undefined,
    }

    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Vaya Admin Notification',
        options
      )
    )
  } catch (error) {
    console.error('Service Worker: Error processing push data:', error)

    // Fallback notification
    event.waitUntil(
      self.registration.showNotification('Vaya Admin Notification', {
        body: 'New notification received',
        icon: '/favicon.png',
        tag: 'admin-notification-fallback',
      })
    )
  }
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.action)

  event.notification.close()

  if (event.action === 'dismiss') {
    return
  }

  // Default action or 'view' action
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // Check if there's already a window open
      for (const client of clients) {
        if (client.url.includes('/admin') && 'focus' in client) {
          return client.focus()
        }
      }

      // Open new window if none exists
      if (self.clients.openWindow) {
        return self.clients.openWindow('/admin')
      }
    })
  )
})

// Background sync for offline notifications
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag)

  if (event.tag === 'notification-sync') {
    event.waitUntil(
      // Handle any pending notification actions
      Promise.resolve()
    )
  }
})

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data)

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
