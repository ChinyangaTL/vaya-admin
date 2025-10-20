import { createFileRoute } from '@tanstack/react-router'
import { StudentVerifications } from '@/features/student-verifications'

export const Route = createFileRoute('/_authenticated/student-verifications')({
  component: StudentVerifications,
})










