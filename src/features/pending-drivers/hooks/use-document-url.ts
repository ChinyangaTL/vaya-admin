import { useQuery } from '@tanstack/react-query'
import { adminAPI } from '@/lib/api-client'

// Hook for getting signed document URL
export function useDocumentUrlQuery(documentId: string) {
  return useQuery({
    queryKey: ['document-url', documentId],
    queryFn: async () => {
      const response = await adminAPI.getDocumentUrl(documentId)
      return response
    },
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000, // 5 minutes (signed URLs typically expire in 60 seconds, but we cache for 5 minutes)
    refetchOnWindowFocus: false,
  })
}
