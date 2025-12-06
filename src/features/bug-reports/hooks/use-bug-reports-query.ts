import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminAPI } from '@/lib/api-client'
import { type BugReport } from '../data/schema'

// Hook for fetching all bug reports
export function useBugReportsQuery(params?: {
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  limit?: number
  offset?: number
}) {
  return useQuery({
    queryKey: ['bug-reports', params],
    queryFn: async () => {
      const response = await adminAPI.getBugReports(params)
      return response.payload as BugReport[]
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  })
}

// Hook for fetching a single bug report
export function useBugReportQuery(id: string) {
  return useQuery({
    queryKey: ['bug-report', id],
    queryFn: async () => {
      const response = await adminAPI.getBugReport(id)
      return response.payload as BugReport
    },
    enabled: !!id,
    staleTime: 30 * 1000,
  })
}

// Hook for updating a bug report
export function useUpdateBugReportMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: {
        title?: string
        description?: string
        status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
        severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
        resolutionNotes?: string
        assignedTo?: string | null
      }
    }) => {
      return await adminAPI.updateBugReport(id, data)
    },
    onSuccess: (_, variables) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['bug-reports'] })
      queryClient.invalidateQueries({
        queryKey: ['bug-report', variables.id],
      })
      toast.success('Bug report updated successfully')
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update bug report'
      toast.error(errorMessage)
    },
  })
}

// Hook for deleting a bug report
export function useDeleteBugReportMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return await adminAPI.deleteBugReport(id)
    },
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['bug-reports'] })
      toast.success('Bug report deleted successfully')
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete bug report'
      toast.error(errorMessage)
    },
  })
}

