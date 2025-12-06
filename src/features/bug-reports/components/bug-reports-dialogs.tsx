import { BugReportsViewDialog } from './bug-reports-view-dialog'
import { BugReportsUpdateDialog } from './bug-reports-update-dialog'
import { BugReportsDeleteDialog } from './bug-reports-delete-dialog'

export function BugReportsDialogs() {
  return (
    <>
      <BugReportsViewDialog />
      <BugReportsUpdateDialog />
      <BugReportsDeleteDialog />
    </>
  )
}

