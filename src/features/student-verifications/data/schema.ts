import { z } from 'zod'

// Student Verification Schema - Matches actual API response
const studentVerificationSchema = z.object({
  id: z.string(),
  email: z.string(),
  phone: z.string(),
  student_id: z.string().nullable(),
  university_name: z.string().nullable(),
  student_id_document_path: z.string().nullable(),
  face_scan_path: z.string().nullable(),
  verification_submitted_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})

export type StudentVerification = z.infer<typeof studentVerificationSchema>

// Student Verification Status Schema
export const studentVerificationStatusSchema = z.enum([
  'NOT_APPLIED',
  'PENDING',
  'APPROVED',
  'REJECTED',
])
export type StudentVerificationStatus = z.infer<
  typeof studentVerificationStatusSchema
>

