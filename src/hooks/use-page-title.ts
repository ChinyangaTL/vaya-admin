import { useEffect } from 'react'

export function usePageTitle(title: string) {
  useEffect(() => {
    const baseTitle = 'Vaya Admin Dashboard'
    document.title = title ? `${title} | ${baseTitle}` : baseTitle

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = baseTitle
    }
  }, [title])
}





