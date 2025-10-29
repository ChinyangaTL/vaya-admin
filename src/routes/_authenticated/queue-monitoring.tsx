import { createFileRoute } from '@tanstack/react-router'
import { QueueMonitoringPage } from '@/features/queue-monitoring'

export const Route = createFileRoute('/_authenticated/queue-monitoring')({
  component: QueueMonitoringPage,
})



