import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type DashboardStats } from '../hooks/use-dashboard-stats'

interface RevenueChartProps {
  stats: DashboardStats
}

export function RevenueChart({ stats }: RevenueChartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BW', {
      style: 'currency',
      currency: 'BWP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  // Calculate trend
  const getTrend = () => {
    if (stats.platform.revenueTrends.length < 2)
      return { direction: 'neutral', percentage: 0 }

    const sortedTrends = [...stats.platform.revenueTrends].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    const latest = sortedTrends[sortedTrends.length - 1].total
    const previous = sortedTrends[sortedTrends.length - 2].total

    if (latest === 0 && previous === 0)
      return { direction: 'neutral', percentage: 0 }

    const percentage =
      previous === 0 ? 100 : ((latest - previous) / previous) * 100
    const direction =
      percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral'

    return { direction, percentage: Math.abs(percentage) }
  }

  const trend = getTrend()
  const totalRevenue = stats.platform.revenueTrends.reduce(
    (sum, day) => sum + day.total,
    0
  )
  const avgRevenue =
    stats.platform.revenueTrends.length > 0
      ? totalRevenue / stats.platform.revenueTrends.length
      : 0

  return (
    <Card className='col-span-1 lg:col-span-4'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Revenue Trends</CardTitle>
            <p className='text-muted-foreground text-sm'>
              Platform commission revenue over the last 7 days
            </p>
          </div>
          <div className='flex items-center gap-2'>
            {trend.direction === 'up' && (
              <div className='flex items-center gap-1 text-green-600'>
                <TrendingUp className='h-4 w-4' />
                <span className='text-sm font-medium'>
                  +{trend.percentage.toFixed(1)}%
                </span>
              </div>
            )}
            {trend.direction === 'down' && (
              <div className='flex items-center gap-1 text-red-600'>
                <TrendingDown className='h-4 w-4' />
                <span className='text-sm font-medium'>
                  -{trend.percentage.toFixed(1)}%
                </span>
              </div>
            )}
            {trend.direction === 'neutral' && (
              <div className='text-muted-foreground flex items-center gap-1'>
                <span className='text-sm font-medium'>No change</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Summary Stats */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='text-center'>
              <div className='text-2xl font-bold'>
                {formatCurrency(totalRevenue)}
              </div>
              <div className='text-muted-foreground text-sm'>
                Total (7 days)
              </div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold'>
                {formatCurrency(avgRevenue)}
              </div>
              <div className='text-muted-foreground text-sm'>Daily Average</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold'>
                {stats.platform.revenueTrends.length}
              </div>
              <div className='text-muted-foreground text-sm'>Active Days</div>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className='space-y-2'>
            <h4 className='text-sm font-medium'>Revenue Breakdown</h4>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex items-center justify-between rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20'>
                <div>
                  <div className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                    Regular Fares
                  </div>
                  <div className='text-xs text-blue-500 dark:text-blue-300'>
                    Commission from regular rides
                  </div>
                </div>
                <div className='text-lg font-bold text-blue-600 dark:text-blue-400'>
                  {formatCurrency(
                    stats.platform.revenueTrends.reduce(
                      (sum, day) => sum + day.regular,
                      0
                    )
                  )}
                </div>
              </div>
              <div className='flex items-center justify-between rounded-lg bg-green-50 p-3 dark:bg-green-950/20'>
                <div>
                  <div className='text-sm font-medium text-green-600 dark:text-green-400'>
                    Student Fares
                  </div>
                  <div className='text-xs text-green-500 dark:text-green-300'>
                    Commission from student rides
                  </div>
                </div>
                <div className='text-lg font-bold text-green-600 dark:text-green-400'>
                  {formatCurrency(
                    stats.platform.revenueTrends.reduce(
                      (sum, day) => sum + day.student,
                      0
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Daily Breakdown */}
          <div className='space-y-2'>
            <h4 className='text-sm font-medium'>Daily Breakdown</h4>
            <div className='max-h-48 space-y-2 overflow-y-auto'>
              {stats.platform.revenueTrends.length === 0 ? (
                <div className='text-muted-foreground py-8 text-center'>
                  No revenue data available for the last 7 days
                </div>
              ) : (
                stats.platform.revenueTrends
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((day) => (
                    <div
                      key={day.date}
                      className='flex items-center justify-between rounded-lg border p-3'
                    >
                      <div>
                        <div className='font-medium'>
                          {formatDate(day.date)}
                        </div>
                        <div className='text-muted-foreground text-sm'>
                          Regular: {formatCurrency(day.regular)} • Student:{' '}
                          {formatCurrency(day.student)}
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='font-bold'>
                          {formatCurrency(day.total)}
                        </div>
                        <div className='text-muted-foreground text-sm'>
                          Total
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



