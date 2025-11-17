/**
 * Wallet connection hook using ethers.js
 * 
 * Handles MetaMask detection, connection, and account management
 */

import { useState, useEffect, useCallback } from 'react'
import { BrowserProvider } from 'ethers'
import { useStore } from '@/store/useStore'
import toast from 'react-hot-toast'

declare global {
  interface Window {
    ethereum?: any
  }
}

export function useWallet() {
  const { wallet, setWallet, disconnectWallet } = useStore()
  const [isConnecting, setIsConnecting] = useState(false)

  // Check if MetaMask is installed
  const hasMetaMask = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'

  // Connect wallet
  const connect = useCallback(async () => {
    if (!hasMetaMask) {
      toast.error('Please install MetaMask to continue')
      return
    }

    setIsConnecting(true)

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const network = await provider.getNetwork()
      const balance = await provider.getBalance(address)

      setWallet({
        address,
        chainId: Number(network.chainId),
        isConnected: true,
        balance: balance.toString(),
      })

      toast.success('Wallet connected successfully')
    } catch (error: any) {
      console.error('Error connecting wallet:', error)
      toast.error(error.message || 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }, [hasMetaMask, setWallet])

  // Disconnect wallet
  const disconnect = useCallback(() => {
    disconnectWallet()
    toast.success('Wallet disconnected')
  }, [disconnectWallet])

  // Listen for account changes
  useEffect(() => {
    if (!hasMetaMask) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else {
        // Re-connect with new account
        connect()
      }
    }

    const handleChainChanged = () => {
      // Reload page on chain change (recommended by MetaMask)
      window.location.reload()
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [hasMetaMask, connect, disconnectWallet])

  // Check if already connected on mount
  useEffect(() => {
    if (!hasMetaMask) return

    const checkConnection = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        })

        if (accounts.length > 0) {
          await connect()
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }

    checkConnection()
  }, [hasMetaMask, connect])

  return {
    wallet,
    isConnecting,
    hasMetaMask,
    connect,
    disconnect,
  }
}
