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
import { useApproveDepositMutation } from '../hooks/use-wallet-query'
import { useDeposits } from './deposits-provider'

const approveDepositSchema = z.object({
  adminNotes: z.string().optional(),
})

type ApproveDepositForm = z.infer<typeof approveDepositSchema>

export function DepositsApproveDialog() {
  const { open, setOpen, currentDeposit } = useDeposits()
  const approveDepositMutation = useApproveDepositMutation()

  const isOpen = open === 'approve'

  const form = useForm<ApproveDepositForm>({
    resolver: zodResolver(approveDepositSchema),
    defaultValues: {
      adminNotes: '',
    },
  })

  const handleClose = () => {
    setOpen(null)
    form.reset()
  }

  const onSubmit = async (data: ApproveDepositForm) => {
    if (!currentDeposit) return

    try {
      await approveDepositMutation.mutateAsync({
        depositId: currentDeposit.id,
        adminNotes: data.adminNotes || undefined,
      })
      handleClose()
    } catch (error) {
      console.error('Failed to approve deposit:', error)
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
            <CheckCircle className='h-5 w-5 text-green-600' />
            Approve Deposit
          </DialogTitle>
          <DialogDescription>
            Approve deposit request from {driverName} for BWP{' '}
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
                disabled={approveDepositMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={approveDepositMutation.isPending}
                className='bg-green-600 hover:bg-green-700'
              >
                {approveDepositMutation.isPending
                  ? 'Approving...'
                  : 'Approve Deposit'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
