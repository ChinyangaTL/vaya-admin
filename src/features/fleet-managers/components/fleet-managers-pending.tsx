import { FleetManagerCard } from './fleet-manager-card'
import { usePendingFleetManagers } from '../hooks/use-pending-fleet-managers'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ErrorDisplay } from '@/components/error-display'

export function FleetManagersPending() {
  const { data, isLoading, error } = usePendingFleetManagers()

  if (isLoading) {
    return (
      <div className='flex h-[400px] items-center justify-center'>
        <div className='text-center'>
          <div className='border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
          <p className='text-muted-foreground'>Loading pending fleet managers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorDisplay
        error={(error as Error).message || 'Failed to load pending fleet managers'}
        onDismiss={() => {}}
      />
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Pending Fleet Managers</h1>
          <p className='text-muted-foreground'>
            Review and approve fleet manager applications.
          </p>
        </div>
        <ProfileDropdown />
      </div>

      <div className='grid grid-cols-1 gap-4'>
        {data && data.length > 0 ? (
          data.map((profile) => (
            <FleetManagerCard key={profile.id} profile={profile} showActions />
          ))
        ) : (
          <div className='rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground'>
            No pending fleet managers.
          </div>
        )}
      </div>
    </div>
  )
}

