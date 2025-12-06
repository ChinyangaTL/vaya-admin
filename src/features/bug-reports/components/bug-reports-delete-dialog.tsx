import { Trash2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useDeleteBugReportMutation } from '../hooks/use-bug-reports-query'
import { useBugReports } from './bug-reports-provider'

export function BugReportsDeleteDialog() {
  const { open, setOpen, currentBugReport } = useBugReports()
  const deleteBugReportMutation = useDeleteBugReportMutation()

  const isOpen = open === 'delete'

  const handleDelete = async () => {
    if (!currentBugReport) return

    try {
      await deleteBugReportMutation.mutateAsync(currentBugReport.id)
      setOpen(null)
    } catch (error) {
      console.error('Bug report deletion error:', error)
    }
  }

  const handleClose = () => {
    setOpen(null)
  }

  if (!currentBugReport) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-destructive'>
            <Trash2 className='h-5 w-5' />
            Delete Bug Report
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this bug report? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <Alert variant='destructive'>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              <strong>{currentBugReport.title}</strong> will be permanently
              deleted.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button type='button' variant='outline' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteBugReportMutation.isPending}
          >
            {deleteBugReportMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

