import { describe, it, expect, beforeEach } from 'vitest'
import { validateAdminAccess, getRoleDisplayName, hasRoleOrHigher } from '../auth-guard'

// Mock the auth store
const mockAuthStore = {
  auth: {
    isAuthenticated: false,
    user: null,
  },
}

// Mock the useAuthStore
vi.mock('@/stores/auth-store', () => ({
  useAuthStore: {
    getState: () => mockAuthStore,
  },
}))

describe('Auth Guard', () => {
  beforeEach(() => {
    // Reset mock state
    mockAuthStore.auth.isAuthenticated = false
    mockAuthStore.auth.user = null
  })

  describe('validateAdminAccess', () => {
    it('should return false when user is not authenticated', () => {
      mockAuthStore.auth.isAuthenticated = false
      mockAuthStore.auth.user = null
      
      expect(validateAdminAccess()).toBe(false)
    })

    it('should return false when user is authenticated but not admin', () => {
      mockAuthStore.auth.isAuthenticated = true
      mockAuthStore.auth.user = {
        id: '1',
        email: 'driver@example.com',
        phone: '+1234567890',
        role: 'DRIVER',
        is_active: true,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
      }
      
      expect(validateAdminAccess()).toBe(false)
    })

    it('should return false when admin user is inactive', () => {
      mockAuthStore.auth.isAuthenticated = true
      mockAuthStore.auth.user = {
        id: '1',
        email: 'admin@example.com',
        phone: '+1234567890',
        role: 'ADMIN',
        is_active: false,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
      }
      
      expect(validateAdminAccess()).toBe(false)
    })

    it('should return true when user is authenticated admin and active', () => {
      mockAuthStore.auth.isAuthenticated = true
      mockAuthStore.auth.user = {
        id: '1',
        email: 'admin@example.com',
        phone: '+1234567890',
        role: 'ADMIN',
        is_active: true,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
      }
      
      expect(validateAdminAccess()).toBe(true)
    })
  })

  describe('getRoleDisplayName', () => {
    it('should return correct display names for all roles', () => {
      expect(getRoleDisplayName('ADMIN')).toBe('Administrator')
      expect(getRoleDisplayName('FLEET_MANAGER')).toBe('Fleet Manager')
      expect(getRoleDisplayName('DRIVER')).toBe('Driver')
      expect(getRoleDisplayName('RIDER')).toBe('Rider')
      expect(getRoleDisplayName('UNKNOWN')).toBe('UNKNOWN')
    })
  })

  describe('hasRoleOrHigher', () => {
    it('should correctly check role hierarchy', () => {
      // Admin should have access to everything
      expect(hasRoleOrHigher('ADMIN', 'ADMIN')).toBe(true)
      expect(hasRoleOrHigher('ADMIN', 'FLEET_MANAGER')).toBe(true)
      expect(hasRoleOrHigher('ADMIN', 'DRIVER')).toBe(true)
      expect(hasRoleOrHigher('ADMIN', 'RIDER')).toBe(true)

      // Fleet Manager should have access to Driver and Rider
      expect(hasRoleOrHigher('FLEET_MANAGER', 'FLEET_MANAGER')).toBe(true)
      expect(hasRoleOrHigher('FLEET_MANAGER', 'DRIVER')).toBe(true)
      expect(hasRoleOrHigher('FLEET_MANAGER', 'RIDER')).toBe(true)
      expect(hasRoleOrHigher('FLEET_MANAGER', 'ADMIN')).toBe(false)

      // Driver should only have access to Rider
      expect(hasRoleOrHigher('DRIVER', 'DRIVER')).toBe(true)
      expect(hasRoleOrHigher('DRIVER', 'RIDER')).toBe(true)
      expect(hasRoleOrHigher('DRIVER', 'FLEET_MANAGER')).toBe(false)
      expect(hasRoleOrHigher('DRIVER', 'ADMIN')).toBe(false)

      // Rider should only have access to Rider
      expect(hasRoleOrHigher('RIDER', 'RIDER')).toBe(true)
      expect(hasRoleOrHigher('RIDER', 'DRIVER')).toBe(false)
      expect(hasRoleOrHigher('RIDER', 'FLEET_MANAGER')).toBe(false)
      expect(hasRoleOrHigher('RIDER', 'ADMIN')).toBe(false)
    })
  })
})
