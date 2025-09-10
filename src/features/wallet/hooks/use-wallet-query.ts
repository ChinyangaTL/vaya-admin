import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '@/lib/api-client'
import type {
  DepositRequest,
  WithdrawalRequest,
  Transaction,
} from '../data/schema'

// Pending Deposits
export function usePendingDepositsQuery(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['wallet', 'deposits', 'pending', { limit, offset }],
    queryFn: async () => {
      try {
        const response = await adminAPI.getPendingDeposits(limit, offset)
        return response as DepositRequest[]
      } catch (error) {
        console.error('Failed to fetch pending deposits:', error)
        return [] as DepositRequest[]
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

export function useApproveDepositMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      depositId,
      adminNotes,
    }: {
      depositId: string
      adminNotes?: string
    }) => {
      return await adminAPI.approveDeposit(depositId, adminNotes)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', 'deposits'] })
    },
  })
}

export function useRejectDepositMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      depositId,
      adminNotes,
    }: {
      depositId: string
      adminNotes: string
    }) => {
      return await adminAPI.rejectDeposit(depositId, adminNotes)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', 'deposits'] })
    },
  })
}

// Pending Withdrawals
export function usePendingWithdrawalsQuery(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['wallet', 'withdrawals', 'pending', { limit, offset }],
    queryFn: async () => {
      try {
        const response = await adminAPI.getPendingWithdrawals(limit, offset)
        return response as WithdrawalRequest[]
      } catch (error) {
        console.error('Failed to fetch pending withdrawals:', error)
        return [] as WithdrawalRequest[]
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

export function useApproveWithdrawalMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      withdrawalId,
      adminNotes,
    }: {
      withdrawalId: string
      adminNotes?: string
    }) => {
      return await adminAPI.approveWithdrawal(withdrawalId, adminNotes)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', 'withdrawals'] })
    },
  })
}

export function useRejectWithdrawalMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      withdrawalId,
      adminNotes,
    }: {
      withdrawalId: string
      adminNotes: string
    }) => {
      return await adminAPI.rejectWithdrawal(withdrawalId, adminNotes)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', 'withdrawals'] })
    },
  })
}

// Transaction Debug
export function useDebugTransactionsQuery() {
  return useQuery({
    queryKey: ['wallet', 'debug', 'transactions'],
    queryFn: async () => {
      try {
        const response = await adminAPI.debugTransactions()
        return response as Transaction[]
      } catch (error) {
        console.error('Failed to fetch debug transactions:', error)
        return [] as Transaction[]
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

// Deposit Proof URL
export function useDepositProofUrlQuery(depositId: string) {
  return useQuery({
    queryKey: ['wallet', 'deposit-proof', depositId],
    queryFn: async () => {
      try {
        const response = await adminAPI.getDepositProofUrl(depositId)
        return response
      } catch (error) {
        console.error('Failed to fetch deposit proof URL:', error)
        return null
      }
    },
    enabled: !!depositId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
