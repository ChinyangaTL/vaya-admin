import { z } from 'zod'

// Pending Driver Profile Schema - Matches actual API response
const pendingDriverProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  approval_status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  route: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  licensePlate: z.string().optional(),
  // Related data
  user: z.object({
    id: z.string(),
    email: z.string(),
    phone: z.string().optional(),
    password_hash: z.string().optional(),
    role: z.string(),
    fleet_id: z.string().nullable(),
    individual_driver: z.boolean(),
    active: z.boolean(),
    email_verified: z.boolean(),
    phone_verified: z.boolean(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
  }),
  documents: z.array(
    z.object({
      id: z.string(),
      driverProfileId: z.string(),
      document_type: z.string(),
      file_path: z.string(),
      uploaded_at: z.coerce.date(),
    })
  ),
})

export type PendingDriverProfile = z.infer<typeof pendingDriverProfileSchema>

// Approval Status Schema
export const approvalStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED'])
export type ApprovalStatus = z.infer<typeof approvalStatusSchema>

// Document Type Schema
export const documentTypeSchema = z.enum([
  'DRIVERS_LICENSE',
  'VEHICLE_REGISTRATION',
  'INSURANCE',
  'PUBLIC_TRANSPORT_PERMIT',
  'ROAD_WORTHINESS_CERTIFICATE',
  'IDENTITY_DOCUMENT',
  'OTHER',
])
export type DocumentType = z.infer<typeof documentTypeSchema>
