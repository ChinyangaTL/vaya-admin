import { useState } from 'react'
import { ErrorDisplay } from '@/components/error-display'
import { usePendingDepositsQuery } from '../hooks/use-wallet-query'
import { DepositsDialogs } from './deposits-dialogs'
import { DepositsPrimaryButtons } from './deposits-primary-buttons'
import { DepositsProvider } from './deposits-provider'
import { DepositsTable } from './deposits-table'

export function PendingDeposits() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const offset = (page - 1) * pageSize

  const {
    data: deposits = [],
    isLoading,
    error,
  } = usePendingDepositsQuery(pageSize, offset)

  if (error) {
    return (
      <ErrorDisplay
        error={error.message || 'Failed to load pending deposits'}
        onDismiss={() => window.location.reload()}
      />
    )
  }

  return (
    <DepositsProvider>
      <div className='space-y-4'>
        <DepositsPrimaryButtons />

        <div className='rounded-md border'>
          <DepositsTable
            data={deposits}
            isLoading={isLoading}
            pagination={{
              page,
              pageSize,
              total: deposits.length, // This would need to be provided by the API
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
            }}
          />
        </div>
      </div>

      <DepositsDialogs />
    </DepositsProvider>
  )
}
