import { StudentVerificationsApproveDialog } from './student-verifications-approve-dialog'
import { StudentVerificationsRejectDialog } from './student-verifications-reject-dialog'
import { StudentVerificationsViewDialog } from './student-verifications-view-dialog'

export function StudentVerificationsDialogs() {
  return (
    <>
      <StudentVerificationsViewDialog />
      <StudentVerificationsApproveDialog />
      <StudentVerificationsRejectDialog />
    </>
  )
}










