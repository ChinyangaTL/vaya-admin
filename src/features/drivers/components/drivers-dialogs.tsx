import { DriversApproveDialog } from './drivers-approve-dialog'
import { useDrivers } from './drivers-provider'
import { DriversRejectDialog } from './drivers-reject-dialog'
import { DriversViewDialog } from './drivers-view-dialog'

export function DriversDialogs() {
  const { currentDriver } = useDrivers()

  return (
    <>
      <DriversViewDialog />

      {currentDriver && (
        <>
          <DriversApproveDialog />
          <DriversRejectDialog />
        </>
      )}
    </>
  )
}
