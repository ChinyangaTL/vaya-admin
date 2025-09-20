import { getRouteApi } from '@tanstack/react-router'
import { usePageTitle } from '@/hooks/use-page-title'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { ErrorDisplay } from '../../components/error-display'
import { ProfileDropdown } from '../../components/profile-dropdown'
import { Search } from '../../components/search'
import { StudentVerificationsDialogs } from './components/student-verifications-dialogs'
import { StudentVerificationsPrimaryButtons } from './components/student-verifications-primary-buttons'
import { StudentVerificationsProvider } from './components/student-verifications-provider'
import { StudentVerificationsTable } from './components/student-verifications-table'
import { useStudentVerificationsQuery } from './hooks/use-student-verifications-query'

const route = getRouteApi('/_authenticated/student-verifications/')

export function StudentVerifications() {
  usePageTitle('Student Verifications')

  const search = route.useSearch()
  const navigate = route.useNavigate() as NavigateFn
  const { data, isLoading, error } = useStudentVerificationsQuery()

  if (isLoading) {
    return (
      <div className='flex h-[400px] items-center justify-center'>
        <div className='text-center'>
          <div className='border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
          <p className='text-muted-foreground'>
            Loading student verifications...
          </p>
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
    <StudentVerificationsProvider>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              Student Verifications
            </h1>
            <p className='text-muted-foreground'>
              Review and approve student verification applications for
              discounted fares.
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <Search />
            <ProfileDropdown />
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <StudentVerificationsPrimaryButtons />
          </div>
        </div>

        <StudentVerificationsTable
          data={data || []}
          search={search as Record<string, unknown>}
          navigate={navigate}
        />
        <StudentVerificationsDialogs />
      </div>
    </StudentVerificationsProvider>
  )
}
