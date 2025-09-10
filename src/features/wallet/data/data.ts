import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

// Transaction type configurations
export const transactionTypes = [
  {
    label: 'Deposit',
    value: 'DEPOSIT',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    label: 'Withdrawal',
    value: 'WITHDRAWAL',
    icon: TrendingDown,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  {
    label: 'Trip Payment',
    value: 'TRIP_PAYMENT',
    icon: DollarSign,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    label: 'Trip Refund',
    value: 'TRIP_REFUND',
    icon: DollarSign,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  {
    label: 'QR Payment',
    value: 'QR_PAYMENT',
    icon: DollarSign,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    label: 'Admin Adjustment',
    value: 'ADMIN_ADJUSTMENT',
    icon: DollarSign,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
]

// Status configurations
export const statusTypes = [
  {
    label: 'Pending',
    value: 'PENDING',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  {
    label: 'Approved',
    value: 'APPROVED',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    label: 'Rejected',
    value: 'REJECTED',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
]

// Helper functions
export const getTransactionTypeInfo = (type: string) => {
  return (
    transactionTypes.find((t) => t.value === type) || {
      label: type,
      value: type,
      icon: DollarSign,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    }
  )
}

export const getStatusInfo = (status: string) => {
  return (
    statusTypes.find((s) => s.value === status) || {
      label: status,
      value: status,
      icon: Clock,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    }
  )
}
