# BountyBoard --- Antigravity Master Prompt

Act as a senior full-stack Web3 engineer, Solidity security-minded
developer, Next.js architect, and expert UI/UX designer. Build
**BountyBoard**, a complete and polished on-chain bounty marketplace for
Monad Testnet.

## 1. Product goal

BountyBoard lets a user publish a task with a MON reward, developers
submit solution links, and the bounty creator approve one submission.
The smart contract escrows the reward and pays the selected winner after
approval.

Build a real, testable MVP---not a static mockup. Do not fabricate
successful transactions or present mock data as live on-chain data.

## 2. Required repository structure

Create and maintain these top-level directories and files:

``` text
bountyboard/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── backend/
│   ├── contracts/
│   ├── scripts/
│   ├── test/
│   ├── hardhat.config.ts
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── phases.md
├── task.md
├── rules.md
├── master-prompt.md
└── README.md
```

Keep the frontend and backend as **separate applications/tooling
areas**: - `frontend/` contains Next.js, TypeScript, Tailwind, wagmi and
viem integration. - `backend/` contains Solidity contracts, Hardhat
configuration, deployment scripts and contract tests. - Do not mix
Hardhat-only dependencies into the frontend package. - The frontend
consumes the backend contract ABI and deployed address through a clearly
documented integration boundary. If ABI copying or generation is needed,
provide a repeatable script and document it. - If the workspace already
exists, inspect it first and preserve useful files. Adapt the structure
carefully rather than deleting existing work.

## 3. Technology stack

### Frontend

-   Next.js App Router
-   TypeScript
-   Tailwind CSS
-   wagmi
-   viem
-   lucide-react
-   MetaMask-compatible injected wallet

### Backend

-   Solidity
-   Hardhat
-   TypeScript deployment and test scripts
-   OpenZeppelin contracts only where useful and compatible with the
    selected compiler

### Network

Monad Testnet: - Chain ID: `10143` - RPC:
`https://rpc.testnet.monad.xyz` - Explorer:
`https://testnet.monadscan.com` - Native currency: `MON`

Use the chain configuration consistently. Never claim deployment or
verification succeeded unless it actually did.

## 4. Mandatory Bauhaus design system

The entire application must follow the supplied Bauhaus design system.
Do not produce a generic Tailwind/SaaS dashboard.

### Design philosophy

Constructivist modernism; form follows function. Build a geometric
composition using circles, squares and triangles. The result should feel
like a bold, carefully art-directed Bauhaus poster brought to life.

### Colors

-   Canvas: `#F0F0F0`
-   Foreground: `#121212`
-   Bauhaus red: `#D02020`
-   Bauhaus blue: `#1040C0`
-   Bauhaus yellow: `#F0C020`
-   Muted: `#E0E0E0`
-   White: `#FFFFFF`
-   Borders: `#121212`

Keep to this palette. No gradients, glassmorphism, blurred shadows or
arbitrary accent colors.

### Typography

Use Outfit (400, 500, 700, 900). Use large uppercase, tight-tracked,
heavy display headings; readable medium-weight body copy; uppercase
tracking-widest labels. Scale responsively.

### Geometry and depth

-   Rectangles use square corners; circles use fully rounded shapes.
    Avoid in-between radii.
-   Use deliberate 2px/4px black borders.
-   Use hard offset shadows only: 3--4px small, 6px medium, 8px large.
-   Buttons press down by 2px and lose their shadow while active.
-   Cards may lift slightly on hover.
-   Use 45-degree rotations selectively.
-   Decorative shapes must never reduce readability or obstruct
    controls.

### Required color blocking

-   Hero: off-white content panel with Bauhaus-blue visual panel.
-   Statistics: yellow section.
-   Benefits: red section with white text and yellow accents.
-   Final CTA: yellow section with geometric decoration.
-   Footer: near-black with white text and primary-color accents.

### Logo and icons

Build a logo from a red circle, blue square and yellow triangle. Use
lucide-react icons, usually 24--32px, with consistent stroke weight.
Place icons in bordered geometric containers where appropriate.

### Responsive and accessible UI

Mobile-first. Use a hamburger navigation below 768px. Use single-column
layouts on narrow screens and responsive grids on larger screens. Ensure
no horizontal overflow. Provide semantic markup, keyboard support,
visible focus states, accessible labels, sufficient contrast and
`prefers-reduced-motion` support. Keep motion snappy (200--300ms,
ease-out).

## 5. Pages and user experience

### Landing page

-   Bauhaus geometric logo and responsive navigation.
-   Links: Explore Bounties, How It Works, About.
-   Connect Wallet action.
-   Hero headline: **BUILD. SUBMIT. EARN.**
-   Concise explanation of on-chain bounties.
-   CTAs: Explore Bounties and Create a Bounty.
-   Blue geometric illustration with overlapping circles, rotated square
    and central geometric composition.
-   Clear Monad Testnet indicator.
-   Statistics: total, open and completed bounties, and total rewards.
    Derive from real contract data when available; otherwise show an
    honest unavailable/zero state.
-   Four-step How It Works section.
-   Red benefits section explaining transparent on-chain rewards, open
    challenges and verifiable payouts without claiming that contracts
    guarantee work quality.
-   Yellow final CTA and near-black footer.

### Bounty explorer

-   Search title and description.
-   Filter by supported status.
-   Sort by newest or reward.
-   Responsive bounty cards.
-   Show title, summary, MON reward, shortened creator address, status
    and submission count where available.
-   Include loading, empty, error and disconnected states.
-   Use actual contract data; do not show fabricated bounties as live
    data.

### Create bounty

Fields: - Title (required) - Description (required) - Reward amount in
MON (required)

Validate input and require a positive reward. Show the connected wallet
and balance when available. Explain that the reward is locked in the
contract. Submit through the wallet, wait for confirmation, show errors
and provide a MonadScan link. After confirmation, navigate to the
created bounty when possible. Never fake success.

### Bounty details

Display full bounty details, reward, creator, status and submissions.
Show the submission form only when eligible and the bounty is open.
Accept a valid solution URL. Explain that submission is not automatic
approval.

Only the creator can approve a submitted solution. Show a confirmation
step with winner and reward details. After confirmed approval, show
completion and winner information. Hide or disable actions that are no
longer valid.

### Wallet experience

Implement connect/disconnect, shortened address, chain status, MON
balance, wrong-network warning, switch-network action where supported,
and transaction progress. Handle rejection, unavailable providers and
RPC failures gracefully.

## 6. Smart contract

Create `backend/contracts/BountyBoard.sol`.

Implement a simple, secure MVP with: - Bounty ID, creator, title,
description, reward, creation metadata, status and winner. -
`createBounty(string title, string description) payable` -
`submitSolution(uint256 bountyId, string solutionURI)` -
`approveSubmission(uint256 bountyId, address winner)` - Read methods for
bounty count, bounty details and submissions. - Events: `BountyCreated`,
`SolutionSubmitted`, `BountyCompleted`.

Rules: - Reward must be greater than zero. - Reject invalid/empty title
and description. - Validate bounty existence. - Only open bounties
accept submissions. - Creator cannot submit to their own bounty. - Each
address may submit only once per bounty. - Reject empty solution URI. -
Only the creator may approve. - Winner must have submitted a solution. -
Complete and pay each bounty only once. - Protect payout against
reentrancy. - Use checks-effects-interactions and safe transfer
handling. - Emit useful events. - Avoid unnecessary complexity and
untrusted external calls.

Keep the initial scope to one contract and the core bounty lifecycle. Do
not add AI judging, chat, tokens, governance or reputation systems.

## 7. Hardhat tests

In `backend/test/`, write tests covering: 1. Valid bounty creation and
stored values. 2. Zero reward rejection. 3. Empty/invalid input
rejection. 4. Valid solution submission. 5. Duplicate submission
rejection. 6. Creator self-submission rejection. 7. Submission after
completion rejection. 8. Non-creator approval rejection. 9. Approval of
a nonexistent submission rejection. 10. Successful payout and correct
recipient balance change. 11. Completed status and winner storage. 12.
Second payout/approval rejection. 13. Failed payout behavior. 14.
Reentrancy protection where applicable.

Run the tests and fix failures. Report the actual result; never state
that tests pass unless they were run and passed.

## 8. Deployment and configuration

In `backend/`, provide: - `hardhat.config.ts` - deployment script under
`scripts/` - `.env.example` - package scripts for compile, test and
deploy - clear backend README

Use environment variables for RPC and deployment key. Never commit
`.env`, hardcode private keys, expose secrets through `NEXT_PUBLIC_*`,
or request seed phrases. Do not deploy automatically. Mainnet is out of
scope.

After deployment, report the actual contract address and explorer URL,
then document how the frontend receives the ABI and address.

In `frontend/`, provide: - `.env.example` - centralized chain/wagmi
configuration - centralized contract ABI/address configuration -
reusable hooks/components - clear frontend README

Only public values may use `NEXT_PUBLIC_*`. Ensure frontend and backend
agree on chain ID, ABI and deployed address.

## 9. Error handling and transaction integrity

For every write: - Validate form data before opening the wallet. -
Confirm the wallet is connected to Monad Testnet. - Show pending state
and prevent duplicate clicks. - Handle wallet rejection, insufficient
funds, contract reverts, RPC failures and receipt failures. - Wait for
transaction confirmation before displaying success. - Show transaction
hash and explorer link when available. - Refresh relevant contract reads
after confirmed writes.

For contract reads, provide loading, empty and error states. Do not
silently convert errors into fabricated data.

## 10. Documentation

Root `README.md` should explain the product, repository layout and how
frontend/backend fit together.

Also create and maintain: - `phases.md`: phased implementation plan and
acceptance criteria. - `task.md`: actionable task checklist with
progress status. - `rules.md`: persistent coding, security, UI and
workflow rules for the agent. - `frontend/README.md`: frontend setup,
environment and run instructions. - `backend/README.md`: contract setup,
testing and deployment instructions.

## 11. Implementation workflow

Follow `phases.md` in order. Keep `task.md` updated as work progresses.
Read and obey `rules.md` throughout.

1.  Inspect repository and summarize existing architecture.
2.  Establish the folder structure and design tokens.
3.  Implement and test the contract.
4.  Implement deployment and ABI/address handoff.
5.  Build the responsive frontend.
6.  Integrate wallet and contract reads/writes.
7.  Run tests, lint and build; fix issues.
8.  Prepare a demo walkthrough and document limitations.

Do not stop after generating a plan. Continue implementation unless a
genuine blocker requires user input. Do not overwrite working code just
to match the proposed folder structure.

## 12. Demo flow

The completed MVP should support: 1. Connect a wallet on Monad Testnet.
2. Create a bounty and lock MON. 3. Confirm the transaction. 4. Open
bounty details. 5. Connect a second wallet. 6. Submit a solution URL. 7.
Return to the creator wallet. 8. Review and approve the submission. 9.
Confirm the payout. 10. Verify the completed state and winner on-chain.

## 13. Definition of done

-   Frontend builds and runs.
-   Contract compiles.
-   Hardhat tests pass.
-   Deployment script is usable with valid configuration.
-   Frontend reads actual contract data.
-   Bounty creation, submission, approval and payout work on Monad
    Testnet when deployed and funded.
-   Duplicate payout is prevented.
-   Wallet and transaction errors are handled.
-   UI is recognizably Bauhaus, responsive and accessible.
-   Documentation accurately explains setup and limitations.

At completion, summarize what was implemented, which commands were run
and their actual outcomes, the deployed contract address if one was
deployed, and anything that remains incomplete. Be honest about all
verification and deployment status.
