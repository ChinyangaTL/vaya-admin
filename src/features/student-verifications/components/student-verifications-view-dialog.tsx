import {
  Calendar,
  FileText,
  User,
  GraduationCap,
  Mail,
  Phone,
  IdCard,
  Building,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { studentVerificationStatuses } from '../data/data'
import { useStudentVerifications } from './student-verifications-provider'

// Document Item Component
function DocumentItem({
  title,
  filePath,
  type,
}: {
  title: string
  filePath: string | null
  type: 'document' | 'image'
}) {
  const handleViewDocument = () => {
    if (filePath) {
      // Open document in new tab
      window.open(filePath, '_blank')
    }
  }

  return (
    <div className='flex items-center gap-3 rounded-lg border p-3'>
      <div className='flex-shrink-0'>
        {type === 'document' ? (
          <FileText className='text-muted-foreground h-8 w-8' />
        ) : (
          <User className='text-muted-foreground h-8 w-8' />
        )}
      </div>
      <div className='min-w-0 flex-1'>
        <p className='text-sm font-medium'>{title}</p>
        <p className='text-muted-foreground text-xs'>
          {filePath ? 'Available for viewing' : 'Not provided'}
        </p>
      </div>
      <div>
        {filePath ? (
          <Button
            variant='outline'
            size='sm'
            onClick={handleViewDocument}
            className='h-8'
          >
            View
          </Button>
        ) : (
          <Badge variant='secondary' className='text-xs'>
            Not Available
          </Badge>
        )}
      </div>
    </div>
  )
}

export function StudentVerificationsViewDialog() {
  const { open, setOpen, currentStudent } = useStudentVerifications()

  if (!currentStudent) return null

  const statusConfig = studentVerificationStatuses.find(
    (s) => s.value === 'PENDING' // Since we're viewing pending verifications
  )

  return (
    <Dialog open={open === 'view'} onOpenChange={() => setOpen(null)}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <GraduationCap className='h-5 w-5' />
            Student Verification Details
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Student Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Student Information</h3>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex items-center gap-3'>
                <Mail className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Email</p>
                  <p className='text-muted-foreground text-sm'>
                    {currentStudent.email}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <Phone className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Phone</p>
                  <p className='text-muted-foreground text-sm'>
                    {currentStudent.phone}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <IdCard className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Student ID</p>
                  <p className='text-muted-foreground text-sm'>
                    {currentStudent.student_id || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <Building className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>University</p>
                  <p className='text-muted-foreground text-sm'>
                    {currentStudent.university_name || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Documents */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Verification Documents</h3>

            <div className='space-y-3'>
              <DocumentItem
                title='Student ID Document'
                filePath={currentStudent.student_id_document_path}
                type='document'
              />

              <DocumentItem
                title='Face Scan Photo'
                filePath={currentStudent.face_scan_path}
                type='image'
              />
            </div>
          </div>

          {/* Timeline */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Timeline</h3>

            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <Calendar className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-sm font-medium'>Registered</p>
                  <p className='text-muted-foreground text-sm'>
                    {currentStudent.created_at.toLocaleDateString()}
                  </p>
                </div>
              </div>

              {currentStudent.verification_submitted_at && (
                <div className='flex items-center gap-3'>
                  <Calendar className='text-muted-foreground h-4 w-4' />
                  <div>
                    <p className='text-sm font-medium'>
                      Verification Submitted
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      {currentStudent.verification_submitted_at.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className='flex items-center justify-between rounded-lg border p-4'>
            <div className='flex items-center gap-3'>
              <GraduationCap className='text-muted-foreground h-4 w-4' />
              <div>
                <p className='text-sm font-medium'>Verification Status</p>
                <p className='text-muted-foreground text-sm'>
                  Awaiting admin review
                </p>
              </div>
            </div>
            {statusConfig && (
              <Badge variant='outline' className={statusConfig.color}>
                {statusConfig.label}
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => setOpen(null)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
