import { useState } from 'react'
import { formatToBotswanaDateTimeShort } from '@/lib/date-utils'
import {
  Bell,
  BellRing,
  CheckCheck,
  Filter,
  MoreHorizontal,
  Trash2,
} from 'lucide-react'
import { usePageTitle } from '@/hooks/use-page-title'
import { usePushNotifications } from '@/hooks/use-push-notifications'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { NotificationBell } from '@/features/notifications'
import {
  type Notification,
  notificationTypeLabels,
  notificationPriorityColors,
} from '@/features/notifications/data/schema'
import {
  useAdminNotificationsQuery,
  useAdminNotificationStatsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} from '@/features/notifications/hooks/use-notifications-query'

export function Notifications() {
  usePageTitle('Notifications')

  const [activeTab, setActiveTab] = useState('all')
  const [filterType, setFilterType] = useState<string | undefined>(undefined)

  const { data: stats } = useAdminNotificationStatsQuery()
  const { data: notifications, isLoading } = useAdminNotificationsQuery({
    limit: 50,
    unreadOnly: activeTab === 'unread',
    type: filterType,
  })

  const {
    isSupported,
    permission,
    isLoading: pushLoading,
    requestPermission,
  } = usePushNotifications()

  const markAsReadMutation = useMarkNotificationAsReadMutation()
  const markAllAsReadMutation = useMarkAllNotificationsAsReadMutation()
  const deleteMutation = useDeleteNotificationMutation()

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId)
  }

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate()
  }

  const handleDelete = (notificationId: string) => {
    deleteMutation.mutate(notificationId)
  }

  const notificationList = notifications?.notifications || []
  const totalNotifications = stats?.totalNotifications || 0
  const unreadNotifications = stats?.unreadNotifications || 0

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <NotificationBell />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 space-y-4'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <div className='flex items-center gap-2'>
                <Bell className='text-vaya-orange h-6 w-6' />
                <h2 className='text-2xl font-bold tracking-tight'>
                  Notifications
                </h2>
              </div>
              <p className='text-muted-foreground'>
                Manage and view all admin notifications
              </p>
            </div>
            <div className='flex items-center gap-2'>
              {unreadNotifications > 0 && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsReadMutation.isPending}
                >
                  <CheckCheck className='mr-2 h-4 w-4' />
                  Mark All Read
                </Button>
              )}
              {isSupported && permission !== 'granted' && (
                <Button
                  variant='default'
                  size='sm'
                  onClick={requestPermission}
                  disabled={pushLoading}
                >
                  <BellRing className='mr-2 h-4 w-4' />
                  Enable Browser Notifications
                </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Notifications
                </CardTitle>
                <Bell className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{totalNotifications}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Unread</CardTitle>
                <BellRing className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-orange-600'>
                  {unreadNotifications}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Read</CardTitle>
                <CheckCheck className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-green-600'>
                  {totalNotifications - unreadNotifications}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Browser Notifications
                </CardTitle>
                <BellRing className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    !isSupported
                      ? 'text-gray-500'
                      : permission === 'granted'
                        ? 'text-green-600'
                        : permission === 'denied'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                  }`}
                >
                  {!isSupported
                    ? 'Not Supported'
                    : permission === 'granted'
                      ? 'Enabled'
                      : permission === 'denied'
                        ? 'Denied'
                        : 'Not Requested'}
                </div>
                {permission === 'denied' && (
                  <p className='mt-1 text-xs text-red-600'>
                    Enable in browser settings
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-4'
        >
          <TabsList>
            <TabsTrigger value='all'>All Notifications</TabsTrigger>
            <TabsTrigger value='unread'>Unread Only</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className='space-y-4'>
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle>
                      {activeTab === 'unread'
                        ? 'Unread Notifications'
                        : 'All Notifications'}
                    </CardTitle>
                    <CardDescription>
                      {notificationList.length} notification
                      {notificationList.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline' size='sm'>
                        <Filter className='mr-2 h-4 w-4' />
                        Filter by Type
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => setFilterType(undefined)}
                      >
                        All Types
                      </DropdownMenuItem>
                      <Separator />
                      {Object.entries(notificationTypeLabels).map(
                        ([type, label]) => (
                          <DropdownMenuItem
                            key={type}
                            onClick={() => setFilterType(type)}
                          >
                            {label}
                          </DropdownMenuItem>
                        )
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className='h-[600px]'>
                  {isLoading ? (
                    <div className='flex items-center justify-center py-8'>
                      <div className='text-muted-foreground'>
                        Loading notifications...
                      </div>
                    </div>
                  ) : notificationList.length === 0 ? (
                    <div className='flex items-center justify-center py-8'>
                      <div className='text-center'>
                        <Bell className='text-muted-foreground mx-auto h-12 w-12' />
                        <h3 className='mt-2 text-sm font-semibold'>
                          No notifications
                        </h3>
                        <p className='text-muted-foreground text-sm'>
                          {activeTab === 'unread'
                            ? 'All notifications have been read'
                            : 'No notifications found'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className='space-y-2'>
                      {notificationList.map((notification: Notification) => (
                        <NotificationCard
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={handleMarkAsRead}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

interface NotificationCardProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationCardProps) {
  return (
    <Card
      className={`hover:bg-muted/50 transition-colors ${!notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''}`}
    >
      <CardContent className='p-4'>
        <div className='flex items-start justify-between'>
          <div className='flex-1 space-y-2'>
            <div className='flex items-center gap-2'>
              <Badge variant='secondary' className='text-xs'>
                {notificationTypeLabels[notification.type]}
              </Badge>
              <span
                className={`text-xs font-medium ${notificationPriorityColors[notification.priority]}`}
              >
                {notification.priority}
              </span>
              {!notification.isRead && (
                <Badge variant='default' className='text-xs'>
                  New
                </Badge>
              )}
            </div>

            <h4 className='font-medium'>{notification.title}</h4>
            <p className='text-muted-foreground text-sm'>
              {notification.message}
            </p>

                   <div className='text-muted-foreground flex items-center gap-4 text-xs'>
                     <span>
                       {formatToBotswanaDateTimeShort(notification.createdAt)}
                     </span>
              {notification.expiresAt && (
                <span>
                  Expires:{' '}
                  {formatToBotswanaDateTimeShort(notification.expiresAt)}
                </span>
              )}
            </div>
          </div>

          <div className='flex items-center gap-1'>
            {!notification.isRead && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onMarkAsRead(notification.id)}
                className='h-8 w-8 p-0'
              >
                <CheckCheck className='h-4 w-4' />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem
                  onClick={() => onDelete(notification.id)}
                  className='text-destructive'
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
