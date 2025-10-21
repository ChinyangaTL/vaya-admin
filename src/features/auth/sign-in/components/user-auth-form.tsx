import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore, type VayaUser } from '@/stores/auth-store'
import { authAPI } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ErrorDisplay } from '@/components/error-display'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(7, 'Password must be at least 7 characters long'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { auth } = useAuthStore()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    auth.setLoading(true)
    setError(null) // Clear any previous errors

    try {
      // Call Vaya API for authentication
      const response = await authAPI.login(data.email, data.password)

      const { accessToken, user } = response

      // Check if user has ADMIN role (required for admin dashboard)
      if (user.role !== 'ADMIN') {
        const errorMsg = `Access denied. You have ${user.role} role. Administrator role required for this dashboard.`
        setError(errorMsg)
        toast.error(errorMsg)
        auth.setLoading(false)
        setIsLoading(false)
        return
      }

      // Set tokens and user in store (refresh token is handled via cookies)
      // The user object from API already has the required fields
      const completeUser: VayaUser = {
        ...user,
        // Set defaults for optional fields if not provided
        phone: user.phone || '',
        is_active: user.is_active ?? true,
        created_at: user.created_at || new Date().toISOString(),
        updated_at: user.updated_at || new Date().toISOString(),
      }

      auth.setAuthData(accessToken, completeUser)

      const displayName =
        user.first_name && user.last_name
          ? `${user.first_name} ${user.last_name}`
          : user.email

      toast.success(`Welcome back, ${displayName}!`)

      // Debug: Log auth state after setting
      console.log('Auth state after login:', {
        isAuthenticated: auth.isAuthenticated,
        hasUser: !!auth.user,
        userRole: auth.user?.role,
        hasToken: !!auth.accessToken,
      })

      // Wait a moment for auth state to be fully updated, then navigate
      setTimeout(() => {
        // Debug: Log auth state before navigation
        console.log('Auth state before navigation:', {
          isAuthenticated: auth.isAuthenticated,
          hasUser: !!auth.user,
          userRole: auth.user?.role,
          hasToken: !!auth.accessToken,
        })

        // Use router navigation instead of window.location
        navigate({ to: '/' })
      }, 200)
    } catch (error: unknown) {
      // Handle specific error messages from Vaya API
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: {
            status?: number
            data?: {
              message?: string
              success?: boolean
              error?: string
            }
          }
        }

        const status = axiosError.response?.status
        const errorData = axiosError.response?.data

        let errorMessage = 'Login failed. Please try again.'

        if (status === 401) {
          errorMessage =
            'Invalid email or password. Please check your credentials.'
        } else if (status === 403) {
          errorMessage =
            'Access denied. Administrator role required for this dashboard.'
        } else if (status === 400) {
          // Handle validation errors from Vaya API
          errorMessage =
            errorData?.message || 'Please check your input and try again.'
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.'
        } else if (errorData?.message) {
          errorMessage = errorData.message
        } else if (errorData?.error) {
          errorMessage = errorData.error
        }

        setError(errorMessage)
        toast.error(errorMessage)
      } else {
        const errorMessage =
          'Network error. Please check your connection and try again.'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } finally {
      auth.setLoading(false)
      setIsLoading(false)
    }
  }

  return (
    <>
      <ErrorDisplay error={error} onDismiss={() => setError(null)} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('grid gap-3', className)}
          {...props}
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='name@example.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='relative'>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder='********' {...field} />
                </FormControl>
                <FormMessage />
                <Link
                  to='/forgot-password'
                  className='text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75'
                >
                  Forgot password?
                </Link>
              </FormItem>
            )}
          />
          <Button
            className='mt-2'
            disabled={isLoading || auth.isLoading}
            type='submit'
          >
            {isLoading || auth.isLoading ? (
              <Loader2 className='animate-spin' />
            ) : (
              <LogIn />
            )}
            {isLoading || auth.isLoading
              ? 'Signing in...'
              : 'Sign in to Vaya Admin'}
          </Button>
        </form>
      </Form>
    </>
  )
}
