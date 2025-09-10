import { useQuery } from '@tanstack/react-query'
import { adminAPI } from '@/lib/api-client'

export function useDocumentUrlQuery(documentId: string) {
  return useQuery({
    queryKey: ['document-url', documentId],
    queryFn: async () => {
      const response = await adminAPI.getDocumentUrl(documentId)
      return response
    },
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
