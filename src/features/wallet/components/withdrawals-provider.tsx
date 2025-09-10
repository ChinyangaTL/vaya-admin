import { createContext, useContext, useState } from 'react'
import type { WithdrawalRequest } from '../data/schema'

type WithdrawalsDialogType = 'view' | 'approve' | 'reject' | null

interface WithdrawalsContextType {
  open: WithdrawalsDialogType
  setOpen: (open: WithdrawalsDialogType) => void
  currentWithdrawal: WithdrawalRequest | null
  setCurrentWithdrawal: (withdrawal: WithdrawalRequest | null) => void
  selectedWithdrawals: WithdrawalRequest[]
  setSelectedWithdrawals: (withdrawals: WithdrawalRequest[]) => void
}

const WithdrawalsContext = createContext<WithdrawalsContextType | undefined>(
  undefined
)

export function WithdrawalsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState<WithdrawalsDialogType>(null)
  const [currentWithdrawal, setCurrentWithdrawal] =
    useState<WithdrawalRequest | null>(null)
  const [selectedWithdrawals, setSelectedWithdrawals] = useState<
    WithdrawalRequest[]
  >([])

  return (
    <WithdrawalsContext.Provider
      value={{
        open,
        setOpen,
        currentWithdrawal,
        setCurrentWithdrawal,
        selectedWithdrawals,
        setSelectedWithdrawals,
      }}
    >
      {children}
    </WithdrawalsContext.Provider>
  )
}

export function useWithdrawals() {
  const context = useContext(WithdrawalsContext)
  if (context === undefined) {
    throw new Error('useWithdrawals must be used within a WithdrawalsProvider')
  }
  return context
}
