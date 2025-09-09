import { useAuthStore } from '@/stores/auth-store'

/**
 * Frontend validation to ensure only ADMIN users can access the dashboard
 * This provides an additional layer of security since backend validation may not exist
 */
export function validateAdminAccess(): boolean {
  const { auth } = useAuthStore.getState()

  // Check if user is authenticated
  if (!auth.isAuthenticated || !auth.user) {
    return false
  }

  // Check if user has ADMIN role
  if (auth.user.role !== 'ADMIN') {
    return false
  }

  // Check if user is active (default to true if not specified)
  if (auth.user.is_active === false) {
    return false
  }
  return true
}

/**
 * Hook to check admin access and redirect if not authorized
 */
export function useAdminGuard() {
  const { auth } = useAuthStore()

  // Check admin access using the reactive auth state from the hook
  const isAdmin =
    auth.isAuthenticated &&
    auth.user &&
    auth.user.role === 'ADMIN' &&
    auth.user.is_active !== false

  return {
    isAdmin,
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
  }
}

/**
 * Get user role display name
 */
export function getRoleDisplayName(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'Administrator'
    case 'FLEET_MANAGER':
      return 'Fleet Manager'
    case 'DRIVER':
      return 'Driver'
    case 'RIDER':
      return 'Rider'
    default:
      return role
  }
}

/**
 * Check if user has specific role or higher
 */
export function hasRoleOrHigher(
  userRole: string,
  requiredRole: string
): boolean {
  const roleHierarchy = {
    RIDER: 1,
    DRIVER: 2,
    FLEET_MANAGER: 3,
    ADMIN: 4,
  }

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0
  const requiredLevel =
    roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0

  return userLevel >= requiredLevel
}
