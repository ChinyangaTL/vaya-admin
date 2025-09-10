import {
  User,
  Mail,
  Phone,
  DollarSign,
  FileText,
  Calendar,
  ExternalLink,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getStatusInfo } from '../data/data'
import { useDepositProofUrlQuery } from '../hooks/use-wallet-query'
import { useDeposits } from './deposits-provider'

export function DepositsViewDialog() {
  const { open, setOpen, currentDeposit } = useDeposits()

  const isOpen = open === 'view'

  const handleClose = () => {
    setOpen(null)
  }

  if (!currentDeposit) return null

  const deposit = currentDeposit
  const statusInfo = getStatusInfo(deposit.status)
  const StatusIcon = statusInfo.icon

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-h-[80vh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <DollarSign className='h-5 w-5' />
            Deposit Request Details
          </DialogTitle>
          <DialogDescription>
            Complete information for deposit request #{deposit.id.slice(0, 8)}
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
                    {deposit.user?.email || 'N/A'}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Phone className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Phone</p>
                  <p className='text-muted-foreground text-sm'>
                    {deposit.user?.phone || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Deposit Information */}
          <div className='space-y-4'>
            <h3 className='flex items-center gap-2 text-lg font-semibold'>
              <DollarSign className='h-4 w-4' />
              Deposit Information
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex items-center gap-2'>
                <DollarSign className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Amount</p>
                  <p className='text-muted-foreground font-mono text-sm'>
                    BWP {parseFloat(deposit.amount).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <FileText className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Bank Reference</p>
                  <p className='text-muted-foreground text-sm'>
                    {deposit.bank_reference || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Proof Document */}
          {deposit.proof_file_path && (
            <div className='space-y-4'>
              <h3 className='flex items-center gap-2 text-lg font-semibold'>
                <FileText className='h-4 w-4' />
                Proof Document
              </h3>
              <ProofDocumentViewer depositId={deposit.id} />
            </div>
          )}

          {/* Admin Notes */}
          {deposit.admin_notes && (
            <div className='space-y-4'>
              <h3 className='flex items-center gap-2 text-lg font-semibold'>
                <FileText className='h-4 w-4' />
                Admin Notes
              </h3>
              <div className='bg-muted rounded-lg p-3'>
                <p className='text-sm'>{deposit.admin_notes}</p>
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
                    {new Date(deposit.created_at).toLocaleDateString()}
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

// Proof Document Viewer Component
function ProofDocumentViewer({ depositId }: { depositId: string }) {
  const {
    data: proofUrl,
    isLoading,
    error,
  } = useDepositProofUrlQuery(depositId)

  return (
    <div className='flex items-center justify-between rounded-lg border p-3'>
      <div className='flex items-center gap-2'>
        <FileText className='text-muted-foreground h-4 w-4' />
        <div>
          <p className='text-sm font-medium'>Proof Document</p>
          <p className='text-muted-foreground text-xs'>
            Bank transfer proof file
          </p>
        </div>
      </div>
      <div>
        {isLoading ? (
          <Button size='sm' disabled>
            Loading...
          </Button>
        ) : error ? (
          <Button size='sm' variant='outline' disabled>
            Error
          </Button>
        ) : proofUrl ? (
          <a
            href={proofUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm text-blue-600 hover:text-blue-800'
          >
            <Button size='sm' variant='outline'>
              <ExternalLink className='mr-2 h-4 w-4' />
              View Document
            </Button>
          </a>
        ) : (
          <Button size='sm' variant='outline' disabled>
            Unavailable
          </Button>
        )}
      </div>
    </div>
  )
}
