import { User, Mail, Phone, FileText, Car, Calendar, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { approvalStatuses, documentTypes } from '../data/data'
import { useDocumentUrlQuery } from '../hooks/use-document-url'
import { useDrivers } from './drivers-provider'

// Document Item Component
function DocumentItem({
  document,
  docType,
}: {
  document: any
  docType: { label: string; icon: any; color?: string }
}) {
  const { data: signedUrl, isLoading, error } = useDocumentUrlQuery(document.id)

  return (
    <div className='flex items-center justify-between rounded-lg border p-3'>
      <div className='flex items-center gap-2'>
        {docType?.icon && (
          <docType.icon className='text-muted-foreground h-4 w-4' />
        )}
        <div>
          <p className='text-sm font-medium'>
            {docType?.label || document.document_type}
          </p>
          <p className='text-muted-foreground text-xs'>
            Uploaded{' '}
            {document.uploaded_at
              ? (document.uploaded_at instanceof Date
                  ? document.uploaded_at
                  : new Date(document.uploaded_at)
                ).toLocaleDateString()
              : 'Unknown'}
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
        ) : signedUrl ? (
          <a
            href={signedUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm text-blue-600 hover:text-blue-800'
          >
            <Button size='sm' variant='outline'>
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

export function DriversViewDialog() {
  const { open, setOpen, currentDriver } = useDrivers()

  const isOpen = open === 'view'

  const handleClose = () => {
    setOpen(null)
  }

  if (!currentDriver) return null

  const driver = currentDriver
  const driverName =
    driver.firstName && driver.lastName
      ? `${driver.firstName} ${driver.lastName}`
      : 'N/A'

  const statusConfig = approvalStatuses.find(
    (s) => s.value === driver.approval_status
  )
  const StatusIcon = statusConfig?.icon || Clock

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-h-[80vh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <User className='h-5 w-5' />
            Driver Profile
          </DialogTitle>
          <DialogDescription>
            Complete profile information for {driverName}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Status Badge */}
          <div className='flex items-center gap-2'>
            <StatusIcon className='h-4 w-4' />
            <Badge variant='outline' className={statusConfig?.color}>
              {statusConfig?.label || driver.approval_status}
            </Badge>
          </div>

          {/* Personal Information */}
          <div className='space-y-4'>
            <h3 className='flex items-center gap-2 text-lg font-semibold'>
              <User className='h-4 w-4' />
              Personal Information
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex items-center gap-2'>
                <Mail className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Email</p>
                  <p className='text-muted-foreground text-sm'>
                    {driver.user.email}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Phone className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Phone</p>
                  <p className='text-muted-foreground text-sm'>
                    {driver.user.phone || 'N/A'}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <User className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Full Name</p>
                  <p className='text-muted-foreground text-sm'>{driverName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* License Information */}
          <div className='space-y-4'>
            <h3 className='flex items-center gap-2 text-lg font-semibold'>
              <FileText className='h-4 w-4' />
              License Information
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex items-center gap-2'>
                <FileText className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>License Plate</p>
                  <p className='text-muted-foreground text-sm'>
                    {driver.licensePlate || 'N/A'}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Calendar className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Route</p>
                  <p className='text-muted-foreground text-sm'>
                    {driver.route || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className='space-y-4'>
            <h3 className='flex items-center gap-2 text-lg font-semibold'>
              <Car className='h-4 w-4' />
              Vehicle Information
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex items-center gap-2'>
                <Car className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>License Plate</p>
                  <p className='text-muted-foreground text-sm'>
                    {driver.licensePlate || 'N/A'}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Car className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Route</p>
                  <p className='text-muted-foreground text-sm'>
                    {driver.route || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          {driver.documents && driver.documents.length > 0 && (
            <div className='space-y-4'>
              <h3 className='flex items-center gap-2 text-lg font-semibold'>
                <FileText className='h-4 w-4' />
                Documents
              </h3>
              <div className='space-y-2'>
                {driver.documents.map((doc) => {
                  const docType = documentTypes.find(
                    (dt) => dt.value === doc.document_type
                  )
                  return (
                    <DocumentItem
                      key={doc.id}
                      document={doc}
                      docType={
                        docType || {
                          label: doc.document_type,
                          icon: FileText,
                        }
                      }
                    />
                  )
                })}
              </div>
            </div>
          )}

          {/* Application Details */}
          <div className='space-y-4'>
            <h3 className='flex items-center gap-2 text-lg font-semibold'>
              <Calendar className='h-4 w-4' />
              Application Details
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex items-center gap-2'>
                <Calendar className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Applied On</p>
                  <p className='text-muted-foreground text-sm'>
                    {driver.created_at
                      ? (driver.created_at instanceof Date
                          ? driver.created_at
                          : new Date(driver.created_at)
                        ).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Calendar className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Last Updated</p>
                  <p className='text-muted-foreground text-sm'>
                    {driver.updated_at
                      ? (driver.updated_at instanceof Date
                          ? driver.updated_at
                          : new Date(driver.updated_at)
                        ).toLocaleDateString()
                      : 'N/A'}
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
