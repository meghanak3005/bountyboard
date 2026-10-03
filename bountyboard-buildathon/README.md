# BountyBoard 🏛️

**BountyBoard** is an on-chain bounty marketplace decentralized application built specifically for the **Monad Testnet**, adhering strictly to the **Bauhaus Constructivist Design System** (*form follows function*).

Creators lock MON rewards in a secure Solidity smart contract, developers submit verifiable open-source solution links, and creators approve a submission that triggers an immediate and automated on-chain payout.

---

## 🎨 Bauhaus Design System

- **Palette**: Canvas off-white (`#F0F0F0`), Foreground (`#121212`), Bauhaus Red (`#D02020`), Bauhaus Blue (`#1040C0`), Bauhaus Yellow (`#F0C020`), Muted (`#E0E0E0`).
- **Typography**: Google Font **Outfit** (400, 500, 700, 900) with bold uppercase tracking.
- **Geometry**: Sharp 90-degree corners (`rounded-none`) or full circles (`rounded-full`), 2px/4px solid borders, and tactile hard-offset shadows (`3px`–`8px`).
- **No Gradients, No Glassmorphism**: High-contrast, tactile, constructivist modernism.

---

## 📁 Repository Structure

```text
bountyboard-buildathon/
├── frontend/                     # Next.js 14 App Router, TypeScript, Tailwind, Wagmi v2, Viem
│   ├── app/                      # Routes: /, /bounties, /bounties/[id], /create, /how-it-works, /about
│   ├── components/               # BauhausLogo, Navbar, Footer, WalletButton, BountyCard, StatusBadge, etc.
│   ├── lib/
│   │   ├── config.ts             # Wagmi & Monad Testnet configuration (Chain ID: 10143)
│   │   ├── contracts/            # ABI & Address handoff (bountyBoard.ts)
│   │   └── utils.ts              # Formatting, BigInt parsing, address shortener
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── backend/                      # Solidity 0.8.28, Hardhat v2, TypeScript tests & scripts
│   ├── contracts/
│   │   ├── BountyBoard.sol       # Core bounty escrow marketplace contract
│   │   └── test/TestHelpers.sol  # Reentrancy and transfer failure test mocks
│   ├── test/
│   │   └── BountyBoard.test.ts   # 18 comprehensive tests covering all 14 requirement scenarios
│   ├── scripts/
│   │   ├── deploy.ts             # Deploys contract to Monad Testnet and exports ABI to frontend
│   │   └── export-abi.ts         # Generates frontend ABI & TypeScript contract types
│   ├── hardhat.config.ts
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── phases.md                     # Phased development tracking
├── task.md                       # Actionable task checklist
├── rules.md                      # Persistent engineering, security, and Bauhaus rules
├── master-prompt.md              # Full project brief & specification
└── README.md
```

---

## ⛓️ Network Configuration (Monad Testnet)

- **Network Name**: Monad Testnet
- **Chain ID**: `10143`
- **Currency**: `MON` (18 decimals)
- **RPC URL**: `https://testnet-rpc.monad.xyz` (or `https://rpc.testnet.monad.xyz`)
- **Block Explorer**: [https://testnet.monadscan.com](https://testnet.monadscan.com)

---

## 🚀 Quickstart Guide

### 1. Backend (Contracts & Tests)

Navigate to the `backend/` directory:
```bash
cd bountyboard-buildathon/backend
npm install
```

**Run Contract Tests:**
```bash
npm run test
```
*Result: 18 passing tests covering bounty creation, zero-reward rejection, creator-only approval, reentrancy protection, and payout transfer handling.*

**Export ABI to Frontend:**
```bash
npm run export-abi
```

**Deploy to Monad Testnet (Optional):**
1. Copy `.env.example` to `.env`:
   ```env
   MONAD_RPC_URL=https://rpc.testnet.monad.xyz
   PRIVATE_KEY=your_funded_testnet_private_key
   ```
2. Run deployment:
   ```bash
   npm run deploy:monad
   ```
   *The script will print the deployed contract address and automatically synchronize `frontend/lib/contracts/bountyBoard.ts`.*

---

### 2. Frontend (Next.js Application)

Navigate to the `frontend/` directory:
```bash
cd bountyboard-buildathon/frontend
npm install
```

**Configure Contract Address:**
Copy `.env.example` to `.env.local`:
```env
NEXT_PUBLIC_CHAIN_ID=10143
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
```

**Run Development Server:**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔒 Security & Solidity Architecture

- **Checks-Effects-Interactions**: State updates to `BountyStatus.Completed` and `bounty.winner` occur *before* external transfer.
- **Reentrancy Protection**: Custom mutex modifier guards payouts against reentrant exploitation.
- **Access Control**: Only the original bounty creator address can approve candidate submissions.
- **Input Validation**: Rejects empty titles, descriptions, and zero-value deposits.
- **Anti-Self Submission**: Bounty creators are blocked from submitting solutions to their own bounties.
