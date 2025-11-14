import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Loader2,
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
} from 'lucide-react'
import { adminAPI } from '@/lib/api-client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ErrorDisplay } from '@/components/error-display'
import { useWalletTrackingStore } from '../stores/wallet-tracking-store'

export function UserSearch() {
  const [emailSearch, setEmailSearch] = useState('')
  const [phoneSearch, setPhoneSearch] = useState('')
  const { setSelectedUser } = useWalletTrackingStore()

  const {
    data: emailUser,
    isLoading: emailLoading,
    error: emailError,
    refetch: searchByEmail,
  } = useQuery({
    queryKey: ['admin', 'user-search', 'email', emailSearch],
    queryFn: () => adminAPI.searchUserByEmail(emailSearch),
    enabled: false, // Only run when manually triggered
  })

  const {
    data: phoneUser,
    isLoading: phoneLoading,
    error: phoneError,
    refetch: searchByPhone,
  } = useQuery({
    queryKey: ['admin', 'user-search', 'phone', phoneSearch],
    queryFn: () => adminAPI.searchUserByPhone(phoneSearch),
    enabled: false, // Only run when manually triggered
  })

  const handleEmailSearch = () => {
    if (emailSearch.trim()) {
      searchByEmail()
    }
  }

  const handlePhoneSearch = () => {
    if (phoneSearch.trim()) {
      searchByPhone()
    }
  }

  const handleUserSelect = (user: any) => {
    setSelectedUser(user)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive'
      case 'DRIVER':
        return 'default'
      case 'RIDER':
        return 'secondary'
      case 'FLEET_MANAGER':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <div className='space-y-6'>
      <Tabs defaultValue='email' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='email'>Search by Email</TabsTrigger>
          <TabsTrigger value='phone'>Search by Phone</TabsTrigger>
        </TabsList>

        <TabsContent value='email' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Mail className='h-5 w-5' />
                Search by Email Address
              </CardTitle>
              <CardDescription>
                Enter a user's email address to find their account and wallet
                information.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex gap-2'>
                <div className='flex-1'>
                  <Label htmlFor='email-search'>Email Address</Label>
                  <Input
                    id='email-search'
                    type='email'
                    placeholder='user@example.com'
                    value={emailSearch}
                    onChange={(e) => setEmailSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEmailSearch()}
                  />
                </div>
                <div className='flex items-end'>
                  <Button
                    onClick={handleEmailSearch}
                    disabled={emailLoading || !emailSearch.trim()}
                  >
                    {emailLoading ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Search className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </div>

              {emailError && (
                <ErrorDisplay
                  error={emailError.message || 'Failed to search user by email'}
                  onDismiss={() => {}}
                />
              )}

              {emailUser && (
                <div
                  className='cursor-pointer rounded-lg border border-green-200 bg-green-50 hover:bg-green-100'
                  onClick={() => handleUserSelect(emailUser)}
                >
                  <Card className='border-transparent bg-transparent shadow-none'>
                    <CardContent className='pt-6'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <div className='flex items-center gap-2'>
                            <User className='h-4 w-4 text-green-600' />
                            <span className='font-medium text-green-900'>
                              {emailUser.first_name && emailUser.last_name
                                ? `${emailUser.first_name} ${emailUser.last_name}`
                                : emailUser.email}
                            </span>
                            <Badge variant={getRoleBadgeVariant(emailUser.role)}>
                              {emailUser.role}
                            </Badge>
                          </div>
                          <div className='text-sm text-green-700'>
                            <div className='flex items-center gap-1'>
                              <Mail className='h-3 w-3' />
                              {emailUser.email}
                            </div>
                            {emailUser.phone && (
                              <div className='flex items-center gap-1'>
                                <Phone className='h-3 w-3' />
                                {emailUser.phone}
                              </div>
                            )}
                            <div className='flex items-center gap-1'>
                              <Calendar className='h-3 w-3' />
                              Joined {formatDate(emailUser.created_at)}
                            </div>
                            <div className='flex items-center gap-1'>
                              <Shield className='h-3 w-3' />
                              {emailUser.is_active ? 'Active' : 'Inactive'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='phone' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Phone className='h-5 w-5' />
                Search by Phone Number
              </CardTitle>
              <CardDescription>
                Enter a user's phone number to find their account and wallet
                information.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex gap-2'>
                <div className='flex-1'>
                  <Label htmlFor='phone-search'>Phone Number</Label>
                  <Input
                    id='phone-search'
                    type='tel'
                    placeholder='+26712345678'
                    value={phoneSearch}
                    onChange={(e) => setPhoneSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePhoneSearch()}
                  />
                </div>
                <div className='flex items-end'>
                  <Button
                    onClick={handlePhoneSearch}
                    disabled={phoneLoading || !phoneSearch.trim()}
                  >
                    {phoneLoading ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Search className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </div>

              {phoneError && (
                <ErrorDisplay
                  error={phoneError.message || 'Failed to search user by phone'}
                  onDismiss={() => {}}
                />
              )}

              {phoneUser && (
                <div
                  className='cursor-pointer rounded-lg border border-green-200 bg-green-50 hover:bg-green-100'
                  onClick={() => handleUserSelect(phoneUser)}
                >
                  <Card className='border-transparent bg-transparent shadow-none'>
                    <CardContent className='pt-6'>
                      <div className='flex items-start justify-between'>
                        <div className='space-y-2'>
                          <div className='flex items-center gap-2'>
                            <User className='h-4 w-4 text-green-600' />
                            <span className='font-medium text-green-900'>
                              {phoneUser.first_name && phoneUser.last_name
                                ? `${phoneUser.first_name} ${phoneUser.last_name}`
                                : phoneUser.email}
                            </span>
                            <Badge variant={getRoleBadgeVariant(phoneUser.role)}>
                              {phoneUser.role}
                            </Badge>
                          </div>
                          <div className='text-sm text-green-700'>
                            <div className='flex items-center gap-1'>
                              <Mail className='h-3 w-3' />
                              {phoneUser.email}
                            </div>
                            {phoneUser.phone && (
                              <div className='flex items-center gap-1'>
                                <Phone className='h-3 w-3' />
                                {phoneUser.phone}
                              </div>
                            )}
                            <div className='flex items-center gap-1'>
                              <Calendar className='h-3 w-3' />
                              Joined {formatDate(phoneUser.created_at)}
                            </div>
                            <div className='flex items-center gap-1'>
                              <Shield className='h-3 w-3' />
                              {phoneUser.is_active ? 'Active' : 'Inactive'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

