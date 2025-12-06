import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateBugReportMutation } from '../hooks/use-bug-reports-query'
import { useBugReports } from './bug-reports-provider'

const updateBugReportSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  resolutionNotes: z.string().optional(),
})

type UpdateBugReportFormData = z.infer<typeof updateBugReportSchema>

export function BugReportsUpdateDialog() {
  const { open, setOpen, currentBugReport } = useBugReports()
  const updateBugReportMutation = useUpdateBugReportMutation()

  const form = useForm<UpdateBugReportFormData>({
    resolver: zodResolver(updateBugReportSchema),
    defaultValues: {
      status: 'OPEN',
      severity: 'MEDIUM',
      resolutionNotes: '',
    },
  })

  // Update form when bug report changes
  useEffect(() => {
    if (currentBugReport && open === 'update') {
      form.reset({
        status: currentBugReport.status as any,
        severity: currentBugReport.severity as any,
        resolutionNotes: currentBugReport.resolution_notes || '',
      })
    }
  }, [currentBugReport, open, form])

  const isOpen = open === 'update'

  const onSubmit = async (data: UpdateBugReportFormData) => {
    if (!currentBugReport) return

    try {
      await updateBugReportMutation.mutateAsync({
        id: currentBugReport.id,
        data: {
          status: data.status,
          severity: data.severity,
          resolutionNotes: data.resolutionNotes || undefined,
        },
      })

      setOpen(null)
      form.reset()
    } catch (error) {
      console.error('Bug report update error:', error)
    }
  }

  const handleClose = () => {
    setOpen(null)
    form.reset()
  }

  if (!currentBugReport) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Edit className='h-5 w-5' />
            Update Bug Report
          </DialogTitle>
          <DialogDescription>
            Update the status and resolution details for this bug report
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='OPEN'>Open</SelectItem>
                      <SelectItem value='IN_PROGRESS'>In Progress</SelectItem>
                      <SelectItem value='RESOLVED'>Resolved</SelectItem>
                      <SelectItem value='CLOSED'>Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='severity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select severity' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='LOW'>Low</SelectItem>
                      <SelectItem value='MEDIUM'>Medium</SelectItem>
                      <SelectItem value='HIGH'>High</SelectItem>
                      <SelectItem value='CRITICAL'>Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='resolutionNotes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resolution Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Add notes about how this bug was resolved...'
                      className='min-h-[100px]'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Add notes about the resolution (recommended when
                    marking as Resolved or Closed)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={updateBugReportMutation.isPending}
              >
                {updateBugReportMutation.isPending
                  ? 'Updating...'
                  : 'Update Bug Report'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

