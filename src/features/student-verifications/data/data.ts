import { type StudentVerificationStatus } from './schema'

export const studentVerificationStatuses: Array<{
  label: string
  value: StudentVerificationStatus
  icon: string
  color: string
}> = [
  {
    label: 'Not Applied',
    value: 'NOT_APPLIED',
    icon: 'User',
    color: 'text-gray-600 border-gray-200 bg-gray-50',
  },
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







