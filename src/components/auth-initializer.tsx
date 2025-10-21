import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'

/**
 * Component that initializes authentication state on app load
 * Fetches user profile if we have a token but no user data
 */
export function AuthInitializer() {
  const { auth } = useAuthStore()
  const hasFetched = useRef(false)
  const isFetching = useRef(false)

  useEffect(() => {
    // If we have a token but no user, fetch the profile
    if (
      auth.accessToken &&
      !auth.user &&
      !auth.isLoading &&
      !hasFetched.current &&
      !isFetching.current
    ) {
      // Additional check: make sure we're not on auth pages to prevent loops
      if (
        window.location.pathname.startsWith('/sign-in') ||
        window.location.pathname.startsWith('/sign-up')
      ) {
        return
      }

      hasFetched.current = true
      isFetching.current = true

      // Don't set loading here - let fetchProfile handle its own loading state
      auth.fetchProfile().finally(() => {
        isFetching.current = false
      })
    }
  }, [auth.accessToken, auth.user, auth.isLoading, auth.fetchProfile])

  // This component doesn't render anything
  return null
}
