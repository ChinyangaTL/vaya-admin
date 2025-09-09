import { Shield, UserCheck, Users, Car } from 'lucide-react'

export const statusTypes = new Map<boolean, string>([
  [true, 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  [false, 'bg-neutral-300/40 border-neutral-300'],
])

export const roles = [
  {
    label: 'Administrator',
    value: 'ADMIN',
    icon: Shield,
  },
  {
    label: 'Fleet Manager',
    value: 'FLEET_MANAGER',
    icon: UserCheck,
  },
  {
    label: 'Driver',
    value: 'DRIVER',
    icon: Car,
  },
  {
    label: 'Rider',
    value: 'RIDER',
    icon: Users,
  },
] as const
