import { RefreshCw, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDebugTransactionsQuery } from '../hooks/use-wallet-query'

export function DebugPrimaryButtons() {
  const { refetch, isFetching, data } = useDebugTransactionsQuery()

  const handleExport = () => {
    if (!data) return

    const csvContent = [
      [
        'ID',
        'Amount',
        'Type',
        'Description',
        'Status',
        'Previous Balance',
        'New Balance',
        'Created At',
      ],
      ...data.map((transaction) => [
        transaction.id,
        transaction.amount,
        transaction.type,
        transaction.description,
        transaction.status,
        transaction.previous_balance,
        transaction.new_balance,
        new Date(transaction.created_at).toISOString(),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-debug-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={handleExport}
          disabled={!data || data.length === 0}
        >
          <Download className='mr-2 h-4 w-4' />
          Export CSV
        </Button>
      </div>
    </div>
  )
}
