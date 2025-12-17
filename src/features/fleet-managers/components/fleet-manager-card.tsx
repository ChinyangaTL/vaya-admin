import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { useMemo } from 'react'
import { FleetManagerProfile } from '../types'
import { useApproveFleetManager, useRejectFleetManager } from '../hooks/use-pending-fleet-managers'
import { adminAPI } from '@/lib/api-client'
import { toast } from 'sonner'

interface Props {
  profile: FleetManagerProfile
  showActions?: boolean
}

export function FleetManagerCard({ profile, showActions = false }: Props) {
  const approveMutation = useApproveFleetManager()
  const rejectMutation = useRejectFleetManager()

  const statusVariant = useMemo(() => {
    switch (profile.approval_status) {
      case 'APPROVED':
        return 'success'
      case 'REJECTED':
        return 'destructive'
      default:
        return 'secondary'
    }
  }, [profile.approval_status])

  const handleViewDoc = async (docId: string) => {
    try {
      const url = await adminAPI.getFleetManagerDocumentUrl(docId)
      window.open(url, '_blank')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to open document')
    }
  }

  const handleApprove = async () => {
    const adminNotes = window.prompt('Optional admin notes for approval') || undefined
    approveMutation.mutate(
      { profileId: profile.id, adminNotes },
      {
        onSuccess: () => toast.success('Fleet manager approved'),
        onError: (err: any) => toast.error(err?.message || 'Failed to approve'),
      }
    )
  }

  const handleReject = async () => {
    const adminNotes = window.prompt('Reason for rejection (required)')
    if (!adminNotes) return
    rejectMutation.mutate(
      { profileId: profile.id, adminNotes },
      {
        onSuccess: () => toast.success('Fleet manager rejected'),
        onError: (err: any) => toast.error(err?.message || 'Failed to reject'),
      }
    )
  }

  return (
    <div className='rounded-lg border border-border bg-card p-4 shadow-sm space-y-3'>
      <div className='flex items-center justify-between gap-3'>
        <div>
          <div className='text-lg font-semibold'>{profile.companyName}</div>
          <div className='text-sm text-muted-foreground'>
            {profile.companyEmail || profile.user?.email || 'No email'} · {profile.companyPhone || profile.user?.phone || 'No phone'}
          </div>
          {profile.fleetId && (
            <div className='text-xs text-muted-foreground'>Fleet ID: {profile.fleetId}</div>
          )}
        </div>
        <Badge variant={statusVariant as any}>{profile.approval_status}</Badge>
      </div>

      <div className='grid grid-cols-2 gap-2 text-sm'>
        <div>
          <div className='text-muted-foreground'>Registration</div>
          <div>{profile.companyRegistration || '—'}</div>
        </div>
        <div>
          <div className='text-muted-foreground'>Tax Number</div>
          <div>{profile.taxNumber || '—'}</div>
        </div>
        <div>
          <div className='text-muted-foreground'>Address</div>
          <div>{profile.companyAddress || '—'}</div>
        </div>
        <div>
          <div className='text-muted-foreground'>Submitted</div>
          <div>
            {profile.created_at ? format(new Date(profile.created_at), 'yyyy-MM-dd HH:mm') : '—'}
          </div>
        </div>
      </div>

      {profile.documents && profile.documents.length > 0 && (
        <div className='space-y-1'>
          <div className='text-sm font-medium'>Documents</div>
          <div className='flex flex-wrap gap-2'>
            {profile.documents.map((doc) => (
              <Button
                key={doc.id}
                variant='outline'
                size='sm'
                onClick={() => handleViewDoc(doc.id)}
              >
                {doc.document_type}
              </Button>
            ))}
          </div>
        </div>
      )}

      {showActions && profile.approval_status === 'PENDING' && (
        <div className='flex gap-2'>
          <Button variant='default' onClick={handleApprove} disabled={approveMutation.isLoading}>
            Approve
          </Button>
          <Button variant='destructive' onClick={handleReject} disabled={rejectMutation.isLoading}>
            Reject
          </Button>
        </div>
      )}
    </div>
  )
}

