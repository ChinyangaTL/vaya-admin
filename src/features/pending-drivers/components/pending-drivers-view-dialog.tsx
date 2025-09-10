import {
  Calendar,
  FileText,
  User,
  Car,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { documentTypes } from '../data/data'
import { type PendingDriverProfile } from '../data/schema'
import { useDocumentUrlQuery } from '../hooks/use-document-url'
import { usePendingDrivers } from './pending-drivers-provider'

// Document Item Component
function DocumentItem({
  document,
  docType,
}: {
  document: PendingDriverProfile['documents'][0]
  docType: { label: string; icon: string; color: string }
}) {
  const { data: signedUrl, isLoading, error } = useDocumentUrlQuery(document.id)

  return (
    <div className='flex items-center gap-3 rounded-lg border p-3'>
      <div className='flex-shrink-0'>
        <FileText className='text-muted-foreground h-8 w-8' />
      </div>
      <div className='min-w-0 flex-1'>
        <p className='text-sm font-medium'>{docType.label}</p>
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
              View
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

export function PendingDriversViewDialog() {
  const { open, setOpen, currentDriver } = usePendingDrivers()

  if (!currentDriver) return null

  const isOpen = open === 'view'
  const driver = currentDriver

  const driverName =
    driver.firstName && driver.lastName
      ? `${driver.firstName} ${driver.lastName}`
      : driver.user.email

  const getDocumentTypeInfo = (type: string) => {
    return (
      documentTypes.find((dt) => dt.value === type) || {
        label: type,
        icon: 'File',
        color: 'text-gray-600',
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => setOpen(null)}>
      <DialogContent className='max-h-[80vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <User className='h-5 w-5' />
            Driver Profile - {driverName}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Personal Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Personal Information</h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex items-center gap-2'>
                <User className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Full Name</p>
                  <p className='text-muted-foreground text-sm'>{driverName}</p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <User className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Email</p>
                  <p className='text-muted-foreground text-sm'>
                    {driver.user.email}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <User className='text-muted-foreground h-4 w-4' />
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
                  <p className='text-sm font-medium'>Role</p>
                  <p className='text-muted-foreground text-sm'>
                    {driver.user.role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Vehicle Information</h3>
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
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Documents</h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {driver.documents.map((doc) => {
                console.log(doc)
                const docType = getDocumentTypeInfo(doc.document_type)
                return (
                  <DocumentItem key={doc.id} document={doc} docType={docType} />
                )
              })}
            </div>
          </div>

          {/* Application Details */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Application Details</h3>
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

          {/* Status */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Status</h3>
            <div className='flex items-center gap-2'>
              {driver.approval_status === 'PENDING' && (
                <Badge
                  variant='outline'
                  className='border-yellow-200 bg-yellow-50 text-yellow-600'
                >
                  <Clock className='mr-1 h-3 w-3' />
                  Pending Review
                </Badge>
              )}
              {driver.approval_status === 'APPROVED' && (
                <Badge
                  variant='outline'
                  className='border-green-200 bg-green-50 text-green-600'
                >
                  <CheckCircle className='mr-1 h-3 w-3' />
                  Approved
                </Badge>
              )}
              {driver.approval_status === 'REJECTED' && (
                <Badge
                  variant='outline'
                  className='border-red-200 bg-red-50 text-red-600'
                >
                  <XCircle className='mr-1 h-3 w-3' />
                  Rejected
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className='flex justify-end pt-4'>
          <Button onClick={() => setOpen(null)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
