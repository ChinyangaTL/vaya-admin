import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Wallet,
  TrendingUp,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Filter,
} from 'lucide-react'
import { adminAPI } from '@/lib/api-client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ErrorDisplay } from '@/components/error-display'
import { useWalletTrackingStore } from '../stores/wallet-tracking-store'
import { DepositTable } from './deposit-table'
import { TransactionTable } from './transaction-table'
import { WithdrawalTable } from './withdrawal-table'

export function UserWalletDetails() {
  const { selectedUser, clearSelectedUser } = useWalletTrackingStore()
  const [transactionFilters, setTransactionFilters] = useState({
    limit: 50,
    offset: 0,
    type: '',
    date_from: '',
    date_to: '',
  })

  const {
    data: walletSummary,
    isLoading: walletLoading,
    error: walletError,
    refetch: refetchWallet,
  } = useQuery({
    queryKey: ['admin', 'wallet-summary', selectedUser?.id],
    queryFn: () => adminAPI.getAdminUserWalletSummary(selectedUser!.id),
    enabled: !!selectedUser,
  })

  const {
    data: transactions,
    isLoading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ['admin', 'transactions', selectedUser?.id, transactionFilters],
    queryFn: () =>
      adminAPI.getAdminUserTransactionHistory(
        selectedUser!.id,
        transactionFilters
      ),
    enabled: !!selectedUser,
  })

  const {
    data: deposits,
    isLoading: depositsLoading,
    error: depositsError,
    refetch: refetchDeposits,
  } = useQuery({
    queryKey: ['admin', 'deposits', selectedUser?.id],
    queryFn: () => adminAPI.getAdminUserDepositHistory(selectedUser!.id, 50, 0),
    enabled: !!selectedUser,
  })

  const {
    data: withdrawals,
    isLoading: withdrawalsLoading,
    error: withdrawalsError,
    refetch: refetchWithdrawals,
  } = useQuery({
    queryKey: ['admin', 'withdrawals', selectedUser?.id],
    queryFn: () =>
      adminAPI.getAdminUserWithdrawalHistory(selectedUser!.id, 50, 0),
    enabled: !!selectedUser,
  })

  const handleRefresh = () => {
    refetchWallet()
    refetchTransactions()
    refetchDeposits()
    refetchWithdrawals()
  }

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-BW', {
      style: 'currency',
      currency: 'BWP',
    }).format(parseFloat(amount))
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive'
      case 'DRIVER':
        return 'default'
      case 'RIDER':
        return 'secondary'
      case 'FLEET_MANAGER':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  if (!selectedUser) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='py-8 text-center'>
            <Wallet className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <h3 className='mb-2 text-lg font-medium'>No User Selected</h3>
            <p className='text-muted-foreground'>
              Search for a user by email or phone number to view their wallet
              details.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      {/* User Info Header */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Wallet className='h-5 w-5' />
                Wallet Details
              </CardTitle>
              <CardDescription>
                {selectedUser.first_name && selectedUser.last_name
                  ? `${selectedUser.first_name} ${selectedUser.last_name}`
                  : selectedUser.email}
                <Badge
                  variant={getRoleBadgeVariant(selectedUser.role)}
                  className='ml-2'
                >
                  {selectedUser.role}
                </Badge>
              </CardDescription>
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' size='sm' onClick={handleRefresh}>
                <RefreshCw className='h-4 w-4' />
              </Button>
              <Button variant='outline' size='sm' onClick={clearSelectedUser}>
                Clear Selection
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Wallet Summary */}
      {walletLoading ? (
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-center py-8'>
              <RefreshCw className='h-6 w-6 animate-spin' />
              <span className='ml-2'>Loading wallet summary...</span>
            </div>
          </CardContent>
        </Card>
      ) : walletError ? (
        <ErrorDisplay
          error={walletError.message || 'Failed to load wallet summary'}
          onDismiss={() => {}}
        />
      ) : walletSummary ? (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='h-5 w-5' />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-green-600'>
              {formatCurrency(walletSummary.formatted_balance)}
            </div>
            <p className='text-muted-foreground mt-1 text-sm'>
              Raw balance: {walletSummary.balance} {walletSummary.currency}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {/* Transaction Filters */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Filter className='h-5 w-5' />
            Transaction Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            <div>
              <Label htmlFor='transaction-type'>Transaction Type</Label>
              <Select
                value={transactionFilters.type}
                onValueChange={(value) =>
                  setTransactionFilters((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='All types' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=''>All types</SelectItem>
                  <SelectItem value='DEPOSIT'>Deposit</SelectItem>
                  <SelectItem value='WITHDRAWAL'>Withdrawal</SelectItem>
                  <SelectItem value='TRIP_PAYMENT'>Trip Payment</SelectItem>
                  <SelectItem value='TRIP_REFUND'>Trip Refund</SelectItem>
                  <SelectItem value='QR_PAYMENT'>QR Payment</SelectItem>
                  <SelectItem value='ADMIN_ADJUSTMENT'>
                    Admin Adjustment
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor='date-from'>From Date</Label>
              <Input
                id='date-from'
                type='date'
                value={transactionFilters.date_from}
                onChange={(e) =>
                  setTransactionFilters((prev) => ({
                    ...prev,
                    date_from: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor='date-to'>To Date</Label>
              <Input
                id='date-to'
                type='date'
                value={transactionFilters.date_to}
                onChange={(e) =>
                  setTransactionFilters((prev) => ({
                    ...prev,
                    date_to: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor='limit'>Limit</Label>
              <Input
                id='limit'
                type='number'
                value={transactionFilters.limit}
                onChange={(e) =>
                  setTransactionFilters((prev) => ({
                    ...prev,
                    limit: parseInt(e.target.value) || 50,
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History Tabs */}
      <Tabs defaultValue='transactions' className='space-y-4'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='transactions' className='flex items-center gap-2'>
            <History className='h-4 w-4' />
            Transactions
          </TabsTrigger>
          <TabsTrigger value='deposits' className='flex items-center gap-2'>
            <ArrowUpRight className='h-4 w-4' />
            Deposits
          </TabsTrigger>
          <TabsTrigger value='withdrawals' className='flex items-center gap-2'>
            <ArrowDownLeft className='h-4 w-4' />
            Withdrawals
          </TabsTrigger>
        </TabsList>

        <TabsContent value='transactions' className='space-y-4'>
          <TransactionTable
            transactions={transactions || []}
            isLoading={transactionsLoading}
            error={transactionsError}
          />
        </TabsContent>

        <TabsContent value='deposits' className='space-y-4'>
          <DepositTable
            deposits={deposits || []}
            isLoading={depositsLoading}
            error={depositsError}
          />
        </TabsContent>

        <TabsContent value='withdrawals' className='space-y-4'>
          <WithdrawalTable
            withdrawals={withdrawals || []}
            isLoading={withdrawalsLoading}
            error={withdrawalsError}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

