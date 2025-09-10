import { getRouteApi } from '@tanstack/react-router'
import { usePageTitle } from '@/hooks/use-page-title'
import { ErrorDisplay } from '../../components/error-display'
import { ProfileDropdown } from '../../components/profile-dropdown'
import { Search } from '../../components/search'
import { PendingDriversDialogs } from './components/pending-drivers-dialogs'
import { PendingDriversPrimaryButtons } from './components/pending-drivers-primary-buttons'
import { PendingDriversProvider } from './components/pending-drivers-provider'
import { PendingDriversTable } from './components/pending-drivers-table'
import { usePendingDriversQuery } from './hooks/use-pending-drivers-query'

const route = getRouteApi('/_authenticated/pending-drivers/')

export function PendingDrivers() {
  usePageTitle('Pending Drivers')

  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { data, isLoading, error } = usePendingDriversQuery()

  if (isLoading) {
    return (
      <div className='flex h-[400px] items-center justify-center'>
        <div className='text-center'>
          <div className='border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
          <p className='text-muted-foreground'>Loading pending drivers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error.message || 'An error occurred'}
        onDismiss={() => {}}
      />
    )
  }

  return (
    <PendingDriversProvider>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              Pending Drivers
            </h1>
            <p className='text-muted-foreground'>
              Review and approve driver applications for the Vaya platform.
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <Search />
            <ProfileDropdown />
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <PendingDriversPrimaryButtons />
          </div>
        </div>

        <PendingDriversTable
          data={data || []}
          search={search as Record<string, unknown>}
          navigate={navigate}
        />
        <PendingDriversDialogs />
      </div>
    </PendingDriversProvider>
  )
}
