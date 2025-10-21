import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon } from '@radix-ui/react-icons'
import { type Column } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type DataTableSortableHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>
  title: string
  className?: string
}

export function DataTableSortableHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableSortableHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className={cn(className)}>{title}</span>
  }

  return (
    <Button
      variant='ghost'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className={cn(
        'h-auto p-0 font-semibold hover:bg-transparent',
        className
      )}
    >
      <span>{title}</span>
      {column.getIsSorted() === 'asc' ? (
        <ArrowUpIcon className='ml-2 h-4 w-4' />
      ) : column.getIsSorted() === 'desc' ? (
        <ArrowDownIcon className='ml-2 h-4 w-4' />
      ) : (
        <CaretSortIcon className='ml-2 h-4 w-4' />
      )}
    </Button>
  )
}
