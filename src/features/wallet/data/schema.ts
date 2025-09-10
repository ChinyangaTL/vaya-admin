import { z } from 'zod'

// Transaction types
export const transactionTypeSchema = z.enum([
  'DEPOSIT',
  'WITHDRAWAL',
  'TRIP_PAYMENT',
  'TRIP_REFUND',
  'QR_PAYMENT',
  'ADMIN_ADJUSTMENT',
])

// Deposit request status
export const depositStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED'])

// Withdrawal request status
export const withdrawalStatusSchema = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
])

// Wallet summary schema
export const walletSummarySchema = z.object({
  balance: z.string(),
  formatted_balance: z.string(),
  currency: z.string(),
})

// Transaction schema
export const transactionSchema = z.object({
  id: z.string(),
  amount: z.string(),
  type: transactionTypeSchema,
  description: z.string(),
  status: z.string(),
  previous_balance: z.string(),
  new_balance: z.string(),
  created_at: z.string(),
})

// Deposit request schema
export const depositRequestSchema = z.object({
  id: z.string(),
  amount: z.string(),
  proof_file_path: z.string().nullable(),
  bank_reference: z.string().nullable(),
  status: depositStatusSchema,
  admin_notes: z.string().nullable(),
  processed_by: z.string().nullable(),
  processed_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  user: z
    .object({
      id: z.string(),
      email: z.string(),
      phone: z.string().nullable(),
    })
    .optional(),
})

// Withdrawal request schema
export const withdrawalRequestSchema = z.object({
  id: z.string(),
  amount: z.string(),
  bank_account: z.string(),
  status: withdrawalStatusSchema,
  admin_notes: z.string().nullable(),
  created_at: z.string(),
  user: z
    .object({
      id: z.string(),
      email: z.string(),
      phone: z.string().nullable(),
    })
    .optional(),
})

// Types
export type TransactionType = z.infer<typeof transactionTypeSchema>
export type DepositStatus = z.infer<typeof depositStatusSchema>
export type WithdrawalStatus = z.infer<typeof withdrawalStatusSchema>
export type WalletSummary = z.infer<typeof walletSummarySchema>
export type Transaction = z.infer<typeof transactionSchema>
export type DepositRequest = z.infer<typeof depositRequestSchema>
export type WithdrawalRequest = z.infer<typeof withdrawalRequestSchema>
