import { ArrowUpRight, Loader2 } from 'lucide-react'
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

interface DepositRequest {
  id: string
  amount: string
  proof_file_path?: string
  bank_reference?: string
  status: string
  admin_notes?: string
  created_at: string
  updated_at: string
}

interface DepositTableProps {
  deposits: DepositRequest[]
  isLoading: boolean
  error: any
}

export function DepositTable({
  deposits,
  isLoading,
  error,
}: DepositTableProps) {
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
        error={error.message || 'Failed to load deposits'}
        onDismiss={() => {}}
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <ArrowUpRight className='h-5 w-5' />
          Deposit History
        </CardTitle>
        <CardDescription>
          All deposit requests made by this user
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-6 w-6 animate-spin' />
            <span className='ml-2'>Loading deposits...</span>
          </div>
        ) : deposits.length === 0 ? (
          <div className='py-8 text-center'>
            <ArrowUpRight className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <h3 className='mb-2 text-lg font-medium'>No Deposits Found</h3>
            <p className='text-muted-foreground'>
              This user has not made any deposit requests yet.
            </p>
          </div>
        ) : (
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Bank Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Admin Notes</TableHead>
                  <TableHead>Proof</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deposits.map((deposit) => {
                  const statusBadge = getStatusBadge(deposit.status)

                  return (
                    <TableRow key={deposit.id}>
                      <TableCell className='font-medium'>
                        {formatDate(deposit.created_at)}
                      </TableCell>
                      <TableCell className='font-medium text-green-600'>
                        {formatCurrency(deposit.amount)}
                      </TableCell>
                      <TableCell>{deposit.bank_reference || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={statusBadge.variant}>
                          {deposit.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{deposit.admin_notes || '-'}</TableCell>
                      <TableCell>
                        {deposit.proof_file_path ? (
                          <Badge variant='outline' className='cursor-pointer'>
                            View Proof
                          </Badge>
                        ) : (
                          '-'
                        )}
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

