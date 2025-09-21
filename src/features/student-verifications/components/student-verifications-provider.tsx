import { createContext, useContext, useState } from 'react'
import { type StudentVerification } from '../data/schema'

type StudentVerificationsDialogType = 'view' | 'approve' | 'reject'

interface StudentVerificationsContextType {
  open: StudentVerificationsDialogType | null
  setOpen: (str: StudentVerificationsDialogType | null) => void
  currentStudent: StudentVerification | null
  setCurrentStudent: (student: StudentVerification | null) => void
  selectedStudents: StudentVerification[]
  setSelectedStudents: (students: StudentVerification[]) => void
}

const StudentVerificationsContext = createContext<
  StudentVerificationsContextType | undefined
>(undefined)

export function StudentVerificationsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState<StudentVerificationsDialogType | null>(null)
  const [currentStudent, setCurrentStudent] =
    useState<StudentVerification | null>(null)
  const [selectedStudents, setSelectedStudents] = useState<
    StudentVerification[]
  >([])

  return (
    <StudentVerificationsContext.Provider
      value={{
        open: open as StudentVerificationsDialogType | null,
        setOpen: setOpen as (
          str: StudentVerificationsDialogType | null
        ) => void,
        currentStudent,
        setCurrentStudent,
        selectedStudents,
        setSelectedStudents,
      }}
    >
      {children}
    </StudentVerificationsContext.Provider>
  )
}

export function useStudentVerifications() {
  const context = useContext(StudentVerificationsContext)
  if (context === undefined) {
    throw new Error(
      'useStudentVerifications must be used within a StudentVerificationsProvider'
    )
  }
  return context
}

