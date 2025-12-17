import { createFileRoute } from '@tanstack/react-router'
import { FleetManagersAll } from '@/features/fleet-managers/components/fleet-managers-all'

export const Route = createFileRoute('/_authenticated/fleet-managers/')({
  component: FleetManagersAll,
})

