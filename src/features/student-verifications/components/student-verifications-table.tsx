import { useEffect } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { type StudentVerification } from '../data/schema'
import { studentVerificationsColumns } from './student-verifications-columns'

type StudentVerificationsTableProps = {
  data: StudentVerification[]
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function StudentVerificationsTable({
  data,
  search,
  navigate,
}: StudentVerificationsTableProps) {
  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [
      // email per-column text filter
      { columnId: 'email', searchKey: 'email', type: 'string' },
      // phone per-column text filter
      { columnId: 'phone', searchKey: 'phone', type: 'string' },
      // student_id per-column text filter
      { columnId: 'student_id', searchKey: 'student_id', type: 'string' },
      // university_name per-column text filter
      {
        columnId: 'university_name',
        searchKey: 'university_name',
        type: 'string',
      },
    ],
  })

  const table = useReactTable({
    data,
    columns: studentVerificationsColumns,
    state: {
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onColumnFiltersChange,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  // Ensure pagination is within bounds when data changes
  useEffect(() => {
    ensurePageInRange(table.getPageCount())
  }, [data, ensurePageInRange, table])

  return (
    <div className='space-y-4'>
      <DataTableToolbar
        table={table}
        searchKey='email'
        searchPlaceholder='Search by email...'
      />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        header.column.columnDef.meta?.className,
                        'text-muted-foreground h-10 px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]'
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='h-12'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.columnDef.meta?.className,
                        'px-2 py-1 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]'
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={studentVerificationsColumns.length}
                  className='h-24 text-center'
                >
                  No student verifications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
