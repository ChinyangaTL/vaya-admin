import { type ApprovalStatus, type DocumentType } from './schema'

export const approvalStatuses: Array<{
  label: string
  value: ApprovalStatus
  icon: string
  color: string
}> = [
  {
    label: 'Pending',
    value: 'PENDING',
    icon: 'Clock',
    color: 'text-yellow-600 border-yellow-200 bg-yellow-50',
  },
  {
    label: 'Approved',
    value: 'APPROVED',
    icon: 'CheckCircle',
    color: 'text-green-600 border-green-200 bg-green-50',
  },
  {
    label: 'Rejected',
    value: 'REJECTED',
    icon: 'XCircle',
    color: 'text-red-600 border-red-200 bg-red-50',
  },
]

export const documentTypes: Array<{
  label: string
  value: DocumentType
  icon: string
  color: string
}> = [
  {
    label: 'Driver License',
    value: 'DRIVERS_LICENSE',
    icon: 'IdCard',
    color: 'text-blue-600',
  },
  {
    label: 'Vehicle Registration',
    value: 'VEHICLE_REGISTRATION',
    icon: 'Car',
    color: 'text-green-600',
  },
  {
    label: 'Insurance',
    value: 'INSURANCE',
    icon: 'Shield',
    color: 'text-purple-600',
  },
  {
    label: 'Public Transport Permit',
    value: 'PUBLIC_TRANSPORT_PERMIT',
    icon: 'FileText',
    color: 'text-orange-600',
  },
  {
    label: 'Road Worthiness',
    value: 'ROAD_WORTHINESS_CERTIFICATE',
    icon: 'CheckCircle',
    color: 'text-emerald-600',
  },
  {
    label: 'Identity Document',
    value: 'IDENTITY_DOCUMENT',
    icon: 'User',
    color: 'text-indigo-600',
  },
  {
    label: 'Other',
    value: 'OTHER',
    icon: 'File',
    color: 'text-gray-600',
  },
]



