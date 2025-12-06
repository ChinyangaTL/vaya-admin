import { useState } from 'react'
import { Bug, Loader2 } from 'lucide-react'
import { usePageTitle } from '@/hooks/use-page-title'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { NotificationBell } from '@/features/notifications'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BugReportsDialogs } from './components/bug-reports-dialogs'
import { BugReportsProvider } from './components/bug-reports-provider'
import { BugReportsTable } from './components/bug-reports-table'
import { useBugReportsQuery } from './hooks/use-bug-reports-query'

export function BugReports() {
  usePageTitle('Bug Reports')

  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'resolved'>('all')

  // Fetch bug reports based on active tab
  const { data: allBugs = [], isLoading: isLoadingAll } = useBugReportsQuery()
  const { data: openBugs = [], isLoading: isLoadingOpen } = useBugReportsQuery({
    status: 'OPEN',
  })
  const { data: resolvedBugs = [], isLoading: isLoadingResolved } =
    useBugReportsQuery({ status: 'RESOLVED' })

  const getBugsForTab = () => {
    switch (activeTab) {
      case 'open':
        return openBugs
      case 'resolved':
        return resolvedBugs
      default:
        return allBugs
    }
  }

  const isLoading =
    activeTab === 'all'
      ? isLoadingAll
      : activeTab === 'open'
        ? isLoadingOpen
        : isLoadingResolved

  return (
    <BugReportsProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center gap-2'>
          <NotificationBell />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight flex items-center gap-2'>
              <Bug className='h-6 w-6' />
              Bug Reports
            </h2>
            <p className='text-muted-foreground'>
              Manage and track bug reports submitted by users. Update status,
              add resolution notes, and monitor bug resolution progress.
            </p>
          </div>
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList>
              <TabsTrigger value='all'>All Bugs</TabsTrigger>
              <TabsTrigger value='open'>Open</TabsTrigger>
              <TabsTrigger value='resolved'>Resolved</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className='mt-6'>
              {isLoading ? (
                <div className='flex items-center justify-center py-12'>
                  <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
                </div>
              ) : (
                <BugReportsTable data={getBugsForTab()} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Main>

      <BugReportsDialogs />
    </BugReportsProvider>
  )
}

