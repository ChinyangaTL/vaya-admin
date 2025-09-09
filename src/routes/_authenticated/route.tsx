import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { validateAdminAccess } from '@/lib/auth-guard'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: async () => {
    const { auth } = useAuthStore.getState()

    // If we have a token but no user, try to fetch the profile first
    if (auth.accessToken && !auth.user) {
      try {
        await auth.fetchProfile()
        // Wait a moment for state to update
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        // Profile fetch failed, will be handled by access check below
      }
    }

    // Check access after potential profile fetch
    const hasAccess = validateAdminAccess()

    if (!hasAccess) {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
})
