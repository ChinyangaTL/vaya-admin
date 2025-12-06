import { Bug, Calendar, User, Mail, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  bugReportStatusLabels,
  bugReportStatusColors,
  bugReportSeverityLabels,
  bugReportSeverityColors,
} from '../data/schema'
import { useBugReports } from './bug-reports-provider'
import { cn } from '@/lib/utils'

export function BugReportsViewDialog() {
  const { open, setOpen, currentBugReport } = useBugReports()

  const isOpen = open === 'view'

  if (!currentBugReport) return null

  const status = currentBugReport.status as keyof typeof bugReportStatusLabels
  const severity = currentBugReport.severity as keyof typeof bugReportSeverityLabels

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setOpen(null)}>
      <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Bug className='h-5 w-5' />
            Bug Report Details
          </DialogTitle>
          <DialogDescription>
            View complete details of the bug report
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Title and Status */}
          <div>
            <h3 className='text-lg font-semibold mb-2'>{currentBugReport.title}</h3>
            <div className='flex gap-2 flex-wrap'>
              <Badge
                variant='outline'
                className={cn('capitalize', bugReportStatusColors[status])}
              >
                {bugReportStatusLabels[status]}
              </Badge>
              <Badge
                variant='outline'
                className={cn('capitalize', bugReportSeverityColors[severity])}
              >
                {bugReportSeverityLabels[severity]}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h4 className='font-semibold mb-2'>Description</h4>
            <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
              {currentBugReport.description}
            </p>
          </div>

          <Separator />

          {/* Reporter Information */}
          <div>
            <h4 className='font-semibold mb-3 flex items-center gap-2'>
              <User className='h-4 w-4' />
              Reporter Information
            </h4>
            <div className='space-y-2 text-sm'>
              {currentBugReport.reporter ? (
                <>
                  <div className='flex items-center gap-2'>
                    <span className='text-muted-foreground'>Name:</span>
                    <span>
                      {currentBugReport.reporter.firstName &&
                      currentBugReport.reporter.lastName
                        ? `${currentBugReport.reporter.firstName} ${currentBugReport.reporter.lastName}`
                        : 'N/A'}
                    </span>
                  </div>
                  {currentBugReport.reporter.email && (
                    <div className='flex items-center gap-2'>
                      <Mail className='h-4 w-4 text-muted-foreground' />
                      <span className='text-muted-foreground'>Email:</span>
                      <span>{currentBugReport.reporter.email}</span>
                    </div>
                  )}
                  <div className='flex items-center gap-2'>
                    <span className='text-muted-foreground'>Phone:</span>
                    <span>{currentBugReport.reporter.phone}</span>
                  </div>
                </>
              ) : (
                <div className='flex items-center gap-2'>
                  <span className='text-muted-foreground'>Type:</span>
                  <span>Anonymous</span>
                  {currentBugReport.reporter_email && (
                    <>
                      <Mail className='h-4 w-4 text-muted-foreground ml-2' />
                      <span className='text-muted-foreground'>Email:</span>
                      <span>{currentBugReport.reporter_email}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Resolution Notes */}
          {currentBugReport.resolution_notes && (
            <>
              <div>
                <h4 className='font-semibold mb-2 flex items-center gap-2'>
                  <AlertCircle className='h-4 w-4' />
                  Resolution Notes
                </h4>
                <p className='text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-3 rounded-lg'>
                  {currentBugReport.resolution_notes}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Timestamps */}
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-muted-foreground' />
              <div>
                <div className='text-muted-foreground'>Reported</div>
                <div>
                  {new Date(currentBugReport.created_at).toLocaleString()}
                </div>
              </div>
            </div>
            {currentBugReport.resolved_at && (
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <div>
                  <div className='text-muted-foreground'>Resolved</div>
                  <div>
                    {new Date(currentBugReport.resolved_at).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='flex justify-end'>
          <Button variant='outline' onClick={() => setOpen(null)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

