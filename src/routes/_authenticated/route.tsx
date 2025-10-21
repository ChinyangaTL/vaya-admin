import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { validateAdminAccess } from '@/lib/auth-guard'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: async () => {
    // Check access - AuthInitializer will handle profile fetching
    const hasAccess = validateAdminAccess()

    console.log('_authenticated beforeLoad - Initial check:', {
      hasAccess,
      authState: useAuthStore.getState().auth,
    })

    if (!hasAccess) {
      // Add a small delay to ensure auth state is properly set
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Check again after delay
      const hasAccessAfterDelay = validateAdminAccess()

      console.log('_authenticated beforeLoad - After delay check:', {
        hasAccessAfterDelay,
        authState: useAuthStore.getState().auth,
      })

      if (!hasAccessAfterDelay) {
        throw redirect({
          to: '/sign-in',
        })
      }
    }
  },
})
