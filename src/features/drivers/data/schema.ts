import { z } from 'zod'

// Driver Profile Schema - Updated to match actual API response
const driverProfileSchema = z.object({
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

export type DriverProfile = z.infer<typeof driverProfileSchema>

// Driver Performance Schema
const driverPerformanceSchema = z.object({
  totalTrips: z.number(),
  completedTrips: z.number(),
  cancelledTrips: z.number(),
  totalPassengers: z.number(),
  totalEarnings: z.string(),
  avgPassengersPerTrip: z.string(),
  completionRate: z.string(),
  recentTrips: z.array(
    z.object({
      id: z.string(),
      route: z.string(),
      scheduled_start_time: z.coerce.date(),
      status: z.string(),
      passenger_count: z.number(),
      earnings: z.string(),
    })
  ),
})

export type DriverPerformance = z.infer<typeof driverPerformanceSchema>

// Driver Earnings Schema
const driverEarningsSchema = z.object({
  totalEarnings: z.string(),
  tripCount: z.number(),
  passengerCount: z.number(),
  avgEarningsPerTrip: z.string(),
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly', 'all-time']),
  periodData: z.array(
    z.object({
      period: z.string(),
      earnings: z.string(),
      trips: z.number(),
      passengers: z.number(),
      date: z.coerce.date().optional(),
    })
  ),
})

export type DriverEarnings = z.infer<typeof driverEarningsSchema>

// Driver Analytics Schema
const driverAnalyticsSchema = z.object({
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly', 'all-time']),
  totalEarnings: z.string(),
  tripCount: z.number(),
  passengerCount: z.string(),
  avgEarningsPerTrip: z.string(),
  avgPassengersPerTrip: z.string(),
  completionRate: z.string(),
  periodData: z.array(
    z.object({
      period: z.string(),
      earnings: z.string(),
      trips: z.number(),
      passengers: z.number(),
      date: z.coerce.date().optional(),
    })
  ),
})

export type DriverAnalytics = z.infer<typeof driverAnalyticsSchema>

// Approval Status Schema
export const approvalStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED'])
export type ApprovalStatus = z.infer<typeof approvalStatusSchema>

// Document Type Schema
export const documentTypeSchema = z.enum([
  'DRIVER_LICENSE',
  'VEHICLE_REGISTRATION',
  'INSURANCE_CERTIFICATE',
  'ROAD_WORTHINESS_CERTIFICATE',
  'IDENTITY_DOCUMENT',
  'OTHER',
])
export type DocumentType = z.infer<typeof documentTypeSchema>
