import { Link } from '@tanstack/react-router'
import { ShieldX, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface UnauthorizedAccessProps {
  userRole?: string
  userName?: string
}

export function UnauthorizedAccess({ userRole, userName }: UnauthorizedAccessProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <ShieldX className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access the Vaya Admin Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userName && userRole && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Logged in as:</strong> {userName}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Role:</strong> {userRole}
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              The Vaya Admin Dashboard is restricted to users with <strong>Administrator</strong> role only.
            </p>
            <p className="text-sm text-muted-foreground">
              If you believe this is an error, please contact your system administrator.
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link to="/sign-in">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Sign In with Different Account
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link to="/sign-in">
                Return to Sign In
              </Link>
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Need help? Contact{' '}
              <a 
                href="mailto:support@vaya-luyten.com" 
                className="text-primary hover:underline"
              >
                support@vaya-luyten.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
