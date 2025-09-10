import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Drivers } from '@/features/drivers'
import { approvalStatuses } from '@/features/drivers/data/data'

const driversSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  status: z
    .array(
      z.enum(
        approvalStatuses.map(
          (s) => s.value as (typeof approvalStatuses)[number]['value']
        )
      )
    )
    .optional()
    .catch([]),
  // Per-column text filter
  email: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/drivers/')({
  validateSearch: driversSearchSchema,
  component: Drivers,
})
