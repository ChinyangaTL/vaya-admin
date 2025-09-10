import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { XCircle } from 'lucide-react'
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
import { useRejectDepositMutation } from '../hooks/use-wallet-query'
import { useDeposits } from './deposits-provider'

const rejectDepositSchema = z.object({
  adminNotes: z.string().min(1, 'Rejection reason is required'),
})

type RejectDepositForm = z.infer<typeof rejectDepositSchema>

export function DepositsRejectDialog() {
  const { open, setOpen, currentDeposit } = useDeposits()
  const rejectDepositMutation = useRejectDepositMutation()

  const isOpen = open === 'reject'

  const form = useForm<RejectDepositForm>({
    resolver: zodResolver(rejectDepositSchema),
    defaultValues: {
      adminNotes: '',
    },
  })

  const handleClose = () => {
    setOpen(null)
    form.reset()
  }

  const onSubmit = async (data: RejectDepositForm) => {
    if (!currentDeposit) return

    try {
      await rejectDepositMutation.mutateAsync({
        depositId: currentDeposit.id,
        adminNotes: data.adminNotes,
      })
      handleClose()
    } catch (error) {
      console.error('Failed to reject deposit:', error)
    }
  }

  if (!currentDeposit) return null

  const deposit = currentDeposit
  const driverName = deposit.user?.email || 'Unknown User'

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <XCircle className='h-5 w-5 text-red-600' />
            Reject Deposit
          </DialogTitle>
          <DialogDescription>
            Reject deposit request from {driverName} for BWP{' '}
            {parseFloat(deposit.amount).toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='adminNotes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rejection Reason *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Please provide a reason for rejecting this deposit...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={rejectDepositMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant='destructive'
                disabled={rejectDepositMutation.isPending}
              >
                {rejectDepositMutation.isPending
                  ? 'Rejecting...'
                  : 'Reject Deposit'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
