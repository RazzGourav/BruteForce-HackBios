import { create } from 'zustand'
import { WalletState, Factory } from '@/types'

interface AppState {
  // Wallet state
  wallet: WalletState
  setWallet: (wallet: Partial<WalletState>) => void
  disconnectWallet: () => void

  // Factory state (for factory dashboard)
  currentFactory: Factory | null
  setCurrentFactory: (factory: Factory | null) => void

  // Global factories list (for admin)
  factories: Factory[]
  setFactories: (factories: Factory[]) => void
  updateFactory: (factoryId: string, updates: Partial<Factory>) => void

  // UI state
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export const useStore = create<AppState>((set) => ({
  // Wallet
  wallet: {
    address: null,
    chainId: null,
    isConnected: false,
    balance: '0',
  },
  setWallet: (wallet) =>
    set((state) => ({
      wallet: { ...state.wallet, ...wallet },
    })),
  disconnectWallet: () =>
    set({
      wallet: {
        address: null,
        chainId: null,
        isConnected: false,
        balance: '0',
      },
    }),

  // Factory
  currentFactory: null,
  setCurrentFactory: (factory) => set({ currentFactory: factory }),

  // Factories list
  factories: [],
  setFactories: (factories) => set({ factories }),
  updateFactory: (factoryId, updates) =>
    set((state) => ({
      factories: state.factories.map((f) =>
        f.id === factoryId ? { ...f, ...updates } : f
      ),
    })),

  // UI
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}))
