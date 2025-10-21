'use client'

import { CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NotificationDropdownHeaderProps {
  unreadCount: number
  onMarkAllAsRead: () => void
  isLoading: boolean
}

export function NotificationDropdownHeader({
  unreadCount,
  onMarkAllAsRead,
  isLoading,
}: NotificationDropdownHeaderProps) {
  return (
    <div className='flex items-center justify-between p-4'>
      <div>
        <h3 className='font-semibold'>Notifications</h3>
        {unreadCount > 0 && (
          <p className='text-muted-foreground text-sm'>
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {unreadCount > 0 && (
        <Button
          variant='ghost'
          size='sm'
          onClick={onMarkAllAsRead}
          disabled={isLoading}
          className='text-xs'
        >
          <CheckCheck className='mr-1 h-4 w-4' />
          Mark all read
        </Button>
      )}
    </div>
  )
}
