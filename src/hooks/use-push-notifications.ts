import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  pushNotificationService,
  type PushNotificationData,
} from '@/lib/push-notifications'

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] =
    useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const initializePushNotifications = async () => {
      setIsLoading(true)

      try {
        // Check if push notifications are supported
        const supported = pushNotificationService.isNotificationSupported()
        setIsSupported(supported)

        if (!supported) {
          setIsLoading(false)
          return
        }

        // Initialize service worker
        const initialized = await pushNotificationService.initialize()
        if (!initialized) {
          setIsLoading(false)
          return
        }

        // Check current permission status
        const currentPermission = pushNotificationService.getPermissionStatus()
        setPermission(currentPermission)

        // Check if we have an active subscription
        const hasSubscription =
          await pushNotificationService.hasActiveSubscription()
        setIsSubscribed(hasSubscription)
      } catch (error) {
        console.error('Failed to initialize push notifications:', error)
        toast.error('Failed to initialize push notifications')
      } finally {
        setIsLoading(false)
      }
    }

    initializePushNotifications()
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      toast.error('Push notifications are not supported in this browser')
      return false
    }

    setIsLoading(true)

    try {
      const newPermission = await pushNotificationService.requestPermission()
      setPermission(newPermission)

      if (newPermission === 'granted') {
        toast.success('Push notifications enabled')
        return true
      } else {
        toast.error('Push notifications permission denied')
        return false
      }
    } catch (error) {
      console.error('Failed to request permission:', error)
      toast.error('Failed to request push notification permission')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const subscribe = async (): Promise<boolean> => {
    if (!isSupported || permission !== 'granted') {
      toast.error('Push notifications not available')
      return false
    }

    setIsLoading(true)

    try {
      const subscription = await pushNotificationService.subscribe()
      if (!subscription) {
        toast.error('Failed to subscribe to push notifications')
        return false
      }

      // Send subscription to server
      const sentToServer =
        await pushNotificationService.sendSubscriptionToServer(subscription)
      if (!sentToServer) {
        toast.error('Failed to save push notification settings')
        return false
      }

      setIsSubscribed(true)
      toast.success('Push notifications enabled successfully')
      return true
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      toast.error('Failed to enable push notifications')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const unsubscribe = async (): Promise<boolean> => {
    if (!isSubscribed) {
      return true
    }

    setIsLoading(true)

    try {
      const unsubscribed = await pushNotificationService.unsubscribe()
      if (unsubscribed) {
        setIsSubscribed(false)
        toast.success('Push notifications disabled')
        return true
      } else {
        toast.error('Failed to disable push notifications')
        return false
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
      toast.error('Failed to disable push notifications')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const showNotification = (data: PushNotificationData) => {
    pushNotificationService.showLocalNotification(data)
  }

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
  }
}
