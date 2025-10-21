'use client'

import { MoreHorizontal, Trash2 } from 'lucide-react'
import { formatToBotswanaDateTimeShort } from '@/lib/date-utils'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  type Notification,
  notificationTypeLabels,
  notificationPriorityColors,
} from '../data/schema'
import {
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} from '../hooks/use-notifications-query'

interface NotificationItemProps {
  notification: Notification
  onClose?: () => void
}

export function NotificationItem({
  notification,
  onClose,
}: NotificationItemProps) {
  const markAsReadMutation = useMarkNotificationAsReadMutation()
  const deleteMutation = useDeleteNotificationMutation()

  const handleMarkAsRead = () => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id)
    }
  }

  const handleDelete = () => {
    deleteMutation.mutate(notification.id)
  }

  const handleClick = () => {
    handleMarkAsRead()
    onClose?.()
  }

  return (
    <div
      className={cn(
        'hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors',
        !notification.isRead && 'border-l-2 border-l-blue-500 bg-blue-50/50'
      )}
      onClick={handleClick}
    >
      <div className='min-w-0 flex-1'>
        <div className='mb-1 flex items-center gap-2'>
          <Badge variant='secondary' className='text-xs'>
            {notificationTypeLabels[notification.type]}
          </Badge>
          <span
            className={cn(
              'text-xs font-medium',
              notificationPriorityColors[notification.priority]
            )}
          >
            {notification.priority}
          </span>
        </div>

        <h4 className='mb-1 line-clamp-1 text-sm font-medium'>
          {notification.title}
        </h4>

        <p className='text-muted-foreground line-clamp-2 text-sm'>
          {notification.message}
        </p>

        <p className='text-muted-foreground mt-2 text-xs'>
          {formatToBotswanaDateTimeShort(notification.createdAt)}
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
            className='text-destructive'
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
