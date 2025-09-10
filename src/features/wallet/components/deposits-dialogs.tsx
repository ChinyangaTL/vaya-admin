import { DepositsApproveDialog } from './deposits-approve-dialog'
import { useDeposits } from './deposits-provider'
import { DepositsRejectDialog } from './deposits-reject-dialog'
import { DepositsViewDialog } from './deposits-view-dialog'

export function DepositsDialogs() {
  const { open } = useDeposits()

  return (
    <>
      {open === 'view' && <DepositsViewDialog />}
      {open === 'approve' && <DepositsApproveDialog />}
      {open === 'reject' && <DepositsRejectDialog />}
    </>
  )
}
