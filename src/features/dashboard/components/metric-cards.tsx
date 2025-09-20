import {
  DollarSign,
  Users,
  UserCheck,
  Car,
  TrendingUp,
  GraduationCap,
  Activity,
  AlertCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  type DashboardStats,
  type RealtimeActivity,
} from '../hooks/use-dashboard-stats'

interface MetricCardsProps {
  stats: DashboardStats
  realtime: RealtimeActivity
}

export function MetricCards({ stats, realtime }: MetricCardsProps) {
  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount)
    return new Intl.NumberFormat('en-BW', {
      style: 'currency',
      currency: 'BWP',
      minimumFractionDigits: 2,
    }).format(num)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {/* Platform Revenue */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Platform Revenue
          </CardTitle>
          <DollarSign className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {formatCurrency(stats.platform.wallet.balance)}
          </div>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <Badge variant='outline' className='text-xs'>
              Regular:{' '}
              {formatCurrency(stats.platform.wallet.totalRegularCommission)}
            </Badge>
            <Badge variant='outline' className='text-xs'>
              Student:{' '}
              {formatCurrency(stats.platform.wallet.totalStudentCommission)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Total Users */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
          <Users className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {stats.users.total.toLocaleString()}
          </div>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <span>Riders: {stats.users.riders}</span>
            <span>•</span>
            <span>Drivers: {stats.users.drivers}</span>
          </div>
          {stats.users.pendingDrivers > 0 && (
            <div className='mt-1 flex items-center gap-1 text-xs text-orange-600'>
              <AlertCircle className='h-3 w-3' />
              <span>{stats.users.pendingDrivers} pending drivers</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Drivers */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Active Drivers</CardTitle>
          <UserCheck className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.users.activeDrivers}</div>
          <p className='text-muted-foreground text-xs'>
            {stats.users.activeDrivers} of {stats.users.drivers} total drivers
          </p>
        </CardContent>
      </Card>

      {/* Active Trips */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Active Trips</CardTitle>
          <Car className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{realtime.activeTrips}</div>
          <p className='text-muted-foreground text-xs'>
            +{realtime.recentTrips} new in last hour
          </p>
        </CardContent>
      </Card>

      {/* Trip Completion Rate */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Completion Rate</CardTitle>
          <TrendingUp className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {formatPercentage(stats.trips.completionRate)}
          </div>
          <p className='text-muted-foreground text-xs'>
            {stats.trips.completedThisMonth} of {stats.trips.thisMonth} trips
            this month
          </p>
        </CardContent>
      </Card>

      {/* Total Passengers */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Monthly Passengers
          </CardTitle>
          <Users className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {stats.bookings.totalPassengers.toLocaleString()}
          </div>
          <p className='text-muted-foreground text-xs'>
            {stats.bookings.thisMonth} bookings this month
          </p>
        </CardContent>
      </Card>

      {/* Student Verifications */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Student Verifications
          </CardTitle>
          <GraduationCap className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {(stats.studentVerification.stats.PENDING || 0) +
              (stats.studentVerification.stats.APPROVED || 0)}
          </div>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <Badge variant='outline' className='text-xs'>
              Pending: {stats.studentVerification.stats.PENDING || 0}
            </Badge>
            <Badge variant='outline' className='text-xs'>
              Approved: {stats.studentVerification.stats.APPROVED || 0}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* System Activity */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>System Activity</CardTitle>
          <Activity className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{realtime.onlineUsers}</div>
          <p className='text-muted-foreground text-xs'>
            {realtime.recentBookings} bookings in last hour
          </p>
          <p className='text-muted-foreground text-xs'>
            Last updated: {new Date(realtime.lastUpdated).toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
