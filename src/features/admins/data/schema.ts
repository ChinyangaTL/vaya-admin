import { z } from 'zod'

export const adminSchema = z.object({
  id: z.string(),
  email: z.string().nullable(),
  phone: z.string(),
  role: z.enum(['ADMIN']),
  active: z.boolean(),
  created_at: z.string(),
})

export type Admin = z.infer<typeof adminSchema>

export const createAdminSchema = z.object({
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(12, 'Phone number must be in format +267XXXXXXXX'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type CreateAdminInput = z.infer<typeof createAdminSchema>

