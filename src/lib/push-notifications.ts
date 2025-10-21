import { toast } from 'sonner'

export interface PushNotificationData {
  title: string
  message: string
  type: string
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  data?: Record<string, any>
}

class PushNotificationService {
  private isSupported: boolean = false
  private registration: ServiceWorkerRegistration | null = null
  private subscription: PushSubscription | null = null

  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window
  }

  async initialize(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Push notifications are not supported in this browser')
      return false
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered:', this.registration)

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready
      console.log('Service Worker ready')

      return true
    } catch (error) {
      console.error('Failed to initialize push notifications:', error)
      return false
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      return 'denied'
    }

    try {
      const permission = await Notification.requestPermission()
      console.log('Notification permission:', permission)
      return permission
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return 'denied'
    }
  }

  async subscribe(): Promise<PushSubscription | null> {
    if (!this.isSupported || !this.registration) {
      return null
    }

    try {
      const permission = await this.requestPermission()
      if (permission !== 'granted') {
        console.warn('Notification permission not granted')
        return null
      }

      // Subscribe to push notifications
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ),
      })

      console.log('Push subscription created:', this.subscription)
      return this.subscription
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      return null
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return false
    }

    try {
      const result = await this.subscription.unsubscribe()
      this.subscription = null
      console.log('Push subscription removed:', result)
      return result
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
      return false
    }
  }

  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.isSupported || !this.registration) {
      return null
    }

    try {
      this.subscription = await this.registration.pushManager.getSubscription()
      return this.subscription
    } catch (error) {
      console.error('Failed to get push subscription:', error)
      return null
    }
  }

  async sendSubscriptionToServer(
    subscription: PushSubscription
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/admin/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log('Push subscription sent to server successfully')
      return true
    } catch (error) {
      console.error('Failed to send subscription to server:', error)
      return false
    }
  }

  showLocalNotification(data: PushNotificationData): void {
    if (!this.isSupported) {
      // Fallback to toast notification
      toast.info(data.title, {
        description: data.message,
        duration:
          data.priority === 'HIGH' || data.priority === 'URGENT' ? 10000 : 5000,
      })
      return
    }

    const options: NotificationOptions = {
      body: data.message,
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: data.type,
      data: data.data || {},
      requireInteraction:
        data.priority === 'HIGH' || data.priority === 'URGENT',
      silent: false,
    }

    if (data.priority === 'HIGH' || data.priority === 'URGENT') {
      options.vibrate = [200, 100, 200]
    }

    new Notification(data.title, options)
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Check if notifications are supported and enabled
  isNotificationSupported(): boolean {
    return this.isSupported
  }

  // Check if user has granted permission
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported) {
      return 'denied'
    }
    return Notification.permission
  }

  // Check if we have an active subscription
  async hasActiveSubscription(): Promise<boolean> {
    const subscription = await this.getSubscription()
    return subscription !== null
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService()
