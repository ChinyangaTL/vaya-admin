import { usePageTitle } from '@/hooks/use-page-title'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { NotificationBell } from '@/features/notifications'
import { MetricCards } from './components/metric-cards'
import { RecentTransactions } from './components/recent-transactions'
import { RevenueChart } from './components/revenue-chart'
import {
  useDashboardStats,
  useRealtimeActivity,
} from './hooks/use-dashboard-stats'

export function Dashboard() {
  usePageTitle('Dashboard')

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats()
  const {
    data: realtime,
    isLoading: realtimeLoading,
    error: realtimeError,
  } = useRealtimeActivity()

  if (statsLoading || realtimeLoading) {
    return (
      <div className='flex h-[400px] items-center justify-center'>
        <div className='text-center'>
          <div className='border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
          <p className='text-muted-foreground'>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (statsError || realtimeError) {
    return (
      <div className='flex h-[400px] items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600'>Failed to load dashboard data</p>
          <p className='text-muted-foreground text-sm'>
            {statsError?.message || realtimeError?.message}
          </p>
        </div>
      </div>
    )
  }

  if (!stats || !realtime) {
    return (
      <div className='flex h-[400px] items-center justify-center'>
        <div className='text-center'>
          <p className='text-muted-foreground'>No dashboard data available</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <NotificationBell />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <Button>Download</Button>
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics' disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value='reports' disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value='notifications' disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            {/* Metric Cards */}
            <MetricCards stats={stats} realtime={realtime} />

            {/* Charts and Recent Activity */}
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <RevenueChart stats={stats} />
              <RecentTransactions stats={stats} />
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
]
