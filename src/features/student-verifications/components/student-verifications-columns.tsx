import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type StudentVerification } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const studentVerificationsColumns: ColumnDef<StudentVerification>[] = [
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
    id: 'email',
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36 ps-3'>{row.getValue('email')}</LongText>
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
    id: 'phone',
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-32'>{row.getValue('phone')}</LongText>
    ),
    meta: { className: 'w-32' },
  },
  {
    id: 'student_id',
    accessorKey: 'student_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Student ID' />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap'>
        {row.getValue('student_id') || 'N/A'}
      </div>
    ),
  },
  {
    id: 'university_name',
    accessorKey: 'university_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='University' />
    ),
    cell: ({ row }) => (
      <div className='max-w-40 truncate'>
        {row.getValue('university_name') || 'N/A'}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: 'verification_submitted_at',
    accessorKey: 'verification_submitted_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Submitted' />
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue('verification_submitted_at')
      if (!dateValue)
        return (
          <div className='text-muted-foreground text-sm'>Not submitted</div>
        )

      const date =
        dateValue instanceof Date ? dateValue : new Date(dateValue as string)
      return <div className='text-sm'>{date.toLocaleDateString()}</div>
    },
    enableHiding: false,
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Registered' />
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
