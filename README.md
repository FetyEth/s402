# S402 — Decentralized API & Data Stream Marketplace

S402 lets developers list **data-stream** and **API-based services** on **Somnia Network**, protected by **x402-powered paywalls** and on-chain payments.  

---

## Smart Contract Deployment
| Contract Name     | Network        | Address                                      | Explorer                                                                                                              |
| ----------------- | -------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **S8002Registry** | Somnia Testnet | `0x9d4422E8E1DE1E6032d0b4f450d6227255FA20b4` | [View on Somnia Explorer](https://shannon-explorer.somnia.network/address/0x9d4422E8E1DE1E6032d0b4f450d6227255FA20b4) |

---

## Monorepo Structure

S402/
-  contracts/            # Smart contracts for Somnia Network (S8002 Registry & Reputation)
- frontend/             # Next.js frontend (Wagmi + Tailwind)
- somnia-streams-api/   # Next.js API routes (protected by x402 paywalls)
- pnpm-workspace.yaml   # Workspace configuration


---

## Quickstart

### 1️lone the Repository

```bash
git clone https://github.com/dhananjaypai08/S402.git
cd S402
pnpm install -r
```

## Running Projects
### Frontend
```bash
cd frontend
cp .env.example .env #configure your .env file
PORT=8080 pnpm run dev
```
Runs the web app at http://localhost:8080

## Facilitator on somnia - Work in Progress
```bash
cd somnia-facilitator
touch .env
pnpm run dev
Runs the facilitator at http://localhost:4021
```

## Somnia Streams API
```bash
cd somnia-streams-api
cp .env.example .env # configure your .env file
pnpm run dev
```
API endpoints (protected via x402 paywalls) will be available at http://localhost:3000/streams



### Tech Stack
- Blockchain: Somnia Testnet

- Payments: x402 Facilitator

- Frontend: Next.js + TailwindCSS + Wagmi + Viem

- Backend/API: Next.js Route Handlers (Somnia Data Streams)

- Contracts: Solidity + Foundry

- Workspace: pnpm monorepo