# Pollu-Stake — Quick Start Guide

## Installation and Setup

### 1. Install Dependencies
```powershell
npm install
```

### 2. Start Development Server
```powershell
npm run dev
```

### 3. Open in Browser
Navigate to: http://localhost:3000

## Demo Walkthrough

### Landing Page (/)
- Overview of the platform
- Two CTAs: "Admin Portal" and "Factory Portal"

### Factory Dashboard (/factory)
1. **Connect Wallet** — Click "Connect Wallet" in top nav (MetaMask required)
2. **View Metrics** — See stake balance, License NFT #42, current AQI
3. **Stake ETH** — Enter amount (e.g., 2.5) and click "Stake ETH"
4. **Watch Forecast** — AI predictions update every 10 seconds
5. **Breach Alert** — Red banner appears when breach is predicted
6. **Remediation** — Check off action items in the checklist
7. **Slash History** — View past compliance penalties

### Admin Dashboard (/admin)
1. **Monitor Factories** — View all 5 factories with risk badges
2. **Trigger Slash**
   - Click "Trigger Slash" on any factory
   - Enter amount (e.g., 2.5 ETH) and reason
   - Execute → Treasury balance increases
3. **Slash Monitor** — See live feed of slash events
4. **Mint GreenCredits**
   - Click "Mint GreenCredits" button
   - Enter recipient address and amount
   - Confirm → Distribution recorded
5. **Vote on Proposals**
   - Scroll to "DAO Governance"
   - Cast vote (For/Against/Abstain)
   - Watch vote counts update

## Testing Commands

### Run Tests
```powershell
npm test
```

### Type Check
```powershell
npm run type-check
```

### Format Code
```powershell
npm run format
```

### Lint
```powershell
npm run lint
```

## Toggle Breach Status (for Testing)

Open browser console on `/factory` page and run:
```javascript
fetch('/api/forecast/toggle', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ factoryId: 'Bhilai-001' })
})
.then(() => console.log('Breach status toggled'))
```

Wait 10 seconds and the forecast will update with new breach status.

## Next Steps for Real Deployment

1. **Deploy Smart Contracts** to testnet (Sepolia/Mumbai)
2. **Update Contract Addresses** in `.env.local`
3. **Replace Mock Functions** in `src/services/contractStubs.ts`
4. **Connect Real AI API** in `src/services/aiApiClient.ts`
5. **Deploy Frontend** to Vercel or similar platform

## Troubleshooting

**Issue: "Cannot find module 'next'"**
- Run: `npm install`

**Issue: MetaMask not connecting**
- Ensure MetaMask extension is installed
- Refresh page after installation
- Check console for errors

**Issue: Forecasts not updating**
- Verify dev server is running on port 3000
- Check Network tab for API call to `/api/forecast/[factoryId]`
- Ensure no ad blockers are interfering

**Issue: TypeScript errors**
- Run: `npm run type-check` to see all errors
- Most errors will resolve after `npm install` completes

## File Structure Quick Reference

```
src/
├── app/
│   ├── page.tsx           ← Landing page
│   ├── factory/page.tsx   ← Factory dashboard
│   ├── admin/page.tsx     ← Admin dashboard
│   └── api/forecast/      ← Mock API routes
├── components/            ← Reusable UI components
├── services/              ← Business logic (contracts, API)
├── hooks/                 ← Custom React hooks
├── store/                 ← Global state (Zustand)
└── types/                 ← TypeScript definitions
```

## Support

For detailed documentation, see the main [README.md](../README.md)

---

**Built with ❤️ for HackBios** 🌱
