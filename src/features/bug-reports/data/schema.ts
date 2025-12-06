import { z } from 'zod'

// Bug Report Schema
const bugReportSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  reporter_id: z.string().nullable(),
  reporter_email: z.string().nullable(),
  assigned_to: z.string().nullable(),
  resolution_notes: z.string().nullable(),
  resolved_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  reporter: z
    .object({
      id: z.string(),
      email: z.string().nullable(),
      phone: z.string(),
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
    })
    .nullable()
    .optional(),
})

export type BugReport = z.infer<typeof bugReportSchema>

// Bug Report Status
export const bugReportStatusSchema = z.enum([
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
])
export type BugReportStatus = z.infer<typeof bugReportStatusSchema>

// Bug Report Severity
export const bugReportSeveritySchema = z.enum([
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
])
export type BugReportSeverity = z.infer<typeof bugReportSeveritySchema>

// Status labels and colors
export const bugReportStatusLabels: Record<BugReportStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
}

export const bugReportStatusColors: Record<BugReportStatus, string> = {
  OPEN: 'bg-red-500',
  IN_PROGRESS: 'bg-yellow-500',
  RESOLVED: 'bg-green-500',
  CLOSED: 'bg-gray-500',
}

// Severity labels and colors
export const bugReportSeverityLabels: Record<BugReportSeverity, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
}

export const bugReportSeverityColors: Record<BugReportSeverity, string> = {
  LOW: 'bg-blue-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-orange-500',
  CRITICAL: 'bg-red-500',
}

