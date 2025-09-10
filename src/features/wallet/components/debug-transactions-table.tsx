import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getTransactionTypeInfo } from '../data/data'
import type { Transaction } from '../data/schema'

interface DebugTransactionsTableProps {
  data: Transaction[]
  isLoading: boolean
}

export function DebugTransactionsTable({
  data,
  isLoading,
}: DebugTransactionsTableProps) {
  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-muted-foreground'>Loading transactions...</div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Previous Balance</TableHead>
            <TableHead>New Balance</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className='h-24 text-center'>
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className='font-mono text-xs'>
                  {transaction.id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  {(() => {
                    const typeInfo = getTransactionTypeInfo(transaction.type)
                    const TypeIcon = typeInfo.icon
                    return (
                      <Badge variant='outline' className={typeInfo.color}>
                        <TypeIcon className='mr-1 h-3 w-3' />
                        {typeInfo.label}
                      </Badge>
                    )
                  })()}
                </TableCell>
                <TableCell className='font-mono'>
                  BWP {parseFloat(transaction.amount).toFixed(2)}
                </TableCell>
                <TableCell className='max-w-48 truncate'>
                  {transaction.description || 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge variant='outline'>{transaction.status}</Badge>
                </TableCell>
                <TableCell className='font-mono text-sm'>
                  BWP {parseFloat(transaction.previous_balance).toFixed(2)}
                </TableCell>
                <TableCell className='font-mono text-sm'>
                  BWP {parseFloat(transaction.new_balance).toFixed(2)}
                </TableCell>
                <TableCell className='text-sm'>
                  {new Date(transaction.created_at).toLocaleDateString()}{' '}
                  {new Date(transaction.created_at).toLocaleTimeString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
