import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { approvalStatuses } from '../data/data'
import { type PendingDriverProfile } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const pendingDriversColumns: ColumnDef<PendingDriverProfile>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'user.email',
    accessorKey: 'user.email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36 ps-3'>
        {row.getValue('user.email')}
      </LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    id: 'driverName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Driver Name' />
    ),
    cell: ({ row }) => {
      const { firstName, lastName } = row.original
      const fullName =
        firstName && lastName ? `${firstName} ${lastName}` : 'N/A'
      return <LongText className='max-w-36'>{fullName}</LongText>
    },
    meta: { className: 'w-36' },
  },
  {
    id: 'licensePlate',
    accessorKey: 'licensePlate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='License Plate' />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap'>
        {row.getValue('licensePlate') || 'N/A'}
      </div>
    ),
  },
  {
    id: 'route',
    accessorKey: 'route',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Route' />
    ),
    cell: ({ row }) => <div>{row.getValue('route') || 'N/A'}</div>,
    enableSorting: false,
  },
  {
    id: 'approval_status',
    accessorKey: 'approval_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('approval_status') as string
      const statusConfig = approvalStatuses.find((s) => s.value === status)

      if (!statusConfig) {
        return <span className='text-sm'>{status}</span>
      }

      return (
        <div className='flex items-center gap-x-2'>
          <Badge
            variant='outline'
            className={cn('capitalize', statusConfig.color)}
          >
            {statusConfig.label}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Applied' />
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue('created_at')
      const date =
        dateValue instanceof Date ? dateValue : new Date(dateValue as string)
      return <div className='text-sm'>{date.toLocaleDateString()}</div>
    },
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableHiding: false,
  },
]
