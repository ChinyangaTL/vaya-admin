import { AlertCircle, Shield } from 'lucide-react'
import { usePageTitle } from '@/hooks/use-page-title'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AdminsDialogs } from './components/admins-dialogs'
import { AdminsPrimaryButtons } from './components/admins-primary-buttons'
import { AdminsProvider } from './components/admins-provider'
import { AdminsTable } from './components/admins-table'
import { useAdminsQuery } from './hooks/use-admins-query'

export function Admins() {
  usePageTitle('Admin Management')

  const { data: admins, isLoading, error } = useAdminsQuery()

  if (isLoading) {
    return (
      <div className='flex h-[400px] items-center justify-center'>
        <div className='text-center'>
          <div className='border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
          <p className='text-muted-foreground'>Loading admins...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex h-[400px] items-center justify-center'>
        <Alert variant='destructive' className='max-w-md'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load admins. {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <AdminsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 space-y-4'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <div className='flex items-center gap-2'>
                <Shield className='text-vaya-orange h-6 w-6' />
                <h2 className='text-2xl font-bold tracking-tight'>
                  Admin Management
                </h2>
              </div>
              <p className='text-muted-foreground mt-1'>
                Manage admin users and permissions
              </p>
            </div>
            <AdminsPrimaryButtons />
          </div>

          <Alert>
            <Shield className='h-4 w-4' />
            <AlertTitle>Security Notice</AlertTitle>
            <AlertDescription>
              Only existing admins can create new admin accounts. Admin accounts
              cannot be created through public registration for security
              reasons.
            </AlertDescription>
          </Alert>
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <AdminsTable data={admins || []} />
        </div>
      </Main>

      <AdminsDialogs />
    </AdminsProvider>
  )
}
