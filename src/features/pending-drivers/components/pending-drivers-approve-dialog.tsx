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
import { useApproveDriverMutation } from '../hooks/use-pending-drivers-query'
import { usePendingDrivers } from './pending-drivers-provider'

const approveDriverSchema = z.object({
  adminNotes: z.string().optional(),
})

type ApproveDriverFormData = z.infer<typeof approveDriverSchema>

export function PendingDriversApproveDialog() {
  const { open, setOpen, currentDriver } = usePendingDrivers()
  const [isLoading, setIsLoading] = useState(false)
  const approveDriverMutation = useApproveDriverMutation()

  const form = useForm<ApproveDriverFormData>({
    resolver: zodResolver(approveDriverSchema),
    defaultValues: {
      adminNotes: '',
    },
  })

  const isOpen = open === 'approve'

  const onSubmit = async (data: ApproveDriverFormData) => {
    if (!currentDriver) return

    setIsLoading(true)
    try {
      await approveDriverMutation.mutateAsync({
        driverProfileId: currentDriver.id,
        adminNotes: data.adminNotes,
      })

      toast.success('Driver approved successfully!')
      setOpen(null)
      form.reset()
    } catch (error) {
      toast.error('Failed to approve driver. Please try again.')
      console.error('Driver approval error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(null)
    form.reset()
  }

  if (!currentDriver) return null

  const driverName =
    currentDriver.firstName && currentDriver.lastName
      ? `${currentDriver.firstName} ${currentDriver.lastName}`
      : currentDriver.user.email

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <CheckCircle className='h-5 w-5 text-green-600' />
            Approve Driver
          </DialogTitle>
          <DialogDescription>
            Approve <strong>{driverName}</strong> to start operating on the Vaya
            platform. This will send a notification to the driver about their
            approval.
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
                      placeholder='Add any notes for the driver about their approval...'
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
                {isLoading ? 'Approving...' : 'Approve Driver'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}



