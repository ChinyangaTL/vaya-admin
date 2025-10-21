import {
  User,
  Mail,
  Phone,
  DollarSign,
  CreditCard,
  Calendar,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getStatusInfo } from '../data/data'
import type { WithdrawalRequest } from '../data/schema'
import { useWithdrawals } from './withdrawals-provider'

// Helper function to format payment method display
const getPaymentMethodDisplay = (withdrawal: WithdrawalRequest): string => {
  if (!withdrawal.paymentMethod) return 'N/A'

  const pm = withdrawal.paymentMethod

  switch (pm.type) {
    case 'BANK_ACCOUNT':
      if (pm.bank_name && pm.account_number) {
        return `${pm.bank_name} - ${pm.account_number}`
      }
      return pm.name || 'Bank Account'
    case 'FNB_PAY2CELL':
      return `FNB Pay2Cell - ${pm.phone_number || 'N/A'}`
    case 'ORANGE_MONEY':
      return `Orange Money - ${pm.phone_number || 'N/A'}`
    default:
      return pm.name || 'N/A'
  }
}

export function WithdrawalsViewDialog() {
  const { open, setOpen, currentWithdrawal } = useWithdrawals()

  const isOpen = open === 'view'

  const handleClose = () => {
    setOpen(null)
  }

  if (!currentWithdrawal) return null

  const withdrawal = currentWithdrawal
  const statusInfo = getStatusInfo(withdrawal.status)
  const StatusIcon = statusInfo.icon

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-h-[80vh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <DollarSign className='h-5 w-5' />
            Withdrawal Request Details
          </DialogTitle>
          <DialogDescription>
            Complete information for withdrawal request #
            {withdrawal.id.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Status Badge */}
          <div className='flex items-center gap-2'>
            <StatusIcon className='h-4 w-4' />
            <Badge variant='outline' className={statusInfo.color}>
              {statusInfo.label}
            </Badge>
          </div>

          {/* User Information */}
          <div className='space-y-4'>
            <h3 className='flex items-center gap-2 text-lg font-semibold'>
              <User className='h-4 w-4' />
              User Information
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex items-center gap-2'>
                <Mail className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Email</p>
                  <p className='text-muted-foreground text-sm'>
                    {withdrawal.user?.email || 'N/A'}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Phone className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Phone</p>
                  <p className='text-muted-foreground text-sm'>
                    {withdrawal.user?.phone || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawal Information */}
          <div className='space-y-4'>
            <h3 className='flex items-center gap-2 text-lg font-semibold'>
              <DollarSign className='h-4 w-4' />
              Withdrawal Information
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex items-center gap-2'>
                <DollarSign className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Amount</p>
                  <p className='text-muted-foreground font-mono text-sm'>
                    BWP {parseFloat(withdrawal.amount).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <CreditCard className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Payment Method</p>
                  <p className='text-muted-foreground text-sm'>
                    {getPaymentMethodDisplay(withdrawal)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          {withdrawal.admin_notes && (
            <div className='space-y-4'>
              <h3 className='flex items-center gap-2 text-lg font-semibold'>
                <Calendar className='h-4 w-4' />
                Admin Notes
              </h3>
              <div className='bg-muted rounded-lg p-3'>
                <p className='text-sm'>{withdrawal.admin_notes}</p>
              </div>
            </div>
          )}

          {/* Request Details */}
          <div className='space-y-4'>
            <h3 className='flex items-center gap-2 text-lg font-semibold'>
              <Calendar className='h-4 w-4' />
              Request Details
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex items-center gap-2'>
                <Calendar className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Requested On</p>
                  <p className='text-muted-foreground text-sm'>
                    {new Date(withdrawal.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
