'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { slash, getTreasuryBalance, mintGreenCredits } from '@/services/contractStubs'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import {
  Factory as FactoryIcon,
  AlertTriangle,
  Coins,
  TrendingUp,
  Users,
  CheckCircle2,
} from 'lucide-react'
import { formatTimestamp, formatEth, formatAddress } from '@/lib/utils'
import {
  MOCK_FACTORIES,
  MOCK_SLASH_EVENTS,
  MOCK_GREEN_CREDIT_DISTRIBUTIONS,
  MOCK_PROPOSALS,
} from '@/services/mockData'
import { Factory, Proposal } from '@/types'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { factories, setFactories } = useStore()
  const [treasuryBalance, setTreasuryBalance] = useState('42.5')
  const [slashEvents, setSlashEvents] = useState(MOCK_SLASH_EVENTS)
  const [distributions, setDistributions] = useState(MOCK_GREEN_CREDIT_DISTRIBUTIONS)
  const [proposals, setProposals] = useState(MOCK_PROPOSALS)
  
  const [selectedFactory, setSelectedFactory] = useState<Factory | null>(null)
  const [slashAmount, setSlashAmount] = useState('')
  const [slashReason, setSlashReason] = useState('')
  const [isSlashing, setIsSlashing] = useState(false)
  
  const [showMintModal, setShowMintModal] = useState(false)
  const [mintAddress, setMintAddress] = useState('')
  const [mintAmount, setMintAmount] = useState('')
  const [isMinting, setIsMinting] = useState(false)

  useEffect(() => {
    if (factories.length === 0) {
      setFactories(MOCK_FACTORIES)
    }
  }, [factories, setFactories])

  const handleTriggerSlash = async (factory: Factory) => {
    setSelectedFactory(factory)
  }

  const executeSlash = async () => {
    if (!selectedFactory || !slashAmount || !slashReason) {
      toast.error('Please fill all fields')
      return
    }

    setIsSlashing(true)
    try {
      const txHash = await slash(selectedFactory.id, slashAmount, slashReason)
      
      toast.success(`Slash executed successfully! Tx: ${txHash.slice(0, 10)}...`)
      
      // Update treasury
      const newBalance = parseFloat(treasuryBalance) + parseFloat(slashAmount)
      setTreasuryBalance(newBalance.toString())
      
      // Add slash event
      const newEvent = {
        id: `slash-${Date.now()}`,
        factoryId: selectedFactory.id,
        factoryName: selectedFactory.name,
        amount: slashAmount,
        reason: slashReason,
        txHash,
        timestamp: new Date().toISOString(),
        triggered_by: 'manual' as const,
      }
      setSlashEvents([newEvent, ...slashEvents])
      
      // Reset
      setSelectedFactory(null)
      setSlashAmount('')
      setSlashReason('')
    } catch (error: any) {
      toast.error(error.message || 'Failed to execute slash')
    } finally {
      setIsSlashing(false)
    }
  }

  const handleMintCredits = async () => {
    if (!mintAddress || !mintAmount) {
      toast.error('Please fill all fields')
      return
    }

    setIsMinting(true)
    try {
      const txHash = await mintGreenCredits(mintAddress, parseInt(mintAmount))
      
      toast.success(`Minted ${mintAmount} GreenCredits! Tx: ${txHash.slice(0, 10)}...`)
      
      // Add distribution record
      const newDist = {
        id: `gc-${Date.now()}`,
        recipient: mintAddress,
        amount: parseInt(mintAmount),
        txHash,
        timestamp: new Date().toISOString(),
        reason: 'Manual admin mint',
      }
      setDistributions([newDist, ...distributions])
      
      // Reset
      setShowMintModal(false)
      setMintAddress('')
      setMintAmount('')
    } catch (error: any) {
      toast.error(error.message || 'Failed to mint GreenCredits')
    } finally {
      setIsMinting(false)
    }
  }

  const handleVote = (proposalId: string, voteType: 'for' | 'against' | 'abstain') => {
    setProposals(
      proposals.map((p) => {
        if (p.id === proposalId) {
          return {
            ...p,
            votesFor: voteType === 'for' ? p.votesFor + 1 : p.votesFor,
            votesAgainst: voteType === 'against' ? p.votesAgainst + 1 : p.votesAgainst,
            votesAbstain: voteType === 'abstain' ? p.votesAbstain + 1 : p.votesAbstain,
          }
        }
        return p
      })
    )
    toast.success(`Vote recorded: ${voteType}`)
  }

  const criticalFactories = factories.filter((f) => f.riskLevel === 'critical' || f.riskLevel === 'high')
  const totalStaked = factories.reduce((acc, f) => acc + parseFloat(f.stakeBalance), 0)

  return (
    <div className="min-h-screen bg-charcoal-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal-900">Admin Dashboard</h1>
          <p className="mt-2 text-charcoal-600">Regulator & DAO Oversight Portal</p>
        </div>

        {/* Key Metrics */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-charcoal-600">Active Factories</p>
                  <p className="mt-1 text-2xl font-bold text-charcoal-900">{factories.length}</p>
                </div>
                <FactoryIcon className="h-10 w-10 text-primary-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-charcoal-600">Treasury Balance</p>
                  <p className="mt-1 text-2xl font-bold text-charcoal-900">
                    {formatEth(treasuryBalance)} ETH
                  </p>
                </div>
                <Coins className="h-10 w-10 text-teal-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-charcoal-600">Total Staked</p>
                  <p className="mt-1 text-2xl font-bold text-charcoal-900">
                    {formatEth(totalStaked)} ETH
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-primary-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-charcoal-600">High Risk</p>
                  <p className="mt-1 text-2xl font-bold text-red-600">
                    {criticalFactories.length}
                  </p>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Factory List */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Registered Factories</CardTitle>
            <CardDescription>Monitor compliance and risk across all factories</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Factory</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Stake</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {factories.map((factory) => (
                  <TableRow key={factory.id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-charcoal-900">{factory.name}</p>
                        <p className="text-xs text-charcoal-500">{factory.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>{factory.location.city}</TableCell>
                    <TableCell className="font-semibold">
                      {formatEth(factory.stakeBalance)} ETH
                    </TableCell>
                    <TableCell>
                      <Badge risk={factory.riskLevel}>{factory.riskLevel.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-semibold ${
                          factory.complianceScore >= 80
                            ? 'text-primary-600'
                            : factory.complianceScore >= 60
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {factory.complianceScore}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTriggerSlash(factory)}
                      >
                        Trigger Slash
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Slash Monitor */}
          <Card>
            <CardHeader>
              <CardTitle>Slash Monitor</CardTitle>
              <CardDescription>Live feed of compliance penalties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {slashEvents.slice(0, 10).map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg border border-charcoal-200 p-3 hover:bg-charcoal-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-charcoal-900">{event.factoryName}</p>
                        <p className="mt-1 text-sm text-charcoal-600">{event.reason}</p>
                        <p className="mt-1 text-xs text-charcoal-500">
                          {formatTimestamp(event.timestamp)}
                        </p>
                      </div>
                      <p className="ml-3 font-semibold text-red-600">
                        -{formatEth(event.amount)} ETH
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Treasury & GreenCredits */}
          <Card>
            <CardHeader>
              <CardTitle>Treasury & GreenCredits</CardTitle>
              <CardDescription>Manage DAO funds and token distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg bg-primary-50 p-4">
                  <p className="text-sm text-primary-700">Treasury Balance</p>
                  <p className="mt-1 text-3xl font-bold text-primary-900">
                    {formatEth(treasuryBalance)} ETH
                  </p>
                </div>
                <Button onClick={() => setShowMintModal(true)} className="w-full gap-2">
                  <Coins className="h-5 w-5" />
                  Mint GreenCredits
                </Button>
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-charcoal-700">Recent Distributions</p>
                  {distributions.slice(0, 3).map((dist) => (
                    <div
                      key={dist.id}
                      className="flex items-center justify-between rounded-lg border border-charcoal-200 p-2 text-sm"
                    >
                      <span className="text-charcoal-600">
                        {formatAddress(dist.recipient)}
                      </span>
                      <span className="font-semibold text-primary-600">{dist.amount} GC</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Governance */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>DAO Governance</CardTitle>
            <CardDescription>Active proposals and voting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="rounded-xl border border-charcoal-200 p-4 hover:border-primary-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-charcoal-900">{proposal.title}</h4>
                        <Badge
                          variant={
                            proposal.status === 'passed'
                              ? 'success'
                              : proposal.status === 'active'
                              ? 'info'
                              : 'default'
                          }
                        >
                          {proposal.status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-charcoal-600">{proposal.description}</p>
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <span className="text-primary-600">
                          For: <strong>{proposal.votesFor}</strong>
                        </span>
                        <span className="text-red-600">
                          Against: <strong>{proposal.votesAgainst}</strong>
                        </span>
                        <span className="text-charcoal-500">
                          Abstain: <strong>{proposal.votesAbstain}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                  {proposal.status === 'active' && (
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" onClick={() => handleVote(proposal.id, 'for')}>
                        Vote For
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleVote(proposal.id, 'against')}
                      >
                        Vote Against
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleVote(proposal.id, 'abstain')}
                      >
                        Abstain
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Slash Modal */}
      {selectedFactory && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedFactory(null)}
          title={`Slash Factory: ${selectedFactory.name}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-900">
              <p className="font-semibold">⚠️ Warning</p>
              <p className="mt-1">
                This will slash stake from {selectedFactory.name} and transfer it to the DAO
                treasury.
              </p>
            </div>
            <Input
              label="Slash Amount (ETH)"
              type="number"
              placeholder="0.0"
              value={slashAmount}
              onChange={(e) => setSlashAmount(e.target.value)}
              step="0.1"
              min="0"
            />
            <Input
              label="Reason"
              placeholder="e.g., AQI breach predicted at 165 AQI"
              value={slashReason}
              onChange={(e) => setSlashReason(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={executeSlash} isLoading={isSlashing} variant="danger" className="flex-1">
                Execute Slash
              </Button>
              <Button
                onClick={() => setSelectedFactory(null)}
                variant="outline"
                disabled={isSlashing}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Mint Modal */}
      <Modal
        isOpen={showMintModal}
        onClose={() => setShowMintModal(false)}
        title="Mint GreenCredits"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Recipient Address"
            placeholder="0x..."
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
          />
          <Input
            label="Amount (GreenCredits)"
            type="number"
            placeholder="1000"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
            min="1"
          />
          <div className="flex gap-2">
            <Button onClick={handleMintCredits} isLoading={isMinting} className="flex-1">
              Mint Tokens
            </Button>
            <Button
              onClick={() => setShowMintModal(false)}
              variant="outline"
              disabled={isMinting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
