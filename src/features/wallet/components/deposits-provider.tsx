import { createContext, useContext, useState } from 'react'
import type { DepositRequest } from '../data/schema'

type DepositsDialogType = 'view' | 'approve' | 'reject' | null

interface DepositsContextType {
  open: DepositsDialogType
  setOpen: (open: DepositsDialogType) => void
  currentDeposit: DepositRequest | null
  setCurrentDeposit: (deposit: DepositRequest | null) => void
  selectedDeposits: DepositRequest[]
  setSelectedDeposits: (deposits: DepositRequest[]) => void
}

const DepositsContext = createContext<DepositsContextType | undefined>(
  undefined
)

export function DepositsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<DepositsDialogType>(null)
  const [currentDeposit, setCurrentDeposit] = useState<DepositRequest | null>(
    null
  )
  const [selectedDeposits, setSelectedDeposits] = useState<DepositRequest[]>([])

  return (
    <DepositsContext.Provider
      value={{
        open,
        setOpen,
        currentDeposit,
        setCurrentDeposit,
        selectedDeposits,
        setSelectedDeposits,
      }}
    >
      {children}
    </DepositsContext.Provider>
  )
}

export function useDeposits() {
  const context = useContext(DepositsContext)
  if (context === undefined) {
    throw new Error('useDeposits must be used within a DepositsProvider')
  }
  return context
}
