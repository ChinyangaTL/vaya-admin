import {
  LayoutDashboard,
  Monitor,
  HelpCircle,
  Bell,
  Package,
  Palette,
  Settings,
  Wrench,
  UserCog,
  UserX,
  Users,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Wallet,
  GraduationCap,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Vaya Admin',
    email: 'admin@vaya-luyten.com',
    avatar: '/avatars/vaya-admin.jpg',
  },
  teams: [
    {
      name: 'Vaya Transportation',
      logo: Command,
      plan: 'Admin Dashboard',
    },
    {
      name: 'Vaya Fleet',
      logo: GalleryVerticalEnd,
      plan: 'Fleet Management',
    },
    {
      name: 'Vaya Analytics',
      logo: AudioWaveform,
      plan: 'Analytics Hub',
    },
  ],
  navGroups: [
    {
      title: 'Management',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Drivers',
          url: '/drivers',
          icon: Users,
        },
        {
          title: 'Pending Drivers',
          url: '/pending-drivers',
          icon: UserX,
        },
        {
          title: 'Student Verifications',
          url: '/student-verifications',
          icon: GraduationCap,
        },
        {
          title: 'Routes',
          url: '/routes',
          icon: Package,
        },
        {
          title: 'Users',
          url: '/users',
          icon: UserCog,
        },
        {
          title: 'Wallet',
          url: '/wallet',
          icon: Wallet,
        },
      ],
    },
    {
      title: 'Operations',
      items: [
        {
          title: 'Notifications',
          url: '/notifications',
          icon: Bell,
        },
        {
          title: 'Analytics',
          url: '/analytics',
          icon: AudioWaveform,
        },
        {
          title: 'System Monitor',
          url: '/monitoring',
          icon: Monitor,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
