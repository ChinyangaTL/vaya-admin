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
import { type StudentVerification } from '../data/schema'
import { useStudentVerifications } from './student-verifications-provider'

type DataTableRowActionsProps = {
  row: Row<StudentVerification>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentStudent } = useStudentVerifications()
  const student = row.original

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
              setCurrentStudent(student)
              setOpen('view')
            }}
          >
            View Verification
            <DropdownMenuShortcut>
              <Eye size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {student.student_id && student.university_name && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setCurrentStudent(student)
                  setOpen('approve')
                }}
                className='text-green-600'
              >
                Approve Student
                <DropdownMenuShortcut>
                  <CheckCircle size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setCurrentStudent(student)
                  setOpen('reject')
                }}
                className='text-red-600'
              >
                Reject Student
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













