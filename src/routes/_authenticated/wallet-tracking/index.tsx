import { createFileRoute } from '@tanstack/react-router'
import { WalletTracking } from '@/features/wallet-tracking'

export const Route = createFileRoute('/_authenticated/wallet-tracking/')({
  component: WalletTracking,
})

