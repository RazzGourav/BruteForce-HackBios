/**
 * Mock data generator for demo/hackathon
 */

import {
  Factory,
  SlashEvent,
  GreenCreditDistribution,
  Proposal,
  RemediationStep,
} from '@/types'

export const MOCK_FACTORIES: Factory[] = [
  {
    id: 'Bhilai-001',
    name: 'Bhilai Steel Plant',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7',
    location: {
      lat: 21.2095,
      lng: 81.3783,
      city: 'Bhilai, Chhattisgarh',
    },
    stakeBalance: '10.5',
    licenseNftId: '42',
    riskLevel: 'high',
    complianceScore: 45,
    lastForecast: null,
  },
  {
    id: 'Mumbai-002',
    name: 'Mumbai Petrochemical Complex',
    address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    location: {
      lat: 19.076,
      lng: 72.8777,
      city: 'Mumbai, Maharashtra',
    },
    stakeBalance: '8.2',
    licenseNftId: '43',
    riskLevel: 'medium',
    complianceScore: 72,
    lastForecast: null,
  },
  {
    id: 'Delhi-003',
    name: 'Delhi Thermal Power Station',
    address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    location: {
      lat: 28.7041,
      lng: 77.1025,
      city: 'New Delhi',
    },
    stakeBalance: '15.0',
    licenseNftId: '44',
    riskLevel: 'low',
    complianceScore: 88,
    lastForecast: null,
  },
  {
    id: 'Chennai-004',
    name: 'Chennai Automotive Manufacturing',
    address: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    location: {
      lat: 13.0827,
      lng: 80.2707,
      city: 'Chennai, Tamil Nadu',
    },
    stakeBalance: '12.3',
    licenseNftId: '45',
    riskLevel: 'low',
    complianceScore: 91,
    lastForecast: null,
  },
  {
    id: 'Kolkata-005',
    name: 'Kolkata Chemical Works',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    location: {
      lat: 22.5726,
      lng: 88.3639,
      city: 'Kolkata, West Bengal',
    },
    stakeBalance: '6.8',
    licenseNftId: '46',
    riskLevel: 'critical',
    complianceScore: 32,
    lastForecast: null,
  },
]

export const MOCK_SLASH_EVENTS: SlashEvent[] = [
  {
    id: 'slash-001',
    factoryId: 'Bhilai-001',
    factoryName: 'Bhilai Steel Plant',
    amount: '2.5',
    reason: 'AQI breach predicted (165 AQI, 95% confidence)',
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    triggered_by: 'oracle',
  },
  {
    id: 'slash-002',
    factoryId: 'Kolkata-005',
    factoryName: 'Kolkata Chemical Works',
    amount: '1.8',
    reason: 'Manual slash for repeated violations',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    triggered_by: 'manual',
  },
  {
    id: 'slash-003',
    factoryId: 'Mumbai-002',
    factoryName: 'Mumbai Petrochemical Complex',
    amount: '1.2',
    reason: 'Emission spike detected (142 AQI, 88% confidence)',
    txHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    triggered_by: 'oracle',
  },
]

export const MOCK_GREEN_CREDIT_DISTRIBUTIONS: GreenCreditDistribution[] = [
  {
    id: 'gc-001',
    recipient: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    amount: 1000,
    txHash: '0xaabbccdd1234567890abcdef1234567890abcdef1234567890abcdef12345678',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    reason: 'Compliance reward for Delhi-003',
  },
  {
    id: 'gc-002',
    recipient: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    amount: 750,
    txHash: '0xbbccddee1234567890abcdef1234567890abcdef1234567890abcdef12345678',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reason: 'Monthly incentive for Chennai-004',
  },
]

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'prop-001',
    title: 'Increase Slash Penalty for Critical Violations',
    description:
      'Proposal to increase the slash amount from 25% to 35% for factories with critical risk ratings.',
    proposer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7',
    status: 'active',
    votesFor: 1250,
    votesAgainst: 340,
    votesAbstain: 120,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'prop-002',
    title: 'Add New Remediation Incentive Program',
    description:
      'Allocate 5000 GreenCredits monthly to factories that implement verified pollution reduction measures.',
    proposer: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    status: 'passed',
    votesFor: 2100,
    votesAgainst: 180,
    votesAbstain: 90,
    endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    executedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
]

export const MOCK_REMEDIATION_STEPS: RemediationStep[] = [
  {
    id: 'rem-001',
    title: 'Install Advanced Scrubbers',
    description:
      'Upgrade emission control systems to reduce particulate matter by 40%',
    completed: false,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rem-002',
    title: 'Conduct Emissions Audit',
    description: 'Third-party verification of current emission levels',
    completed: true,
  },
  {
    id: 'rem-003',
    title: 'Implement Real-Time Monitoring',
    description: 'Deploy IoT sensors for continuous air quality tracking',
    completed: false,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rem-004',
    title: 'Staff Training Program',
    description: 'Train operators on new emission reduction protocols',
    completed: false,
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
]
