import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useAdminsContext } from './admins-provider'

export function AdminsPrimaryButtons() {
  const { setIsCreateDialogOpen } = useAdminsContext()

  return (
    <div className='flex items-center space-x-2'>
      <Button onClick={() => setIsCreateDialogOpen(true)}>
        <PlusCircle className='mr-2 size-4' aria-hidden='true' />
        Create Admin
      </Button>
    </div>
  )
}

