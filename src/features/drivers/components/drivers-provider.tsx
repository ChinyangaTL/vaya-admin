import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type DriverProfile } from '../data/schema'

type DriversDialogType =
  | 'approve'
  | 'reject'
  | 'view'
  | 'performance'
  | 'earnings'
  | 'analytics'

type DriversContextType = {
  open: DriversDialogType | null
  setOpen: (str: DriversDialogType | null) => void
  currentDriver: DriverProfile | null
  setCurrentDriver: (driver: DriverProfile | null) => void
  selectedDrivers: DriverProfile[]
  setSelectedDrivers: (drivers: DriverProfile[]) => void
}

const DriversContext = React.createContext<DriversContextType | undefined>(
  undefined
)

export function DriversProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DriversDialogType>()
  const [currentDriver, setCurrentDriver] = useState<DriverProfile | null>(null)
  const [selectedDrivers, setSelectedDrivers] = useState<DriverProfile[]>([])

  return (
    <DriversContext.Provider
      value={{
        open: open as DriversDialogType | null,
        setOpen: setOpen as (str: DriversDialogType | null) => void,
        currentDriver,
        setCurrentDriver,
        selectedDrivers,
        setSelectedDrivers,
      }}
    >
      {children}
    </DriversContext.Provider>
  )
}

export function useDrivers() {
  const context = React.useContext(DriversContext)
  if (context === undefined) {
    throw new Error('useDrivers must be used within a DriversProvider')
  }
  return context
}
