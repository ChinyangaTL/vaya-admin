import { z } from 'zod'

export const notificationTypeSchema = z.enum([
  'DRIVER_REGISTRATION',
  'DEPOSIT_REQUEST',
  'WITHDRAWAL_REQUEST',
  'STUDENT_VERIFICATION',
  'SYSTEM_ALERT',
])

export const notificationPrioritySchema = z.enum([
  'LOW',
  'NORMAL',
  'HIGH',
  'URGENT',
])

export const notificationSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  type: notificationTypeSchema,
  title: z.string(),
  message: z.string(),
  data: z.record(z.any()).optional(),
  priority: notificationPrioritySchema,
  isRead: z.boolean(),
  readAt: z.string().nullable(),
  expiresAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const notificationStatsSchema = z.object({
  totalNotifications: z.number(),
  unreadNotifications: z.number(),
  notificationsByType: z.record(z.number()),
  recentNotifications: z.array(notificationSchema),
})

export const notificationsResponseSchema = z.object({
  notifications: z.array(notificationSchema),
  pagination: z.object({
    totalCount: z.number(),
    unreadCount: z.number(),
    limit: z.number(),
    offset: z.number(),
  }),
})

export type NotificationType = z.infer<typeof notificationTypeSchema>
export type NotificationPriority = z.infer<typeof notificationPrioritySchema>
export type Notification = z.infer<typeof notificationSchema>
export type NotificationStats = z.infer<typeof notificationStatsSchema>
export type NotificationsResponse = z.infer<typeof notificationsResponseSchema>

// Notification type labels for display
export const notificationTypeLabels: Record<NotificationType, string> = {
  DRIVER_REGISTRATION: 'Driver Registration',
  DEPOSIT_REQUEST: 'Deposit Request',
  WITHDRAWAL_REQUEST: 'Withdrawal Request',
  STUDENT_VERIFICATION: 'Student Verification',
  SYSTEM_ALERT: 'System Alert',
}

// Priority labels and colors
export const notificationPriorityLabels: Record<NotificationPriority, string> =
  {
    LOW: 'Low',
    NORMAL: 'Normal',
    HIGH: 'High',
    URGENT: 'Urgent',
  }

export const notificationPriorityColors: Record<NotificationPriority, string> =
  {
    LOW: 'text-gray-500',
    NORMAL: 'text-blue-500',
    HIGH: 'text-orange-500',
    URGENT: 'text-red-500',
  }
