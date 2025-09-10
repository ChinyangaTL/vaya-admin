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
import { useRejectWithdrawalMutation } from '../hooks/use-wallet-query'
import { useWithdrawals } from './withdrawals-provider'

const rejectWithdrawalSchema = z.object({
  adminNotes: z.string().min(1, 'Rejection reason is required'),
})

type RejectWithdrawalForm = z.infer<typeof rejectWithdrawalSchema>

export function WithdrawalsRejectDialog() {
  const { open, setOpen, currentWithdrawal } = useWithdrawals()
  const rejectWithdrawalMutation = useRejectWithdrawalMutation()

  const isOpen = open === 'reject'

  const form = useForm<RejectWithdrawalForm>({
    resolver: zodResolver(rejectWithdrawalSchema),
    defaultValues: {
      adminNotes: '',
    },
  })

  const handleClose = () => {
    setOpen(null)
    form.reset()
  }

  const onSubmit = async (data: RejectWithdrawalForm) => {
    if (!currentWithdrawal) return

    try {
      await rejectWithdrawalMutation.mutateAsync({
        withdrawalId: currentWithdrawal.id,
        adminNotes: data.adminNotes,
      })
      handleClose()
    } catch (error) {
      console.error('Failed to reject withdrawal:', error)
    }
  }

  if (!currentWithdrawal) return null

  const withdrawal = currentWithdrawal
  const userName = withdrawal.user?.email || 'Unknown User'

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <XCircle className='h-5 w-5 text-red-600' />
            Reject Withdrawal
          </DialogTitle>
          <DialogDescription>
            Reject withdrawal request from {userName} for BWP{' '}
            {parseFloat(withdrawal.amount).toFixed(2)}
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
                      placeholder='Please provide a reason for rejecting this withdrawal...'
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
                disabled={rejectWithdrawalMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant='destructive'
                disabled={rejectWithdrawalMutation.isPending}
              >
                {rejectWithdrawalMutation.isPending
                  ? 'Rejecting...'
                  : 'Reject Withdrawal'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
