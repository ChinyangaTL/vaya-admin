import { createContext, useContext, useState } from 'react'
import { type PendingDriverProfile } from '../data/schema'

type PendingDriversDialogType = 'view' | 'approve' | 'reject'

interface PendingDriversContextType {
  open: PendingDriversDialogType | null
  setOpen: (str: PendingDriversDialogType | null) => void
  currentDriver: PendingDriverProfile | null
  setCurrentDriver: (driver: PendingDriverProfile | null) => void
  selectedDrivers: PendingDriverProfile[]
  setSelectedDrivers: (drivers: PendingDriverProfile[]) => void
}

const PendingDriversContext = createContext<
  PendingDriversContextType | undefined
>(undefined)

export function PendingDriversProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState<PendingDriversDialogType | null>(null)
  const [currentDriver, setCurrentDriver] =
    useState<PendingDriverProfile | null>(null)
  const [selectedDrivers, setSelectedDrivers] = useState<
    PendingDriverProfile[]
  >([])

  return (
    <PendingDriversContext.Provider
      value={{
        open: open as PendingDriversDialogType | null,
        setOpen: setOpen as (str: PendingDriversDialogType | null) => void,
        currentDriver,
        setCurrentDriver,
        selectedDrivers,
        setSelectedDrivers,
      }}
    >
      {children}
    </PendingDriversContext.Provider>
  )
}

export function usePendingDrivers() {
  const context = useContext(PendingDriversContext)
  if (context === undefined) {
    throw new Error(
      'usePendingDrivers must be used within a PendingDriversProvider'
    )
  }
  return context
}



