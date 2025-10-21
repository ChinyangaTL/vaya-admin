import { MagnifyingGlassIcon, Cross2Icon } from '@radix-ui/react-icons'
import { type Column } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type DataTableColumnSearchProps<TData, TValue> = {
  column: Column<TData, TValue>
  placeholder: string
}

export function DataTableColumnSearch<TData, TValue>({
  column,
  placeholder,
}: DataTableColumnSearchProps<TData, TValue>) {
  const filterValue = (column.getFilterValue() as string) ?? ''

  return (
    <div className='relative flex items-center'>
      <MagnifyingGlassIcon className='absolute left-2 h-4 w-4 text-muted-foreground' />
      <Input
        placeholder={placeholder}
        value={filterValue}
        onChange={(event) => column.setFilterValue(event.target.value)}
        className='h-8 w-[120px] pl-8 pr-8'
      />
      {filterValue && (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => column.setFilterValue('')}
          className='absolute right-1 h-6 w-6 p-0 hover:bg-transparent'
        >
          <Cross2Icon className='h-3 w-3' />
        </Button>
      )}
    </div>
  )
}
