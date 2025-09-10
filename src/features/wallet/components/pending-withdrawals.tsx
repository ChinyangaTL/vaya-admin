import { useState } from 'react'
import { ErrorDisplay } from '@/components/error-display'
import { usePendingWithdrawalsQuery } from '../hooks/use-wallet-query'
import { WithdrawalsDialogs } from './withdrawals-dialogs'
import { WithdrawalsPrimaryButtons } from './withdrawals-primary-buttons'
import { WithdrawalsProvider } from './withdrawals-provider'
import { WithdrawalsTable } from './withdrawals-table'

export function PendingWithdrawals() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const offset = (page - 1) * pageSize

  const {
    data: withdrawals = [],
    isLoading,
    error,
  } = usePendingWithdrawalsQuery(pageSize, offset)

  if (error) {
    return (
      <ErrorDisplay
        error={error.message || 'Failed to load pending withdrawals'}
        onDismiss={() => window.location.reload()}
      />
    )
  }

  return (
    <WithdrawalsProvider>
      <div className='space-y-4'>
        <WithdrawalsPrimaryButtons />

        <div className='rounded-md border'>
          <WithdrawalsTable
            data={withdrawals}
            isLoading={isLoading}
            pagination={{
              page,
              pageSize,
              total: withdrawals.length, // This would need to be provided by the API
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
            }}
          />
        </div>
      </div>

      <WithdrawalsDialogs />
    </WithdrawalsProvider>
  )
}
