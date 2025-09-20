import { RefreshCw, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useStudentVerificationsQuery } from '../hooks/use-student-verifications-query'
import { useStudentVerifications } from './student-verifications-provider'

export function StudentVerificationsPrimaryButtons() {
  const { refetch, isFetching } = useStudentVerificationsQuery()
  const { setOpen } = useStudentVerifications()

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
        <GraduationCap className='mr-2 h-4 w-4' />
        View All Verifications
      </Button>
    </div>
  )
}
