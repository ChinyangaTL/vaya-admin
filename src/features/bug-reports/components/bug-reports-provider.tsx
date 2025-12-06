import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type BugReport } from '../data/schema'

type BugReportsDialogType = 'view' | 'update' | 'delete'

type BugReportsContextType = {
  open: BugReportsDialogType | null
  setOpen: (str: BugReportsDialogType | null) => void
  currentBugReport: BugReport | null
  setCurrentBugReport: (bugReport: BugReport | null) => void
  selectedBugReports: BugReport[]
  setSelectedBugReports: (bugReports: BugReport[]) => void
}

const BugReportsContext = React.createContext<
  BugReportsContextType | undefined
>(undefined)

export function BugReportsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<BugReportsDialogType>()
  const [currentBugReport, setCurrentBugReport] = useState<BugReport | null>(
    null
  )
  const [selectedBugReports, setSelectedBugReports] = useState<BugReport[]>([])

  return (
    <BugReportsContext.Provider
      value={{
        open: open as BugReportsDialogType | null,
        setOpen: setOpen as (str: BugReportsDialogType | null) => void,
        currentBugReport,
        setCurrentBugReport,
        selectedBugReports,
        setSelectedBugReports,
      }}
    >
      {children}
    </BugReportsContext.Provider>
  )
}

export function useBugReports() {
  const context = React.useContext(BugReportsContext)
  if (context === undefined) {
    throw new Error('useBugReports must be used within a BugReportsProvider')
  }
  return context
}

