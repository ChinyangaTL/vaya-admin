import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminAPI } from '@/lib/api-client'
import { type StudentVerification } from '../data/schema'

// Hook for fetching pending student verifications
export function useStudentVerificationsQuery() {
  return useQuery({
    queryKey: ['student-verifications'],
    queryFn: async () => {
      const response = await adminAPI.getPendingStudentVerifications()
      return response as StudentVerification[]
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

// Hook for approving a student verification
export function useApproveStudentVerificationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      adminNotes,
    }: {
      userId: string
      adminNotes?: string
    }) => {
      return await adminAPI.approveStudentVerification(userId, adminNotes)
    },
    onSuccess: () => {
      // Invalidate and refetch student verifications
      queryClient.invalidateQueries({ queryKey: ['student-verifications'] })
    },
  })
}

// Hook for rejecting a student verification
export function useRejectStudentVerificationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      rejectionReason,
      adminNotes,
    }: {
      userId: string
      rejectionReason: string
      adminNotes?: string
    }) => {
      return await adminAPI.rejectStudentVerification(
        userId,
        rejectionReason,
        adminNotes
      )
    },
    onSuccess: () => {
      // Invalidate and refetch student verifications
      queryClient.invalidateQueries({ queryKey: ['student-verifications'] })
    },
  })
}







