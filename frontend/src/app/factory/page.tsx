'use client'

import { useState } from 'react'
import { usePolling } from '@/hooks/usePolling'
import { getForecast } from '@/services/aiApiClient'
import { stake, getStakeBalance } from '@/services/contractStubs'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import { AlertTriangle, CheckCircle2, TrendingUp, Coins, FileText, Clock } from 'lucide-react'
import { formatTimestamp, formatEth } from '@/lib/utils'
import { ForecastData, RemediationStep } from '@/types'
import { MOCK_SLASH_EVENTS, MOCK_REMEDIATION_STEPS } from '@/services/mockData'
import toast from 'react-hot-toast'

export default function FactoryDashboard() {
  const [stakeAmount, setStakeAmount] = useState('')
  const [stakeBalance, setStakeBalance] = useState('10.5')
  const [nftId, setNftId] = useState('42')
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [isStaking, setIsStaking] = useState(false)
  const [remediationSteps, setRemediationSteps] = useState<RemediationStep[]>(
    MOCK_REMEDIATION_STEPS
  )

  const factoryId = 'Bhilai-001'

  // Poll forecast data every 10 seconds
  usePolling(
    async () => {
      try {
        const data = await getForecast(factoryId)
        setForecast(data)
      } catch (error) {
        console.error('Failed to fetch forecast:', error)
      }
    },
    { interval: 10000, enabled: true }
  )

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setIsStaking(true)
    try {
      const txHash = await stake(stakeAmount, factoryId)
      toast.success(
        `Staked ${stakeAmount} ETH successfully! Transaction: ${txHash.slice(0, 10)}...`
      )
      
      // Update local state
      const newBalance = parseFloat(stakeBalance) + parseFloat(stakeAmount)
      setStakeBalance(newBalance.toString())
      setStakeAmount('')
      
      // Simulate NFT minting if first stake
      if (!nftId) {
        setNftId('42')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to stake')
    } finally {
      setIsStaking(false)
    }
  }

  const toggleRemediationStep = (id: string) => {
    setRemediationSteps((steps) =>
      steps.map((step) => (step.id === id ? { ...step, completed: !step.completed } : step))
    )
  }

  const forecastBreachAlert = forecast?.forecast_breach

  return (
    <div className="min-h-screen bg-charcoal-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal-900">Factory Dashboard</h1>
          <p className="mt-2 text-charcoal-600">Bhilai Steel Plant (ID: {factoryId})</p>
        </div>

        {/* Alert Banner */}
        {forecastBreachAlert && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border-2 border-red-500 bg-red-50 p-4 text-red-900">
            <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">⚠️ Breach Predicted!</p>
              <p className="mt-1 text-sm">
                AI forecast indicates a potential AQI violation (Predicted: {forecast?.predicted_aqi}{' '}
                AQI, Confidence: {forecast && (forecast.confidence * 100).toFixed(0)}%). Please
                review remediation steps immediately.
              </p>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-charcoal-600">Stake Balance</p>
                  <p className="mt-1 text-2xl font-bold text-charcoal-900">
                    {formatEth(stakeBalance)} ETH
                  </p>
                </div>
                <Coins className="h-10 w-10 text-primary-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-charcoal-600">License NFT</p>
                  <p className="mt-1 text-2xl font-bold text-charcoal-900">#{nftId || 'N/A'}</p>
                </div>
                <FileText className="h-10 w-10 text-teal-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-charcoal-600">Current AQI</p>
                  <p className="mt-1 text-2xl font-bold text-charcoal-900">
                    {forecast?.predicted_aqi || '—'}
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-charcoal-600">Risk Level</p>
                  <Badge risk={forecastBreachAlert ? 'high' : 'low'} className="mt-1">
                    {forecastBreachAlert ? 'High' : 'Low'}
                  </Badge>
                </div>
                {forecastBreachAlert ? (
                  <AlertTriangle className="h-10 w-10 text-red-600" />
                ) : (
                  <CheckCircle2 className="h-10 w-10 text-primary-600" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Stake Deposit Card */}
          <Card>
            <CardHeader>
              <CardTitle>Stake ETH</CardTitle>
              <CardDescription>
                Increase your stake to maintain compliance and earn more rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  type="number"
                  label="Amount (ETH)"
                  placeholder="0.0"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  step="0.1"
                  min="0"
                />
                <Button onClick={handleStake} isLoading={isStaking} className="w-full">
                  Stake ETH
                </Button>
                <p className="text-xs text-charcoal-500">
                  * Mock transaction - no real ETH will be transferred
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Forecast Panel */}
          <Card>
            <CardHeader>
              <CardTitle>AI Forecast</CardTitle>
              <CardDescription>Real-time pollution predictions</CardDescription>
            </CardHeader>
            <CardContent>
              {forecast ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-charcoal-600">Predicted AQI</span>
                    <span className="text-2xl font-bold text-charcoal-900">
                      {forecast.predicted_aqi}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-charcoal-600">Confidence</span>
                    <span className="font-semibold text-charcoal-900">
                      {(forecast.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-charcoal-600">Breach Risk</span>
                    <Badge variant={forecast.forecast_breach ? 'danger' : 'success'}>
                      {forecast.forecast_breach ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="mt-4 rounded-lg bg-charcoal-50 p-3 text-xs text-charcoal-600">
                    <Clock className="mb-1 inline h-4 w-4" /> Next update in 10 seconds
                  </div>
                </div>
              ) : (
                <div className="text-center text-charcoal-500">Loading forecast...</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Remediation Guidance */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Remediation Steps</CardTitle>
            <CardDescription>
              Recommended actions to improve compliance and reduce risk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {remediationSteps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-start gap-3 rounded-lg border border-charcoal-200 p-3 transition-colors hover:bg-charcoal-50"
                >
                  <input
                    type="checkbox"
                    checked={step.completed}
                    onChange={() => toggleRemediationStep(step.id)}
                    className="mt-1 h-5 w-5 cursor-pointer rounded border-charcoal-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <h4
                      className={`font-medium ${
                        step.completed ? 'text-charcoal-500 line-through' : 'text-charcoal-900'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="mt-1 text-sm text-charcoal-600">{step.description}</p>
                    {step.dueDate && (
                      <p className="mt-1 text-xs text-charcoal-500">
                        Due: {formatTimestamp(step.dueDate)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Slash History */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Slash History</CardTitle>
            <CardDescription>Record of compliance penalties</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Transaction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_SLASH_EVENTS.filter((e) => e.factoryId === factoryId).map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{formatTimestamp(event.timestamp)}</TableCell>
                    <TableCell className="font-semibold text-red-600">
                      -{formatEth(event.amount)} ETH
                    </TableCell>
                    <TableCell>{event.reason}</TableCell>
                    <TableCell>
                      <a
                        href={`#tx-${event.txHash}`}
                        className="text-primary-600 hover:underline"
                      >
                        {event.txHash.slice(0, 10)}...
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
