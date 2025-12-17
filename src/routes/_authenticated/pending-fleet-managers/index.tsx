import { createFileRoute } from '@tanstack/react-router'
import { FleetManagersPending } from '@/features/fleet-managers/components/fleet-managers-pending'

export const Route = createFileRoute('/_authenticated/pending-fleet-managers/')({
  component: FleetManagersPending,
})

