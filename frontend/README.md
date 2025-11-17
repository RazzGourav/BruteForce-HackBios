# Pollu-Stake — Environmental Compliance & GreenCredits Platform

![Pollu-Stake](https://img.shields.io/badge/Demo-Ready-green) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)

A modern, full-stack demo of an **on-chain environmental staking platform** with AI-powered forecasting and decentralized governance. Built for **HackBios** to showcase a complete stake → forecast → slash → reward flow.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **MetaMask** browser extension (for wallet connection)

### Installation

```powershell
# Clone the repository
cd d:\Projects\HackBios\Pollustake-v2

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
Pollustake-v2/
├── src/
│   ├── app/                    # Next.js 14 app router
│   │   ├── page.tsx           # Landing page
│   │   ├── factory/           # Factory dashboard
│   │   ├── admin/             # Admin/DAO portal
│   │   ├── api/               # API routes (mock endpoints)
│   │   ├── layout.tsx         # Root layout with nav
│   │   └── globals.css        # Global styles
│   ├── components/            # Shared UI components
│   │   ├── ui/                # Base components (Card, Button, etc.)
│   │   ├── TopNav.tsx         # Top navigation
│   │   ├── SideNav.tsx        # Sidebar navigation
│   │   ├── WalletConnect.tsx  # Wallet integration
│   │   └── ToastProvider.tsx  # Toast notifications
│   ├── services/              # Business logic layer
│   │   ├── contractStubs.ts   # Smart contract mocks
│   │   ├── aiApiClient.ts     # Forecast API client
│   │   └── mockData.ts        # Demo data generators
│   ├── hooks/                 # Custom React hooks
│   │   ├── useWallet.ts       # Wallet connection logic
│   │   └── usePolling.ts      # Polling hook for forecasts
│   ├── store/                 # Global state management
│   │   └── useStore.ts        # Zustand store
│   ├── lib/                   # Utilities
│   │   └── utils.ts           # Helper functions
│   ├── types/                 # TypeScript definitions
│   │   └── index.ts           # Core type definitions
│   └── __tests__/             # Test files
│       └── ForecastPanel.test.tsx
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md                  # You are here
```

---

## 🎯 Features

### Two Portals

#### 🏭 **Factory Dashboard** (`/factory`)
- **Stake Management**: Deposit ETH to receive License NFT
- **Live AI Forecasts**: Real-time pollution predictions with confidence scores
- **Breach Alerts**: Visual warnings when violations are predicted
- **Slash History**: Track compliance penalties
- **Remediation Guidance**: Interactive checklists for corrective actions

#### 👔 **Admin/DAO Portal** (`/admin`)
- **Factory Monitoring**: View all registered factories with risk badges
- **Slash Monitor**: Live feed of compliance events
- **Treasury Management**: Track DAO funds from slashed stakes
- **GreenCredit Minting**: Distribute reward tokens to compliant factories
- **Governance**: Vote on DAO proposals

---

## 🔄 Demo Flow

### Step-by-Step: Experience the Full System

1. **Connect Wallet** (MetaMask)
   - Click "Connect Wallet" in the top navigation
   - Approve MetaMask connection

2. **Visit Factory Dashboard** (`/factory`)
   - View current stake balance and License NFT
   - Observe live AI forecast updating every 10 seconds
   - If breach is predicted, see alert banner

3. **Stake ETH**
   - Enter amount in "Stake ETH" card
   - Click "Stake ETH" button
   - Toast notification confirms mock transaction
   - Balance updates immediately

4. **Trigger Slash (Admin)**
   - Navigate to Admin Dashboard (`/admin`)
   - Find factory with high risk in factory list
   - Click "Trigger Slash" button
   - Enter slash amount and reason
   - Execute slash → Treasury balance increases

5. **Mint GreenCredits**
   - In Admin Treasury card, click "Mint GreenCredits"
   - Enter recipient address and amount
   - Confirm mint → Distribution appears in recent list

6. **Vote on Proposals**
   - Scroll to "DAO Governance" section
   - View active proposals
   - Cast vote (For/Against/Abstain)
   - Vote count updates in real-time

---

## 🛠️ Mock vs. Real Integration

### Current Implementation (Mock)

All blockchain interactions are **simulated** for demo purposes:

- **Contract calls** return fake transaction hashes after 1-2 second delays
- **Forecast API** uses local `/api/forecast/[factoryId]` routes
- **State** is managed in-memory (resets on page reload)

### How to Integrate Real Contracts

#### 1. **Deploy Smart Contracts**
Deploy your Solidity contracts to testnet/mainnet and note the addresses.

#### 2. **Update Environment Variables**
Edit `.env.local`:
```bash
NEXT_PUBLIC_STAKE_CONTRACT_ADDRESS=0xYourStakeContractAddress
NEXT_PUBLIC_DAO_CONTRACT_ADDRESS=0xYourDaoContractAddress
NEXT_PUBLIC_GREEN_CREDIT_CONTRACT_ADDRESS=0xYourTokenContractAddress
NEXT_PUBLIC_CHAIN_ID=11155111  # Sepolia testnet
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
NEXT_PUBLIC_ENABLE_REAL_CONTRACTS=true
```

#### 3. **Replace Contract Stubs**
Open `src/services/contractStubs.ts` and replace each function with real ethers.js calls. Example:

**Before (Mock):**
```typescript
export async function stake(amount: string, factoryId: string): Promise<string> {
  await delay(2000)
  return generateMockTxHash()
}
```

**After (Real):**
```typescript
import { ethers } from 'ethers'
import StakeABI from './abis/StakeContract.json'

export async function stake(amount: string, factoryId: string): Promise<string> {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  const contract = new ethers.Contract(CONTRACTS.STAKE, StakeABI, signer)
  
  const tx = await contract.stake(factoryId, { 
    value: ethers.parseEther(amount) 
  })
  await tx.wait()
  return tx.hash
}
```

Repeat this pattern for:
- `slash()`
- `getTreasuryBalance()`
- `mintGreenCredits()`
- `getStakeBalance()`
- `getLicenseNFT()`

#### 4. **Connect to Real AI API**
In `src/services/aiApiClient.ts`, replace the mock endpoint:

```typescript
const API_BASE = 'https://your-ai-service.com/api'  // Real ML service

export async function getForecast(factoryId: string): Promise<ForecastData> {
  const response = await fetch(`${API_BASE}/forecast/${factoryId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AI_API_KEY}`
    }
  })
  return response.json()
}
```

---

## 🧪 Testing

### Run Tests

```powershell
# Run all tests
npm test

# Run tests in CI mode
npm run test:ci

# Type checking
npm run type-check
```

### Test Coverage

- ✅ Forecast Panel displays mock API data correctly
- ✅ Breach status rendering
- ✅ Confidence score formatting

Add more tests by creating files in `src/__tests__/`.

---

## 🎨 Design System

### Color Palette (Tailwind)

```css
/* Primary (Green) */
primary-600: #16a34a
primary-700: #15803d

/* Teal (Accents) */
teal-600: #0d9488
teal-700: #0f766e

/* Charcoal (Text & UI) */
charcoal-900: #0f172a
charcoal-600: #475569
charcoal-200: #e2e8f0
```

### Typography

- **Headings**: Bold, 2xl–4xl font sizes
- **Body**: Inter font family, 14-16px
- **Monospace**: Transaction hashes, addresses

### Components

All components are in `src/components/ui/`:
- **Card**: Rounded corners (2xl), shadow on hover
- **Button**: 5 variants (primary, secondary, outline, ghost, danger)
- **Badge**: Risk-based colors (low/medium/high/critical)
- **Table**: Zebra striping, hover states
- **Modal**: Headless UI with backdrop blur
- **Input**: Floating labels, error states

---

## 🚦 Scripts & Commands

```powershell
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run type-check       # TypeScript validation
npm test                 # Run Jest tests
```

### Manual Demo Triggers

**Toggle Breach Status** (for testing):
```powershell
# Use browser console or create a script
fetch('http://localhost:3000/api/forecast/toggle', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ factoryId: 'Bhilai-001' })
})
```

---

## 🔧 Troubleshooting

### Common Issues

**1. "Cannot find module 'next'"**
```powershell
npm install
```

**2. MetaMask not detected**
- Install MetaMask extension
- Refresh page after installation

**3. Forecast not updating**
- Check browser console for API errors
- Verify dev server is running on port 3000

**4. TypeScript errors**
- Run `npm run type-check` to see all errors
- Ensure all dependencies are installed

---

## 📦 Dependencies

### Core
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript 5**: Type safety
- **Tailwind CSS 3**: Utility-first styling

### State & Data
- **Zustand**: Lightweight state management
- **@tanstack/react-query**: Server state caching
- **ethers.js 6**: Ethereum interactions

### UI Components
- **@headlessui/react**: Accessible components
- **lucide-react**: Icon library
- **react-hot-toast**: Toast notifications

### Developer Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **@testing-library/react**: Component testing

---

## 🎓 Learning Resources

### Key Files to Study

1. **`src/app/factory/page.tsx`** — Factory dashboard implementation
2. **`src/app/admin/page.tsx`** — Admin portal with governance
3. **`src/services/contractStubs.ts`** — Where to add real contract calls
4. **`src/hooks/useWallet.ts`** — MetaMask integration pattern
5. **`src/components/ui/*`** — Reusable component library

### Next Steps for Production

- [ ] Deploy smart contracts to testnet
- [ ] Connect to real AI/ML forecasting API
- [ ] Implement proper authentication/authorization
- [ ] Add comprehensive error handling
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Configure monitoring (Sentry, LogRocket)
- [ ] Optimize bundle size (dynamic imports)
- [ ] Add E2E tests (Playwright)
- [ ] Deploy to Vercel/AWS/Azure

---

## 👥 Contributing

This is a hackathon demo project. For production use:

1. Replace all mock data with real APIs
2. Add comprehensive error boundaries
3. Implement proper access control
4. Add rate limiting to API routes
5. Configure CORS and CSP headers
6. Set up proper logging and monitoring

---

## 📄 License

MIT License — Free for hackathon and educational use.

---

## 🏆 Built for HackBios

**Pollu-Stake** demonstrates:
- Modern full-stack architecture with Next.js 14
- Type-safe development with TypeScript
- Professional UI/UX with Tailwind CSS
- Clean separation of concerns (services, hooks, components)
- Mocked integrations ready for real blockchain deployment

**Demo-ready** and built to impress judges! 🌱✨

---

## 📞 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review code comments in key files
3. Inspect browser console for error messages

**Happy hacking!** 🚀
