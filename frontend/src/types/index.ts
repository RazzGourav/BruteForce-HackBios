// Core type definitions for Pollu-Stake

export interface Factory {
  id: string
  name: string
  address: string
  location: {
    lat: number
    lng: number
    city: string
  }
  stakeBalance: string // in ETH
  licenseNftId: string | null
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  complianceScore: number // 0-100
  lastForecast: ForecastData | null
}

export interface ForecastData {
  factory_id: string
  forecast_breach: boolean
  confidence: number // 0-1
  predicted_aqi: number
  timestamp: string
  next_check: string
}

export interface SlashEvent {
  id: string
  factoryId: string
  factoryName: string
  amount: string // in ETH
  reason: string
  txHash: string
  timestamp: string
  triggered_by: 'oracle' | 'manual' | 'dao'
}

export interface TreasuryData {
  balance: string // in ETH
  totalSlashed: string
  totalMinted: number // GreenCredits
  slashHistory: SlashEvent[]
}

export interface GreenCreditDistribution {
  id: string
  recipient: string
  amount: number
  txHash: string
  timestamp: string
  reason: string
}

export interface Proposal {
  id: string
  title: string
  description: string
  proposer: string
  status: 'active' | 'passed' | 'rejected' | 'executed'
  votesFor: number
  votesAgainst: number
  votesAbstain: number
  endTime: string
  executedAt?: string
}

export interface WalletState {
  address: string | null
  chainId: number | null
  isConnected: boolean
  balance: string
}

export interface StakeTransaction {
  amount: string
  txHash: string
  timestamp: string
  status: 'pending' | 'confirmed' | 'failed'
}

export interface RemediationStep {
  id: string
  title: string
  description: string
  completed: boolean
  dueDate?: string
}
