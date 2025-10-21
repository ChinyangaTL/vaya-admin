'use client'

import { useState } from 'react'
import { Bell, BellRing } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  useAdminNotificationStatsQuery,
  useMarkAllNotificationsAsReadMutation,
} from '../hooks/use-notifications-query'
import { NotificationDropdownHeader } from './notification-dropdown-header'
import { NotificationItem } from './notification-item'
import { NotificationSettings } from './notification-settings'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)

  const { data: stats, isLoading } = useAdminNotificationStatsQuery()
  const markAllAsReadMutation = useMarkAllNotificationsAsReadMutation()

  const unreadCount = stats?.unreadNotifications || 0
  const recentNotifications = stats?.recentNotifications || []

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate()
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='relative'>
          {unreadCount > 0 ? (
            <BellRing className='h-5 w-5' />
          ) : (
            <Bell className='h-5 w-5' />
          )}
          {unreadCount > 0 && (
            <Badge
              variant='destructive'
              className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs'
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          <span className='sr-only'>Notifications</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-80'>
        <NotificationDropdownHeader
          unreadCount={unreadCount}
          onMarkAllAsRead={handleMarkAllAsRead}
          isLoading={markAllAsReadMutation.isPending}
        />

        <Separator />

        <ScrollArea className='h-96'>
          {isLoading ? (
            <div className='text-muted-foreground p-4 text-center text-sm'>
              Loading notifications...
            </div>
          ) : recentNotifications.length === 0 ? (
            <div className='text-muted-foreground p-4 text-center text-sm'>
              No notifications
            </div>
          ) : (
            <div className='p-1'>
              {recentNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClose={() => setIsOpen(false)}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        <Separator />

        <div className='p-2'>
          <NotificationSettings />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
