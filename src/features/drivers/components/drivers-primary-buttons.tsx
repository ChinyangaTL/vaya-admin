import { Plus, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAllDriversQuery } from '../hooks/use-drivers-query'
import { useDrivers } from './drivers-provider'

export function DriversPrimaryButtons() {
  const { setOpen } = useDrivers()
  const { refetch, isFetching } = useAllDriversQuery()

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='outline'
        size='sm'
        onClick={() => refetch()}
        disabled={isFetching}
      >
        <RefreshCw
          className={cn('mr-2 h-4 w-4', isFetching && 'animate-spin')}
        />
        Refresh
      </Button>

      <Button size='sm' onClick={() => setOpen('view')}>
        <Plus className='mr-2 h-4 w-4' />
        View All Drivers
      </Button>
    </div>
  )
}
