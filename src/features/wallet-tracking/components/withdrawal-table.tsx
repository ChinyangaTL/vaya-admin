import { ArrowDownLeft, Loader2 } from 'lucide-react'
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

interface WithdrawalRequest {
  id: string
  amount: string
  bank_account: string
  status: string
  admin_notes?: string
  created_at: string
  updated_at: string
}

interface WithdrawalTableProps {
  withdrawals: WithdrawalRequest[]
  isLoading: boolean
  error: any
}

export function WithdrawalTable({
  withdrawals,
  isLoading,
  error,
}: WithdrawalTableProps) {
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

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: { variant: 'secondary' as const },
      APPROVED: { variant: 'default' as const },
      REJECTED: { variant: 'destructive' as const },
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
        error={error.message || 'Failed to load withdrawals'}
        onDismiss={() => {}}
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <ArrowDownLeft className='h-5 w-5' />
          Withdrawal History
        </CardTitle>
        <CardDescription>
          All withdrawal requests made by this user
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-6 w-6 animate-spin' />
            <span className='ml-2'>Loading withdrawals...</span>
          </div>
        ) : withdrawals.length === 0 ? (
          <div className='py-8 text-center'>
            <ArrowDownLeft className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <h3 className='mb-2 text-lg font-medium'>No Withdrawals Found</h3>
            <p className='text-muted-foreground'>
              This user has not made any withdrawal requests yet.
            </p>
          </div>
        ) : (
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Bank Account</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Admin Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((withdrawal) => {
                  const statusBadge = getStatusBadge(withdrawal.status)

                  return (
                    <TableRow key={withdrawal.id}>
                      <TableCell className='font-medium'>
                        {formatDate(withdrawal.created_at)}
                      </TableCell>
                      <TableCell className='font-medium text-red-600'>
                        -{formatCurrency(withdrawal.amount)}
                      </TableCell>
                      <TableCell className='font-mono text-sm'>
                        {withdrawal.bank_account}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadge.variant}>
                          {withdrawal.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{withdrawal.admin_notes || '-'}</TableCell>
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

