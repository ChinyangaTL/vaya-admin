import { DataTable } from '@/components/data-table'
import { DataTableToolbar } from '@/components/data-table/toolbar'
import { Admin } from '../data/schema'
import { adminsColumns } from './admins-columns'

interface AdminsTableProps {
  data: Admin[]
}

export function AdminsTable({ data }: AdminsTableProps) {
  return (
    <DataTable
      columns={adminsColumns}
      data={data}
      toolbar={(table) => <DataTableToolbar table={table} />}
    />
  )
}
