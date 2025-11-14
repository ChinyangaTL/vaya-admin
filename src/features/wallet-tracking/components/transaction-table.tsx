import { History, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ErrorDisplay } from '@/components/error-display'

interface Transaction {
  id: string
  amount: string
  type: string
  description: string
  status: string
  previous_balance: string
  new_balance: string
  created_at: string
}

interface TransactionTableProps {
  transactions: Transaction[]
  isLoading: boolean
  error: Error | null
}

export function TransactionTable({
  transactions,
  isLoading,
  error,
}: TransactionTableProps) {
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-BW', {
      style: 'currency',
      currency: 'BWP',
    }).format(parseFloat(amount))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTransactionTypeBadge = (type: string) => {
    const variants = {
      DEPOSIT: { variant: 'default' as const, color: 'text-green-600' },
      WITHDRAWAL: { variant: 'destructive' as const, color: 'text-red-600' },
      TRIP_PAYMENT: { variant: 'secondary' as const, color: 'text-blue-600' },
      TRIP_REFUND: { variant: 'outline' as const, color: 'text-purple-600' },
      QR_PAYMENT: { variant: 'secondary' as const, color: 'text-orange-600' },
      ADMIN_ADJUSTMENT: { variant: 'outline' as const, color: 'text-gray-600' },
    }
    return (
      variants[type as keyof typeof variants] || {
        variant: 'secondary' as const,
        color: 'text-gray-600',
      }
    )
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      COMPLETED: { variant: 'default' as const },
      PENDING: { variant: 'secondary' as const },
      FAILED: { variant: 'destructive' as const },
      CANCELLED: { variant: 'outline' as const },
    }
    return (
      variants[status as keyof typeof variants] || {
        variant: 'secondary' as const,
      }
    )
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error.message || 'Failed to load transactions'}
        onDismiss={() => {}}
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <History className='h-5 w-5' />
          Transaction History
        </CardTitle>
        <CardDescription>
          Complete transaction history for this user's wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-6 w-6 animate-spin' />
            <span className='ml-2'>Loading transactions...</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className='py-8 text-center'>
            <History className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <h3 className='mb-2 text-lg font-medium'>No Transactions Found</h3>
            <p className='text-muted-foreground'>
              This user has no transaction history yet.
            </p>
          </div>
        ) : (
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Previous Balance</TableHead>
                  <TableHead>New Balance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                  const typeBadge = getTransactionTypeBadge(transaction.type)
                  const statusBadge = getStatusBadge(transaction.status)
                  const isPositive = [
                    'DEPOSIT',
                    'TRIP_REFUND',
                    'ADMIN_ADJUSTMENT',
                  ].includes(transaction.type)

                  return (
                    <TableRow key={transaction.id}>
                      <TableCell className='font-medium'>
                        {formatDate(transaction.created_at)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={typeBadge.variant}>
                          {transaction.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell
                        className={
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }
                      >
                        {isPositive ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(transaction.previous_balance)}
                      </TableCell>
                      <TableCell className='font-medium'>
                        {formatCurrency(transaction.new_balance)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadge.variant}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

