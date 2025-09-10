import { type Row } from '@tanstack/react-table'
import { Eye, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type PendingDriverProfile } from '../data/schema'
import { usePendingDrivers } from './pending-drivers-provider'

type DataTableRowActionsProps = {
  row: Row<PendingDriverProfile>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentDriver } = usePendingDrivers()
  const driver = row.original

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <MoreHorizontal className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[200px]'>
          <DropdownMenuItem
            onClick={() => {
              setCurrentDriver(driver)
              setOpen('view')
            }}
          >
            View Profile
            <DropdownMenuShortcut>
              <Eye size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {driver.approval_status === 'PENDING' && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setCurrentDriver(driver)
                  setOpen('approve')
                }}
                className='text-green-600'
              >
                Approve Driver
                <DropdownMenuShortcut>
                  <CheckCircle size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setCurrentDriver(driver)
                  setOpen('reject')
                }}
                className='text-red-600'
              >
                Reject Driver
                <DropdownMenuShortcut>
                  <XCircle size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
