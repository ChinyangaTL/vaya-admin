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
import type { DepositRequest } from '../data/schema'
import { useDeposits } from './deposits-provider'

interface DepositsTableProps {
  data: DepositRequest[]
  isLoading: boolean
  pagination: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
  }
}

export function DepositsTable({ data, isLoading }: DepositsTableProps) {
  const { setOpen, setCurrentDeposit } = useDeposits()

  const handleView = (deposit: DepositRequest) => {
    setCurrentDeposit(deposit)
    setOpen('view')
  }

  const handleApprove = (deposit: DepositRequest) => {
    setCurrentDeposit(deposit)
    setOpen('approve')
  }

  const handleReject = (deposit: DepositRequest) => {
    setCurrentDeposit(deposit)
    setOpen('reject')
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-muted-foreground'>Loading deposits...</div>
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
            <TableHead>Bank Reference</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className='h-24 text-center'>
                No deposits found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((deposit) => (
              <TableRow key={deposit.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className='font-medium'>
                  {deposit.user?.email || 'N/A'}
                </TableCell>
                <TableCell className='font-mono'>
                  BWP {parseFloat(deposit.amount).toFixed(2)}
                </TableCell>
                <TableCell className='max-w-32 truncate'>
                  {deposit.bank_reference || 'N/A'}
                </TableCell>
                <TableCell>
                  {(() => {
                    const statusInfo = getStatusInfo(deposit.status)
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
                  {new Date(deposit.created_at).toLocaleDateString()}
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
                      <DropdownMenuItem onClick={() => handleView(deposit)}>
                        <Eye className='mr-2 h-4 w-4' />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {deposit.status === 'PENDING' && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleApprove(deposit)}
                          >
                            <CheckCircle className='mr-2 h-4 w-4' />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleReject(deposit)}
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
