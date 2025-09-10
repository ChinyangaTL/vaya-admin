import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePendingDepositsQuery } from '../hooks/use-wallet-query'

export function DepositsPrimaryButtons() {
  const { refetch, isFetching } = usePendingDepositsQuery()

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
      </div>
    </div>
  )
}
