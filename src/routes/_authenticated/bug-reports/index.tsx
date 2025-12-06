import { createFileRoute } from '@tanstack/react-router'
import { BugReports } from '@/features/bug-reports'

export const Route = createFileRoute('/_authenticated/bug-reports/')({
  component: BugReports,
})

