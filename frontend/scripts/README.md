# Pollu-Stake CLI Helper Scripts

This directory contains helper scripts for testing and demonstration.

## Quick Commands

### Toggle Forecast Breach Status
```powershell
# Toggle breach for Bhilai-001
curl -X POST http://localhost:3000/api/forecast/toggle `
  -H "Content-Type: application/json" `
  -d '{"factoryId":"Bhilai-001"}'
```

### Simulate Full Demo Flow
```powershell
# 1. Start dev server
npm run dev

# 2. Open browser to http://localhost:3000
# 3. Connect MetaMask wallet
# 4. Navigate to /factory
# 5. Stake ETH (mock transaction)
# 6. Wait for forecast breach alert
# 7. Navigate to /admin
# 8. Trigger slash on factory
# 9. Mint GreenCredits
# 10. Vote on proposal
```

## Testing Scenarios

### Test Breach Alert
1. Navigate to `/factory`
2. Observe current forecast
3. Run toggle command (above)
4. Wait 10 seconds for next poll
5. Breach alert should appear/disappear

### Test Slash Flow
1. Navigate to `/admin`
2. Find factory with high risk
3. Click "Trigger Slash"
4. Enter amount (e.g., 2.5) and reason
5. Execute slash
6. Verify treasury balance increases
7. Check slash monitor for new event

### Test GreenCredit Minting
1. Navigate to `/admin`
2. Click "Mint GreenCredits" in treasury card
3. Enter recipient address (use any wallet address)
4. Enter amount (e.g., 1000)
5. Click "Mint Tokens"
6. Verify distribution appears in recent list

## Environment Variables

Create `.env.local` with:
```bash
NEXT_PUBLIC_MOCK_MODE=true
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```
