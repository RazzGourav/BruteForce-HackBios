# Pollu-Stake Installation & Verification Guide

## Step 1: Install Dependencies

Run this command in PowerShell from the project directory:

```powershell
npm install
```

**Expected duration**: 2-3 minutes

**Expected output**:
```
added 350+ packages in 2m
```

## Step 2: Verify Installation

Check that all packages installed correctly:

```powershell
npm list --depth=0
```

You should see key packages:
- next@^14.2.0
- react@^18.3.0
- typescript@^5.3.3
- tailwindcss@^3.4.1
- ethers@^6.11.0
- zustand@^4.5.0

## Step 3: Type Check

Verify TypeScript configuration:

```powershell
npm run type-check
```

**Note**: You may see some errors related to missing `node_modules` types. These are normal and will not prevent the app from running.

## Step 4: Start Development Server

```powershell
npm run dev
```

**Expected output**:
```
▲ Next.js 14.2.0
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 3.2s
```

## Step 5: Open in Browser

Navigate to: **http://localhost:3000**

You should see the Pollu-Stake landing page with:
- ✅ Gradient hero section
- ✅ "Admin Portal" and "Factory Portal" buttons
- ✅ "How Pollu-Stake Works" section
- ✅ Platform features cards

## Step 6: Test Core Features

### Test 1: Landing Page Navigation
- Click "Factory Portal" → Should navigate to `/factory`
- Click "Admin Portal" → Should navigate to `/admin`
- Verify TopNav displays at the top of every page
- Verify SideNav appears on dashboard pages

### Test 2: Wallet Connection
1. Click "Connect Wallet" in TopNav
2. If MetaMask not installed → See orange warning banner
3. If MetaMask installed → MetaMask popup appears
4. Approve connection → See wallet address and balance in TopNav

### Test 3: Factory Dashboard
Navigate to: http://localhost:3000/factory

**Should see**:
- ✅ 4 metric cards (Stake Balance, License NFT, Current AQI, Risk Level)
- ✅ "Stake ETH" card with input and button
- ✅ "AI Forecast" card showing live data
- ✅ "Remediation Steps" with checkboxes
- ✅ "Slash History" table

**Test stake**:
1. Enter "2.5" in amount field
2. Click "Stake ETH"
3. See loading spinner
4. After 2 seconds → Success toast appears
5. Stake Balance card updates

**Test forecast polling**:
1. Watch "AI Forecast" card
2. Every 10 seconds, data refreshes
3. If `forecast_breach: true` → Red alert banner appears at top

### Test 4: Admin Dashboard
Navigate to: http://localhost:3000/admin

**Should see**:
- ✅ 4 metric cards (Active Factories, Treasury Balance, Total Staked, High Risk)
- ✅ "Registered Factories" table with 5 factories
- ✅ "Slash Monitor" with live events
- ✅ "Treasury & GreenCredits" card
- ✅ "DAO Governance" proposals section

**Test slash**:
1. Click "Trigger Slash" on any factory row
2. Modal opens
3. Enter amount "2.5" and reason "Test slash"
4. Click "Execute Slash"
5. After 1.5 seconds → Success toast
6. Treasury balance increases
7. New event appears in Slash Monitor

**Test mint**:
1. Click "Mint GreenCredits" button
2. Modal opens
3. Enter recipient "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7"
4. Enter amount "1000"
5. Click "Mint Tokens"
6. After 2 seconds → Success toast
7. New distribution appears in recent list

**Test voting**:
1. Scroll to "DAO Governance"
2. Find proposal with status "active"
3. Click "Vote For" or "Vote Against"
4. Toast appears "Vote recorded"
5. Vote counts increase

## Step 7: Test API Routes

Open a new PowerShell terminal and test API endpoints:

```powershell
# Test forecast endpoint
curl http://localhost:3000/api/forecast/Bhilai-001

# Expected output: JSON with factory_id, forecast_breach, confidence, predicted_aqi
```

```powershell
# Test all forecasts
curl http://localhost:3000/api/forecast/all

# Expected output: Array of forecast objects
```

```powershell
# Test breach toggle (POST request)
curl -X POST http://localhost:3000/api/forecast/toggle `
  -H "Content-Type: application/json" `
  -d '{\"factoryId\":\"Bhilai-001\"}'

# Expected output: {"success":true,"factoryId":"Bhilai-001","breachEnabled":true/false}
```

## Step 8: Run Tests

```powershell
npm test
```

**Expected**: Test suite runs (may show warnings about missing dependencies, which is normal)

## Troubleshooting

### Issue: `npm install` fails

**Solution**:
```powershell
# Clear cache
npm cache clean --force

# Delete node_modules
Remove-Item -Recurse -Force node_modules

# Reinstall
npm install
```

### Issue: Port 3000 already in use

**Solution**:
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
# Note the PID, then:
taskkill /PID <PID> /F

# Or use a different port
# In package.json, change dev script to:
# "dev": "next dev -p 3001"
```

### Issue: TypeScript errors on start

**Solution**: These are expected before dependencies are installed. Run:
```powershell
npm install
```

If errors persist after installation, they are likely linting warnings and won't prevent the app from running.

### Issue: MetaMask not detected

**Solution**:
1. Install MetaMask extension: https://metamask.io/download/
2. Refresh page after installation
3. Click "Connect Wallet" again

### Issue: Forecast not updating

**Solution**:
1. Check browser console (F12) for errors
2. Verify dev server is running
3. Check Network tab for requests to `/api/forecast/`
4. Ensure no ad blockers are blocking localhost requests

### Issue: Styles not loading

**Solution**:
```powershell
# Ensure Tailwind is configured
npm run dev

# If still broken, rebuild
npm run build
npm run dev
```

## Verification Checklist

- [ ] Dependencies installed without errors
- [ ] Dev server starts on http://localhost:3000
- [ ] Landing page renders correctly
- [ ] Navigation between pages works
- [ ] Wallet connection prompts MetaMask
- [ ] Factory dashboard displays metrics
- [ ] Stake transaction simulates successfully
- [ ] Forecast data polls every 10 seconds
- [ ] Admin dashboard shows factory list
- [ ] Slash modal opens and executes
- [ ] GreenCredit minting works
- [ ] Voting updates proposal counts
- [ ] API routes return JSON data
- [ ] Toast notifications appear
- [ ] No console errors (warnings are OK)

## Success Indicators

✅ **Installation successful** if:
- All dependencies installed
- No fatal errors in terminal
- Dev server starts successfully

✅ **Application working** if:
- All pages render
- Components are styled correctly
- Interactions trigger expected behavior
- Mock transactions complete with toasts

✅ **Ready for demo** if:
- Full flow works: stake → forecast → slash → mint
- Wallet connection functional
- All dashboards navigable
- No blocking UI issues

## Performance Expectations

- **Page load**: < 1 second
- **Forecast poll**: Every 10 seconds
- **Mock transactions**: 1.5-2 seconds
- **Navigation**: Instant (client-side routing)

## Next Steps After Verification

1. **Customize**: Modify colors, text, or data in mock files
2. **Extend**: Add more factories or proposals
3. **Integrate**: Replace mocks with real contracts (see README.md)
4. **Deploy**: Push to Vercel or similar platform

---

## Quick Command Reference

```powershell
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm test             # Run Jest tests
npm run type-check   # TypeScript validation
```

---

**Installation complete!** 🎉

Your Pollu-Stake demo is ready. Open http://localhost:3000 and start exploring!
