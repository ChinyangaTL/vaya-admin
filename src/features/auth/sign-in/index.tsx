import { useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'
import { DebugInfo } from '@/components/debug-info'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })
  

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Vaya Admin Dashboard</CardTitle>
          <CardDescription>
            Enter your administrator credentials to access the <br />
            Vaya transportation management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm redirectTo={redirect} />
        </CardContent>
        <CardFooter>
          <div className='text-center space-y-2'>
            <p className='text-muted-foreground text-sm'>
              <strong>Note:</strong> This dashboard is restricted to users with Administrator role only.
            </p>
            <p className='text-muted-foreground text-xs'>
              By clicking sign in, you agree to our{' '}
              <a
                href='/terms'
                className='hover:text-primary underline underline-offset-4'
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href='/privacy'
                className='hover:text-primary underline underline-offset-4'
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </CardFooter>
      </Card>
      <DebugInfo show={true} />
    </AuthLayout>
  )
}
