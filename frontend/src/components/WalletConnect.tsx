'use client'

import { Wallet } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { Button } from '@/components/ui/Button'
import { formatAddress, formatEth } from '@/lib/utils'

export function WalletConnect() {
  const { wallet, isConnecting, hasMetaMask, connect, disconnect } = useWallet()

  if (!hasMetaMask) {
    return (
      <div className="rounded-xl border-2 border-orange-300 bg-orange-50 p-4 text-orange-900">
        <p className="text-sm font-medium">
          MetaMask not detected. Please install MetaMask to use this application.
        </p>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-semibold text-orange-700 underline hover:text-orange-900"
        >
          Install MetaMask →
        </a>
      </div>
    )
  }

  if (wallet.isConnected && wallet.address) {
    return (
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-charcoal-200 bg-white px-4 py-2 shadow-sm">
          <div className="text-xs text-charcoal-500">Balance</div>
          <div className="font-semibold text-charcoal-900">
            {formatEth(wallet.balance)} ETH
          </div>
        </div>
        <div className="rounded-xl border border-charcoal-200 bg-white px-4 py-2 shadow-sm">
          <div className="text-xs text-charcoal-500">Address</div>
          <div className="font-mono font-semibold text-charcoal-900">
            {formatAddress(wallet.address)}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={connect}
      isLoading={isConnecting}
      className="gap-2"
      aria-label="Connect wallet"
    >
      <Wallet className="h-5 w-5" />
      Connect Wallet
    </Button>
  )
}
