import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PendingDrivers } from '@/features/pending-drivers'

const pendingDriversSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z.array(z.string()).optional().catch([]),
  email: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/pending-drivers/')({
  component: PendingDrivers,
  validateSearch: pendingDriversSearchSchema,
})
