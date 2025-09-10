import { RefreshCw, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { usePendingDriversQuery } from '../hooks/use-pending-drivers-query'
import { usePendingDrivers } from './pending-drivers-provider'

export function PendingDriversPrimaryButtons() {
  const { refetch, isFetching } = usePendingDriversQuery()
  const { setOpen } = usePendingDrivers()

  const handleRefresh = () => {
    refetch()
  }

  const handleViewAll = () => {
    setOpen('view')
  }

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='outline'
        size='sm'
        onClick={handleRefresh}
        disabled={isFetching}
        className='h-8'
      >
        <RefreshCw
          className={cn('mr-2 h-4 w-4', isFetching && 'animate-spin')}
        />
        Refresh
      </Button>
      <Button
        variant='outline'
        size='sm'
        onClick={handleViewAll}
        className='h-8'
      >
        <Users className='mr-2 h-4 w-4' />
        View All Drivers
      </Button>
    </div>
  )
}
