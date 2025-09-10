import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { usePageTitle } from '@/hooks/use-page-title'
import { DriversDialogs } from './components/drivers-dialogs'
import { DriversPrimaryButtons } from './components/drivers-primary-buttons'
import { DriversProvider } from './components/drivers-provider'
import { DriversTable } from './components/drivers-table'
import { useAllDriversQuery } from './hooks/use-drivers-query'

const route = getRouteApi('/_authenticated/drivers/')

export function Drivers() {
  usePageTitle('Drivers')
  
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { data: drivers = [], isLoading, error } = useAllDriversQuery()

  return (
    <DriversProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center gap-2'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Driver Management
            </h2>
            <p className='text-muted-foreground'>
              View all drivers, monitor performance, and manage driver
              information.
            </p>
          </div>
          <DriversPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-muted-foreground'>Loading drivers...</div>
            </div>
          ) : error ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-destructive'>
                Failed to load drivers. Please try again.
              </div>
            </div>
          ) : (
            <DriversTable
              data={drivers}
              search={search as Record<string, unknown>}
              navigate={navigate}
            />
          )}
        </div>
      </Main>

      <DriversDialogs />
    </DriversProvider>
  )
}
