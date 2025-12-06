import { useQuery } from '@tanstack/react-query'
import { adminAPI } from '@/lib/api-client'

// Hook for getting signed bug report attachment URL
export function useBugReportAttachmentUrlQuery(filePath: string | null) {
  return useQuery({
    queryKey: ['bug-report-attachment-url', filePath],
    queryFn: async () => {
      if (!filePath) return null
      const response = await adminAPI.getBugReportAttachmentUrl(filePath)
      return response
    },
    enabled: !!filePath,
    staleTime: 5 * 60 * 1000, // 5 minutes (signed URLs typically expire in 1 hour, but we cache for 5 minutes)
    refetchOnWindowFocus: false,
  })
}

