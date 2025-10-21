'use client'

import { useState } from 'react'
import { Bell, Settings } from 'lucide-react'
import { usePushNotifications } from '@/hooks/use-push-notifications'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

export function NotificationSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    requestPermission,
    subscribe,
    unsubscribe,
  } = usePushNotifications()

  const handleToggleNotifications = async () => {
    if (isSubscribed) {
      await unsubscribe()
    } else {
      if (permission !== 'granted') {
        const granted = await requestPermission()
        if (granted) {
          await subscribe()
        }
      } else {
        await subscribe()
      }
    }
  }

  const getStatusText = () => {
    if (!isSupported) {
      return 'Not supported'
    }

    if (permission === 'denied') {
      return 'Permission denied'
    }

    if (permission === 'default') {
      return 'Permission not requested'
    }

    if (isSubscribed) {
      return 'Enabled'
    }

    return 'Disabled'
  }

  const getStatusColor = () => {
    if (!isSupported || permission === 'denied') {
      return 'text-destructive'
    }

    if (isSubscribed) {
      return 'text-green-600'
    }

    return 'text-muted-foreground'
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm'>
          <Settings className='h-4 w-4' />
          <span className='sr-only'>Notification settings</span>
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Bell className='h-5 w-5' />
            Notification Settings
          </DialogTitle>
          <DialogDescription>
            Manage your notification preferences for the admin dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Push Notifications */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <Label
                  htmlFor='push-notifications'
                  className='text-base font-medium'
                >
                  Browser Push Notifications
                </Label>
                <p className='text-muted-foreground text-sm'>
                  Receive notifications even when the dashboard is not open
                </p>
              </div>
              <Switch
                id='push-notifications'
                checked={isSubscribed}
                onCheckedChange={handleToggleNotifications}
                disabled={!isSupported || permission === 'denied' || isLoading}
              />
            </div>

            <div className='flex items-center gap-2 text-sm'>
              <span className='text-muted-foreground'>Status:</span>
              <span className={getStatusColor()}>{getStatusText()}</span>
            </div>

            {!isSupported && (
              <p className='text-destructive text-sm'>
                Push notifications are not supported in this browser.
              </p>
            )}

            {permission === 'denied' && (
              <p className='text-destructive text-sm'>
                Notification permission was denied. Please enable it in your
                browser settings.
              </p>
            )}
          </div>

          <Separator />

          {/* In-App Notifications */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <Label
                  htmlFor='in-app-notifications'
                  className='text-base font-medium'
                >
                  In-App Notifications
                </Label>
                <p className='text-muted-foreground text-sm'>
                  Show notifications in the dashboard interface
                </p>
              </div>
              <Switch
                id='in-app-notifications'
                checked={true}
                disabled={true}
              />
            </div>

            <p className='text-muted-foreground text-sm'>
              In-app notifications are always enabled to ensure you don't miss
              important updates.
            </p>
          </div>

          <Separator />

          {/* Notification Types */}
          <div className='space-y-4'>
            <h4 className='text-sm font-medium'>Notification Types</h4>
            <div className='space-y-3'>
              {[
                { type: 'Driver Registration', enabled: true },
                { type: 'Deposit Requests', enabled: true },
                { type: 'Withdrawal Requests', enabled: true },
                { type: 'Student Verifications', enabled: true },
                { type: 'System Alerts', enabled: true },
              ].map((notification) => (
                <div
                  key={notification.type}
                  className='flex items-center justify-between'
                >
                  <span className='text-sm'>{notification.type}</span>
                  <Switch checked={notification.enabled} disabled={true} />
                </div>
              ))}
            </div>

            <p className='text-muted-foreground text-sm'>
              All notification types are enabled by default for admin users.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
