import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle } from 'lucide-react'
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
import { useApproveWithdrawalMutation } from '../hooks/use-wallet-query'
import { useWithdrawals } from './withdrawals-provider'

const approveWithdrawalSchema = z.object({
  adminNotes: z.string().optional(),
})

type ApproveWithdrawalForm = z.infer<typeof approveWithdrawalSchema>

export function WithdrawalsApproveDialog() {
  const { open, setOpen, currentWithdrawal } = useWithdrawals()
  const approveWithdrawalMutation = useApproveWithdrawalMutation()

  const isOpen = open === 'approve'

  const form = useForm<ApproveWithdrawalForm>({
    resolver: zodResolver(approveWithdrawalSchema),
    defaultValues: {
      adminNotes: '',
    },
  })

  const handleClose = () => {
    setOpen(null)
    form.reset()
  }

  const onSubmit = async (data: ApproveWithdrawalForm) => {
    if (!currentWithdrawal) return

    try {
      await approveWithdrawalMutation.mutateAsync({
        withdrawalId: currentWithdrawal.id,
        adminNotes: data.adminNotes || undefined,
      })
      handleClose()
    } catch (error) {
      console.error('Failed to approve withdrawal:', error)
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
            <CheckCircle className='h-5 w-5 text-green-600' />
            Approve Withdrawal
          </DialogTitle>
          <DialogDescription>
            Approve withdrawal request from {userName} for BWP{' '}
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
                  <FormLabel>Admin Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Add any notes about this approval...'
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
                disabled={approveWithdrawalMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={approveWithdrawalMutation.isPending}
                className='bg-green-600 hover:bg-green-700'
              >
                {approveWithdrawalMutation.isPending
                  ? 'Approving...'
                  : 'Approve Withdrawal'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
