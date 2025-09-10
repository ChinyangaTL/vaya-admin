import {
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Car,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'
import { type ApprovalStatus, type DocumentType } from './schema'

// Approval Status Configuration
export const approvalStatuses = [
  {
    label: 'Pending',
    value: 'PENDING' as ApprovalStatus,
    icon: Clock,
    color:
      'bg-yellow-100/30 text-yellow-900 dark:text-yellow-200 border-yellow-200',
  },
  {
    label: 'Approved',
    value: 'APPROVED' as ApprovalStatus,
    icon: CheckCircle,
    color:
      'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200',
  },
  {
    label: 'Rejected',
    value: 'REJECTED' as ApprovalStatus,
    icon: XCircle,
    color: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  },
] as const

// Document Types Configuration
export const documentTypes = [
  {
    label: 'Driver License',
    value: 'DRIVER_LICENSE' as DocumentType,
    icon: FileText,
    description: "Valid driver's license",
  },
  {
    label: 'Vehicle Registration',
    value: 'VEHICLE_REGISTRATION' as DocumentType,
    icon: Car,
    description: 'Vehicle registration certificate',
  },
  {
    label: 'Insurance Certificate',
    value: 'INSURANCE_CERTIFICATE' as DocumentType,
    icon: FileText,
    description: 'Vehicle insurance certificate',
  },
  {
    label: 'Road Worthiness',
    value: 'ROAD_WORTHINESS_CERTIFICATE' as DocumentType,
    icon: CheckCircle,
    description: 'Road worthiness certificate',
  },
  {
    label: 'Identity Document',
    value: 'IDENTITY_DOCUMENT' as DocumentType,
    icon: User,
    description: 'National ID or passport',
  },
  {
    label: 'Other',
    value: 'OTHER' as DocumentType,
    icon: FileText,
    description: 'Other supporting documents',
  },
] as const

// Analytics Periods
export const analyticsPeriods = [
  {
    label: 'Daily',
    value: 'daily',
    description: 'View daily analytics',
  },
  {
    label: 'Weekly',
    value: 'weekly',
    description: 'View weekly analytics',
  },
  {
    label: 'Monthly',
    value: 'monthly',
    description: 'View monthly analytics',
  },
  {
    label: 'Yearly',
    value: 'yearly',
    description: 'View yearly analytics',
  },
  {
    label: 'All Time',
    value: 'all-time',
    description: 'View all-time analytics',
  },
] as const

// Driver Profile Fields Configuration
export const driverProfileFields = [
  {
    key: 'user.email',
    label: 'Email',
    icon: Mail,
    type: 'email',
  },
  {
    key: 'user.phone',
    label: 'Phone',
    icon: Phone,
    type: 'phone',
  },
  {
    key: 'license_number',
    label: 'License Number',
    icon: FileText,
    type: 'text',
  },
  {
    key: 'license_expiry',
    label: 'License Expiry',
    icon: Calendar,
    type: 'date',
  },
  {
    key: 'vehicle_registration',
    label: 'Vehicle Registration',
    icon: Car,
    type: 'text',
  },
  {
    key: 'vehicle_make',
    label: 'Vehicle Make',
    icon: Car,
    type: 'text',
  },
  {
    key: 'vehicle_model',
    label: 'Vehicle Model',
    icon: Car,
    type: 'text',
  },
  {
    key: 'vehicle_year',
    label: 'Vehicle Year',
    icon: Calendar,
    type: 'number',
  },
  {
    key: 'vehicle_color',
    label: 'Vehicle Color',
    icon: Car,
    type: 'text',
  },
  {
    key: 'vehicle_capacity',
    label: 'Vehicle Capacity',
    icon: User,
    type: 'number',
  },
] as const

// Performance Metrics Configuration
export const performanceMetrics = [
  {
    key: 'totalTrips',
    label: 'Total Trips',
    icon: MapPin,
    color: 'text-blue-600',
  },
  {
    key: 'completedTrips',
    label: 'Completed Trips',
    icon: CheckCircle,
    color: 'text-green-600',
  },
  {
    key: 'cancelledTrips',
    label: 'Cancelled Trips',
    icon: XCircle,
    color: 'text-red-600',
  },
  {
    key: 'totalPassengers',
    label: 'Total Passengers',
    icon: User,
    color: 'text-purple-600',
  },
  {
    key: 'totalEarnings',
    label: 'Total Earnings',
    icon: CheckCircle,
    color: 'text-green-600',
  },
  {
    key: 'completionRate',
    label: 'Completion Rate',
    icon: CheckCircle,
    color: 'text-blue-600',
  },
] as const
