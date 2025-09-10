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
import { useRejectDriverMutation } from '../hooks/use-pending-drivers-query'
import { usePendingDrivers } from './pending-drivers-provider'

const rejectDriverSchema = z.object({
  reason: z.string().min(10, 'Please provide a detailed reason for rejection'),
})

type RejectDriverFormData = z.infer<typeof rejectDriverSchema>

export function PendingDriversRejectDialog() {
  const { open, setOpen, currentDriver } = usePendingDrivers()
  const [isLoading, setIsLoading] = useState(false)
  const rejectDriverMutation = useRejectDriverMutation()

  const form = useForm<RejectDriverFormData>({
    resolver: zodResolver(rejectDriverSchema),
    defaultValues: {
      reason: '',
    },
  })

  const isOpen = open === 'reject'

  const onSubmit = async (data: RejectDriverFormData) => {
    if (!currentDriver) return

    setIsLoading(true)
    try {
      await rejectDriverMutation.mutateAsync({
        driverProfileId: currentDriver.id,
        reason: data.reason,
      })

      toast.success('Driver rejected successfully!')
      setOpen(null)
      form.reset()
    } catch (error) {
      toast.error('Failed to reject driver. Please try again.')
      console.error('Driver rejection error:', error)
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
            <XCircle className='h-5 w-5 text-red-600' />
            Reject Driver
          </DialogTitle>
          <DialogDescription>
            Reject <strong>{driverName}</strong>'s application. This will send a
            notification to the driver about their rejection with the reason you
            provide.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='reason'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rejection Reason *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Please provide a detailed reason for rejection...'
                      className='resize-none'
                      rows={4}
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
                {isLoading ? 'Rejecting...' : 'Reject Driver'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
