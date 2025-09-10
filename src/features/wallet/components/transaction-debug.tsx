import { ErrorDisplay } from '@/components/error-display'
import { useDebugTransactionsQuery } from '../hooks/use-wallet-query'
import { DebugPrimaryButtons } from './debug-primary-buttons'
import { DebugTransactionsTable } from './debug-transactions-table'

export function TransactionDebug() {
  const {
    data: transactions = [],
    isLoading,
    error,
  } = useDebugTransactionsQuery()

  if (error) {
    return (
      <ErrorDisplay
        error={error.message || 'Failed to load transaction debug data'}
        onDismiss={() => window.location.reload()}
      />
    )
  }

  return (
    <div className='space-y-4'>
      <DebugPrimaryButtons />

      <div className='rounded-md border'>
        <DebugTransactionsTable data={transactions} isLoading={isLoading} />
      </div>
    </div>
  )
}
