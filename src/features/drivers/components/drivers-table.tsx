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
import { DataTablePagination } from '@/components/data-table'
import { DataTableToolbar } from '@/components/data-table'
import { approvalStatuses } from '../data/data'
import { type DriverProfile } from '../data/schema'
import { driversColumns } from './drivers-columns'

type DriversTableProps = {
  data: DriverProfile[]
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function DriversTable({ data, search, navigate }: DriversTableProps) {
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
      { columnId: 'user.email', searchKey: 'email', type: 'string' },
      { columnId: 'approval_status', searchKey: 'status', type: 'array' },
    ],
  })

  const tableInstance = useReactTable({
    data,
    columns: driversColumns,
    state: {
      rowSelection: {},
      pagination,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: () => {},
    onColumnFiltersChange: onColumnFiltersChange,
    onPaginationChange: onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  useEffect(() => {
    ensurePageInRange(tableInstance.getPageCount())
  }, [tableInstance, ensurePageInRange])

  return (
    <div className='space-y-4 max-sm:has-[div[role="toolbar"]]:mb-16'>
      <DataTableToolbar
        table={tableInstance}
        searchPlaceholder='Filter drivers...'
        searchKey='user.email'
        filters={[
          {
            columnId: 'approval_status',
            title: 'Status',
            options: approvalStatuses.map((status) => ({
              label: status.label,
              value: status.value,
            })),
          },
        ]}
        columnSearches={[
          { columnId: 'user.email', placeholder: 'Search by email...' },
          { columnId: 'driverName', placeholder: 'Search by name...' },
          { columnId: 'licensePlate', placeholder: 'Search by license plate...' },
          { columnId: 'route', placeholder: 'Search by route...' },
        ]}
      />
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {tableInstance.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
                        header.column.columnDef.meta?.className
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
            {tableInstance.getRowModel().rows?.length ? (
              tableInstance.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'p-4 align-middle [&:has([role=checkbox])]:pr-0',
                        cell.column.columnDef.meta?.className
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
                  colSpan={driversColumns.length}
                  className='h-24 text-center'
                >
                  No drivers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={tableInstance} />
    </div>
  )
}
