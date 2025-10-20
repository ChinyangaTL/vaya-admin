import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { XCircle } from 'lucide-react'
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
import { useRejectStudentVerificationMutation } from '../hooks/use-student-verifications-query'
import { useStudentVerifications } from './student-verifications-provider'

const rejectStudentVerificationSchema = z.object({
  rejectionReason: z
    .string()
    .min(10, 'Please provide a detailed reason for rejection'),
  adminNotes: z.string().optional(),
})

type RejectStudentVerificationFormData = z.infer<
  typeof rejectStudentVerificationSchema
>

export function StudentVerificationsRejectDialog() {
  const { open, setOpen, currentStudent } = useStudentVerifications()
  const [isLoading, setIsLoading] = useState(false)
  const rejectStudentVerificationMutation =
    useRejectStudentVerificationMutation()

  const form = useForm<RejectStudentVerificationFormData>({
    resolver: zodResolver(rejectStudentVerificationSchema),
    defaultValues: {
      rejectionReason: '',
      adminNotes: '',
    },
  })

  const isOpen = open === 'reject'

  const onSubmit = async (data: RejectStudentVerificationFormData) => {
    if (!currentStudent) return

    setIsLoading(true)
    try {
      await rejectStudentVerificationMutation.mutateAsync({
        userId: currentStudent.id,
        rejectionReason: data.rejectionReason,
        adminNotes: data.adminNotes,
      })

      toast.success('Student verification rejected successfully!')
      setOpen(null)
      form.reset()
    } catch (error) {
      toast.error('Failed to reject student verification. Please try again.')
      console.error('Student verification rejection error:', error)
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
            <XCircle className='h-5 w-5 text-red-600' />
            Reject Student Verification
          </DialogTitle>
          <DialogDescription>
            Reject <strong>{currentStudent.email}</strong>'s student
            verification application. This will send a notification to the
            student about their rejection with the reason you provide.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='rejectionReason'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rejection Reason *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Please provide a detailed reason for rejection (e.g., "Student ID document is unclear", "Face scan does not match ID", etc.)...'
                      className='resize-none'
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='adminNotes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Add any additional notes for internal reference...'
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
                className='bg-red-600 hover:bg-red-700'
              >
                {isLoading ? 'Rejecting...' : 'Reject Student'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}










