import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import {
  CheckCircle,
  XCircle,
  Eye,
  BarChart3,
  DollarSign,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type DriverProfile } from '../data/schema'
import { useDrivers } from './drivers-provider'

type DataTableRowActionsProps = {
  row: Row<DriverProfile>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentDriver } = useDrivers()
  const driver = row.original

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
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

          <DropdownMenuItem
            onClick={() => {
              setCurrentDriver(driver)
              setOpen('performance')
            }}
          >
            Performance Metrics
            <DropdownMenuShortcut>
              <BarChart3 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setCurrentDriver(driver)
              setOpen('earnings')
            }}
          >
            Earnings Analytics
            <DropdownMenuShortcut>
              <DollarSign size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setCurrentDriver(driver)
              setOpen('analytics')
            }}
          >
            Period Analytics
            <DropdownMenuShortcut>
              <TrendingUp size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}



