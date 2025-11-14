import { usePageTitle } from '@/hooks/use-page-title'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { NotificationBell } from '@/features/notifications'
import { UserSearch } from './components/user-search'
import { UserWalletDetails } from './components/user-wallet-details'
import { useWalletTrackingStore } from './stores/wallet-tracking-store'
import { useEffect, useState } from 'react'

export function WalletTracking() {
  usePageTitle('Wallet Tracking')
  const [activeTab, setActiveTab] = useState('search')
  const { selectedUser, clearSelectedUser } = useWalletTrackingStore()

  useEffect(() => {
    if (selectedUser) {
      setActiveTab('details')
    }
  }, [selectedUser])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === 'search') {
      clearSelectedUser()
    }
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center gap-2'>
          <NotificationBell />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Wallet Tracking & Audit Trail
          </h2>
          <p className='text-muted-foreground'>
            Search for users by email or phone number to view their wallet
            information and transaction history.
          </p>
        </div>

        <Tabs
          defaultValue='search'
          className='space-y-6'
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='search'>Search Users</TabsTrigger>
            <TabsTrigger value='details'>Wallet Details</TabsTrigger>
          </TabsList>

          <TabsContent value='search' className='space-y-4'>
            <UserSearch />
          </TabsContent>

          <TabsContent value='details' className='space-y-4'>
            <UserWalletDetails />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

