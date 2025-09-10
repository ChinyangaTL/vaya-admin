import { WithdrawalsApproveDialog } from './withdrawals-approve-dialog'
import { useWithdrawals } from './withdrawals-provider'
import { WithdrawalsRejectDialog } from './withdrawals-reject-dialog'
import { WithdrawalsViewDialog } from './withdrawals-view-dialog'

export function WithdrawalsDialogs() {
  const { open } = useWithdrawals()

  return (
    <>
      {open === 'view' && <WithdrawalsViewDialog />}
      {open === 'approve' && <WithdrawalsApproveDialog />}
      {open === 'reject' && <WithdrawalsRejectDialog />}
    </>
  )
}
