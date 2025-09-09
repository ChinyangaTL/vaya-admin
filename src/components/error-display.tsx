import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface ErrorDisplayProps {
  error: string | null
  onDismiss: () => void
}

export function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (error) {
      setIsVisible(true)
      // Auto-dismiss after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onDismiss, 300) // Wait for animation
      }, 10000)
      
      return () => clearTimeout(timer)
    }
  }, [error, onDismiss])

  if (!error || !isVisible) {
    return null
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
      <Alert variant="destructive" className="relative">
        <AlertDescription className="pr-8">
          {error}
        </AlertDescription>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0"
          onClick={() => {
            setIsVisible(false)
            setTimeout(onDismiss, 300)
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  )
}
