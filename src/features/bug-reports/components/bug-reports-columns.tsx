import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import {
  type BugReport,
  bugReportStatusLabels,
  bugReportStatusColors,
  bugReportSeverityLabels,
  bugReportSeverityColors,
} from '../data/schema'
import { BugReportsRowActions } from './bug-reports-row-actions'

export const bugReportsColumns: ColumnDef<BugReport>[] = [
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
    id: 'title',
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48 ps-3 font-medium'>
        {row.getValue('title')}
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
    id: 'description',
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-64 text-muted-foreground'>
        {row.getValue('description')}
      </LongText>
    ),
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as keyof typeof bugReportStatusLabels
      const label = bugReportStatusLabels[status]
      const color = bugReportStatusColors[status]

      return (
        <Badge variant='outline' className={cn('capitalize', color)}>
          {label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: false,
  },
  {
    id: 'severity',
    accessorKey: 'severity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Severity' />
    ),
    cell: ({ row }) => {
      const severity = row.getValue('severity') as keyof typeof bugReportSeverityLabels
      const label = bugReportSeverityLabels[severity]
      const color = bugReportSeverityColors[severity]

      return (
        <Badge variant='outline' className={cn('capitalize', color)}>
          {label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'reporter',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Reporter' />
    ),
    cell: ({ row }) => {
      const bugReport = row.original
      if (bugReport.reporter) {
        const name =
          bugReport.reporter.firstName && bugReport.reporter.lastName
            ? `${bugReport.reporter.firstName} ${bugReport.reporter.lastName}`
            : bugReport.reporter.email || bugReport.reporter.phone || 'User'
        return <LongText className='max-w-32'>{name}</LongText>
      }
      return (
        <span className='text-muted-foreground'>
          {bugReport.reporter_email || 'Anonymous'}
        </span>
      )
    },
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Reported' />
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue('created_at') as string
      const date = new Date(dateValue)
      return <div className='text-sm'>{date.toLocaleDateString()}</div>
    },
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <BugReportsRowActions row={row} />,
    enableHiding: false,
  },
]

