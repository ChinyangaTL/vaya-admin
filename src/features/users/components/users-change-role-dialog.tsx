import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminAPI } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { roles } from '../data/data'
import { useUsers } from './users-provider'

const changeRoleSchema = z.object({
  role: z.enum(['RIDER', 'DRIVER', 'FLEET_MANAGER', 'ADMIN'], {
    required_error: 'Please select a role',
  }),
  reason: z.string().min(10, 'Please provide a reason (minimum 10 characters)'),
})

type ChangeRoleFormData = z.infer<typeof changeRoleSchema>

export function UsersChangeRoleDialog() {
  const { open, setOpen, currentRow } = useUsers()
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<ChangeRoleFormData>({
    resolver: zodResolver(changeRoleSchema),
    defaultValues: {
      role: currentRow?.role || 'RIDER',
      reason: '',
    },
  })

  const isOpen = open === 'changeRole'

  const onSubmit = async (data: ChangeRoleFormData) => {
    if (!currentRow) return

    setIsLoading(true)
    try {
      await adminAPI.updateUserRole(currentRow.id, data.role)

      toast.success(
        `User role updated to ${roles.find((r) => r.value === data.role)?.label}`
      )
      setOpen(null)
      form.reset()

      // Refresh the users list
      queryClient.invalidateQueries({ queryKey: ['users'] })
    } catch (error) {
      toast.error('Failed to update user role. Please try again.')
      console.error('Role update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(null)
    form.reset()
  }

  if (!currentRow) return null

  const currentRoleLabel =
    roles.find((r) => r.value === currentRow.role)?.label || currentRow.role
  const userName =
    currentRow.first_name && currentRow.last_name
      ? `${currentRow.first_name} ${currentRow.last_name}`
      : currentRow.email

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Update the role for <strong>{userName}</strong>. Current role:{' '}
            <strong>{currentRoleLabel}</strong>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a role' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className='flex items-center gap-2'>
                            {role.icon && <role.icon size={16} />}
                            {role.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='reason'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Change</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain why you are changing this user's role..."
                      className='resize-none'
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleClose}>
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Role'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
