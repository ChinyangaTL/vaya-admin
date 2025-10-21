import { MoreHorizontal, Eye, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getStatusInfo } from '../data/data'
import type { WithdrawalRequest } from '../data/schema'
import { useWithdrawals } from './withdrawals-provider'

// Helper function to format payment method display for table
const getPaymentMethodDisplay = (withdrawal: WithdrawalRequest): string => {
  if (!withdrawal.paymentMethod) return 'N/A'

  const pm = withdrawal.paymentMethod

  switch (pm.type) {
    case 'BANK_ACCOUNT':
      if (pm.bank_name && pm.account_number) {
        return `${pm.bank_name} - ${pm.account_number}`
      }
      return pm.name || 'Bank Account'
    case 'FNB_PAY2CELL':
      return `FNB Pay2Cell - ${pm.phone_number || 'N/A'}`
    case 'ORANGE_MONEY':
      return `Orange Money - ${pm.phone_number || 'N/A'}`
    default:
      return pm.name || 'N/A'
  }
}

interface WithdrawalsTableProps {
  data: WithdrawalRequest[]
  isLoading: boolean
  pagination: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
  }
}

export function WithdrawalsTable({ data, isLoading }: WithdrawalsTableProps) {
  const { setOpen, setCurrentWithdrawal } = useWithdrawals()

  const handleView = (withdrawal: WithdrawalRequest) => {
    setCurrentWithdrawal(withdrawal)
    setOpen('view')
  }

  const handleApprove = (withdrawal: WithdrawalRequest) => {
    setCurrentWithdrawal(withdrawal)
    setOpen('approve')
  }

  const handleReject = (withdrawal: WithdrawalRequest) => {
    setCurrentWithdrawal(withdrawal)
    setOpen('reject')
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-muted-foreground'>Loading withdrawals...</div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Select</TableHead>
            <TableHead>User Email</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className='h-24 text-center'>
                No withdrawals found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((withdrawal) => (
              <TableRow key={withdrawal.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className='font-medium'>
                  {withdrawal.user?.email || 'N/A'}
                </TableCell>
                <TableCell className='font-mono'>
                  BWP {parseFloat(withdrawal.amount).toFixed(2)}
                </TableCell>
                <TableCell className='max-w-32 truncate'>
                  {getPaymentMethodDisplay(withdrawal)}
                </TableCell>
                <TableCell>
                  {(() => {
                    const statusInfo = getStatusInfo(withdrawal.status)
                    const StatusIcon = statusInfo.icon
                    return (
                      <Badge variant='outline' className={statusInfo.color}>
                        <StatusIcon className='mr-1 h-3 w-3' />
                        {statusInfo.label}
                      </Badge>
                    )
                  })()}
                </TableCell>
                <TableCell>
                  {new Date(withdrawal.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' className='h-8 w-8 p-0'>
                        <span className='sr-only'>Open menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleView(withdrawal)}>
                        <Eye className='mr-2 h-4 w-4' />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {withdrawal.status === 'PENDING' && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleApprove(withdrawal)}
                          >
                            <CheckCircle className='mr-2 h-4 w-4' />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleReject(withdrawal)}
                          >
                            <XCircle className='mr-2 h-4 w-4' />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination will be added later */}
    </div>
  )
}
