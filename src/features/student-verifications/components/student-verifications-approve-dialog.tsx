import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
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
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useApproveStudentVerificationMutation } from '../hooks/use-student-verifications-query'
import { useStudentVerifications } from './student-verifications-provider'

const approveStudentVerificationSchema = z.object({
  adminNotes: z.string().optional(),
})

type ApproveStudentVerificationFormData = z.infer<
  typeof approveStudentVerificationSchema
>

export function StudentVerificationsApproveDialog() {
  const { open, setOpen, currentStudent } = useStudentVerifications()
  const [isLoading, setIsLoading] = useState(false)
  const approveStudentVerificationMutation =
    useApproveStudentVerificationMutation()

  const form = useForm<ApproveStudentVerificationFormData>({
    resolver: zodResolver(approveStudentVerificationSchema),
    defaultValues: {
      adminNotes: '',
    },
  })

  const isOpen = open === 'approve'

  const onSubmit = async (data: ApproveStudentVerificationFormData) => {
    if (!currentStudent) return

    setIsLoading(true)
    try {
      await approveStudentVerificationMutation.mutateAsync({
        userId: currentStudent.id,
        adminNotes: data.adminNotes,
      })

      toast.success('Student verification approved successfully!')
      setOpen(null)
      form.reset()
    } catch (error) {
      toast.error('Failed to approve student verification. Please try again.')
      console.error('Student verification approval error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(null)
    form.reset()
  }

  if (!currentStudent) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <CheckCircle className='h-5 w-5 text-green-600' />
            Approve Student Verification
          </DialogTitle>
          <DialogDescription>
            Approve <strong>{currentStudent.email}</strong> as a verified
            student. This will grant them access to discounted fares (BWP 5.50
            instead of BWP 8.00). A notification will be sent to the student
            about their approval.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='adminNotes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Add any notes for the student about their verification approval...'
                      className='resize-none'
                      rows={3}
                      {...field}
                    />
                  </FormControl>
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
                disabled={isLoading}
                className='bg-green-600 hover:bg-green-700'
              >
                {isLoading ? 'Approving...' : 'Approve Student'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}












