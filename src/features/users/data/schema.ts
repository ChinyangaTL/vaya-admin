import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([
  z.literal('RIDER'),
  z.literal('DRIVER'),
  z.literal('FLEET_MANAGER'),
  z.literal('ADMIN'),
])

const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  role: userRoleSchema,
  is_active: z.boolean().optional(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  // Optional fields that might be present
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  profile_picture: z.string().optional(),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)
