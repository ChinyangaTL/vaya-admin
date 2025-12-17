import { ApprovalStatus } from '@/types/common'

export interface FleetManagerDocument {
  id: string
  document_type: string
  file_path: string
  uploaded_at: string
}

export interface FleetManagerProfile {
  id: string
  userId?: string
  companyName: string
  companyRegistration?: string | null
  companyAddress?: string | null
  companyPhone?: string | null
  companyEmail?: string | null
  taxNumber?: string | null
  fleetId?: string | null
  approval_status: ApprovalStatus
  created_at?: string
  updated_at?: string
  documents?: FleetManagerDocument[]
  user?: {
    id: string
    email: string | null
    phone: string | null
  }
}

