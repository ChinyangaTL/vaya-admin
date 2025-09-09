import { useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { authAPI } from '@/lib/api-client'
import { Button } from '@/components/ui/button'

interface DebugInfoProps {
  show?: boolean
}

export function DebugInfo({ show = false }: DebugInfoProps) {
  const { auth } = useAuthStore()
  const [apiStatus, setApiStatus] = useState<string>('Unknown')
  const [testingApi, setTestingApi] = useState(false)
  
  if (!show || import.meta.env.PROD) {
    return null
  }
  
  const testApiConnection = async () => {
    setTestingApi(true)
    try {
      await authAPI.healthCheck()
      setApiStatus('✅ Connected')
    } catch (error) {
      console.error('API Test Error:', error)
      setApiStatus('❌ Failed')
    } finally {
      setTestingApi(false)
    }
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-4 shadow-lg max-w-sm text-xs">
      <h4 className="font-semibold mb-2">Debug Info</h4>
      <div className="space-y-1">
        <div><strong>Authenticated:</strong> {auth.isAuthenticated ? 'Yes' : 'No'}</div>
        <div><strong>Loading:</strong> {auth.isLoading ? 'Yes' : 'No'}</div>
        <div><strong>Has Token:</strong> {auth.accessToken ? 'Yes' : 'No'}</div>
        <div><strong>User:</strong> {auth.user ? `${auth.user.email} (${auth.user.role})` : 'None'}</div>
        <div><strong>API Base:</strong> https://api.vaya-luyten.com/api</div>
        <div><strong>API Status:</strong> {apiStatus}</div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={testApiConnection}
          disabled={testingApi}
          className="mt-2 w-full"
        >
          {testingApi ? 'Testing...' : 'Test API'}
        </Button>
      </div>
    </div>
  )
}
