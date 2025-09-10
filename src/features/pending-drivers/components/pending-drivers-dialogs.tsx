import { PendingDriversApproveDialog } from './pending-drivers-approve-dialog'
import { PendingDriversRejectDialog } from './pending-drivers-reject-dialog'
import { PendingDriversViewDialog } from './pending-drivers-view-dialog'

export function PendingDriversDialogs() {
  return (
    <>
      <PendingDriversViewDialog />
      <PendingDriversApproveDialog />
      <PendingDriversRejectDialog />
    </>
  )
}
