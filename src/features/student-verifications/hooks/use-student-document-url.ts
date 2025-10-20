import { useQuery } from '@tanstack/react-query'
import { adminAPI } from '@/lib/api-client'

// Hook for getting signed student document URL
export function useStudentDocumentUrlQuery(filePath: string | null) {
  return useQuery({
    queryKey: ['student-document-url', filePath],
    queryFn: async () => {
      if (!filePath) return null
      const response = await adminAPI.getStudentDocumentUrl(filePath)
      return response
    },
    enabled: !!filePath,
    staleTime: 5 * 60 * 1000, // 5 minutes (signed URLs typically expire in 60 seconds, but we cache for 5 minutes)
    refetchOnWindowFocus: false,
  })
}
