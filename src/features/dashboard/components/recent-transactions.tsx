import { Clock, DollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type DashboardStats } from '../hooks/use-dashboard-stats'

interface RecentTransactionsProps {
  stats: DashboardStats
}

export function RecentTransactions({ stats }: RecentTransactionsProps) {
  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount)
    return new Intl.NumberFormat('en-BW', {
      style: 'currency',
      currency: 'BWP',
      minimumFractionDigits: 2,
    }).format(num)
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
  }

  const getCommissionTypeColor = (type: string | null) => {
    switch (type) {
      case 'REGULAR_FARE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'STUDENT_FARE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getCommissionTypeLabel = (type: string | null) => {
    switch (type) {
      case 'REGULAR_FARE':
        return 'Regular'
      case 'STUDENT_FARE':
        return 'Student'
      default:
        return 'Other'
    }
  }

  return (
    <Card className='col-span-1 lg:col-span-3'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <DollarSign className='h-5 w-5' />
          Recent Platform Transactions
        </CardTitle>
        <p className='text-muted-foreground text-sm'>
          Latest commission transactions from rides
        </p>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {stats.platform.recentTransactions.length === 0 ? (
            <div className='text-muted-foreground py-8 text-center'>
              <DollarSign className='mx-auto mb-4 h-12 w-12 opacity-50' />
              <p>No recent transactions</p>
              <p className='text-sm'>
                Commission transactions will appear here as rides are completed
              </p>
            </div>
          ) : (
            <div className='max-h-96 space-y-3 overflow-y-auto'>
              {stats.platform.recentTransactions.map((transaction) => {
                const { date, time } = formatDateTime(transaction.created_at)

                return (
                  <div
                    key={transaction.id}
                    className='hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors'
                  >
                    <div className='min-w-0 flex-1'>
                      <div className='mb-1 flex items-center gap-2'>
                        <h4 className='truncate font-medium'>
                          {transaction.description}
                        </h4>
                        {transaction.commission_type && (
                          <Badge
                            variant='secondary'
                            className={`text-xs ${getCommissionTypeColor(transaction.commission_type)}`}
                          >
                            {getCommissionTypeLabel(
                              transaction.commission_type
                            )}
                          </Badge>
                        )}
                      </div>
                      <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                        <Clock className='h-3 w-3' />
                        <span>
                          {date} at {time}
                        </span>
                        <span>•</span>
                        <span className='font-mono text-xs'>
                          {transaction.id.slice(0, 8)}...
                        </span>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='font-bold text-green-600 dark:text-green-400'>
                        +{formatCurrency(transaction.amount)}
                      </div>
                      <div className='text-muted-foreground text-xs'>
                        Commission
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {stats.platform.recentTransactions.length > 0 && (
            <div className='border-t pt-4'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>
                  Showing {stats.platform.recentTransactions.length} most recent
                  transactions
                </span>
                <span className='text-muted-foreground'>
                  Total platform balance:{' '}
                  {formatCurrency(stats.platform.wallet.balance)}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}













