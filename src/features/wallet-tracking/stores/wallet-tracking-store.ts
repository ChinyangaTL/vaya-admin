import { create } from 'zustand'

interface User {
  id: string
  email: string
  phone?: string
  role: string
  first_name?: string
  last_name?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface WalletTrackingState {
  selectedUser: User | null
  setSelectedUser: (user: User | null) => void
  clearSelectedUser: () => void
}

export const useWalletTrackingStore = create<WalletTrackingState>((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
  clearSelectedUser: () => set({ selectedUser: null }),
}))

