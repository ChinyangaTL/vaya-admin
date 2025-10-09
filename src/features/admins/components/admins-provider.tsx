import React, { createContext, useContext, useState } from 'react'

interface AdminsContextType {
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
}

const AdminsContext = createContext<AdminsContextType | undefined>(undefined)

export function AdminsProvider({ children }: { children: React.ReactNode }) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <AdminsContext.Provider
      value={{
        isCreateDialogOpen,
        setIsCreateDialogOpen,
      }}
    >
      {children}
    </AdminsContext.Provider>
  )
}

export function useAdminsContext() {
  const context = useContext(AdminsContext)
  if (!context) {
    throw new Error('useAdminsContext must be used within AdminsProvider')
  }
  return context
}

