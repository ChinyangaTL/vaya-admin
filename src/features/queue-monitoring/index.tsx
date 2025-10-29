import { usePageTitle } from '@/hooks/use-page-title'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { QueueMonitoring } from './components/queue-monitoring'

export function QueueMonitoringPage() {
  usePageTitle('Queue Monitoring')

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-6 flex items-center justify-between space-y-2'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              Queue Monitoring
            </h1>
            <p className='text-muted-foreground'>
              Monitor and manage BullMQ background job queues for payment
              processing optimization
            </p>
          </div>
        </div>

        <QueueMonitoring />
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Queue Monitoring',
    href: 'queue-monitoring',
    isActive: true,
    disabled: false,
  },
]



