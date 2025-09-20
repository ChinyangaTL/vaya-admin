import { usePageTitle } from '@/hooks/use-page-title'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PendingDeposits } from './components/pending-deposits'
import { PendingWithdrawals } from './components/pending-withdrawals'
import { TransactionDebug } from './components/transaction-debug'

export function Wallet() {
  usePageTitle('Wallet Management')

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center gap-2'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Financial Management
          </h2>
          <p className='text-muted-foreground'>
            Manage deposits, withdrawals, and monitor financial transactions.
          </p>
        </div>

        <Tabs defaultValue='deposits' className='space-y-6'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='deposits'>Pending Deposits</TabsTrigger>
            <TabsTrigger value='withdrawals'>Pending Withdrawals</TabsTrigger>
            <TabsTrigger value='debug'>Transaction Debug</TabsTrigger>
          </TabsList>

          <TabsContent value='deposits' className='space-y-4'>
            <PendingDeposits />
          </TabsContent>

          <TabsContent value='withdrawals' className='space-y-4'>
            <PendingWithdrawals />
          </TabsContent>

          <TabsContent value='debug' className='space-y-4'>
            <TransactionDebug />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
