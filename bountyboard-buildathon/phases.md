# BountyBoard Implementation Phases

Follow these phases in order. Do not mark a phase complete until its
acceptance criteria are met. Update `task.md` as work progresses.

## Phase 0 --- Repository discovery and planning

-   [x] Inspect existing files, dependencies, scripts, conventions and
    git status.
-   [x] Identify whether the repository is empty or contains an existing
    app.
-   [x] Preserve useful existing work; avoid destructive rewrites.
-   [x] Confirm the `frontend/` and `backend/` separation.
-   [x] Record a short implementation plan.

**Acceptance criteria** - Existing architecture and constraints are
understood. - Proposed changes and any blockers are documented.

## Phase 1 --- Workspace and shared conventions

-   [x] Create or validate root documentation: `README.md`, `phases.md`,
    `task.md`, `rules.md`.
-   [x] Create separate `frontend/` and `backend/` directories.
-   [x] Establish package scripts and environment examples.
-   [x] Document the ABI and contract-address handoff.
-   [x] Add ignore rules for dependencies, build artifacts and secrets.

**Acceptance criteria** - Frontend and backend have separate dependency
boundaries. - No secrets are committed. - Setup instructions identify
the required commands.

## Phase 2 --- Solidity contract

-   [x] Configure Hardhat and Solidity.
-   [x] Implement `BountyBoard.sol`.
-   [x] Implement bounty creation, submission, approval and payout.
-   [x] Add events, validation and access control.
-   [x] Apply checks-effects-interactions and reentrancy protection.
-   [x] Compile the contract.

**Acceptance criteria** - Contract compiles without errors. - State
transitions and authorization are explicit. - No duplicate payout path
exists.

## Phase 3 --- Contract tests

-   [x] Test valid creation and stored values.
-   [x] Test invalid reward and text inputs.
-   [x] Test submission eligibility and duplicate prevention.
-   [x] Test creator-only approval and valid winner checks.
-   [x] Test payout, completion and repeat-approval rejection.
-   [x] Test failed transfer and reentrancy behavior where applicable.
-   [x] Run the complete test suite and fix failures.

**Acceptance criteria** - Tests run successfully. - Report the actual
test result; do not claim unrun tests passed.

## Phase 4 --- Testnet deployment setup

-   [x] Configure Monad Testnet (chain ID 10143).
-   [x] Add a deployment script.
-   [x] Add `backend/.env.example`.
-   [x] Document safe private-key handling.
-   [x] Deploy only when explicitly instructed and valid credentials are
    available.
-   [x] Record the actual deployed address and explorer link, if
    deployed.

**Acceptance criteria** - Deployment commands are documented and
reproducible. - No automatic deployment or committed secret. -
Deployment status is accurately reported.

## Phase 5 --- Bauhaus frontend foundation

-   [x] Set up Next.js App Router, TypeScript and Tailwind.
-   [x] Configure Outfit typography and design tokens.
-   [x] Build geometric logo and shared navigation/footer.
-   [x] Build reusable buttons, cards, badges, form controls and
    transaction states.
-   [x] Implement responsive behavior, keyboard focus and reduced-motion
    support.

**Acceptance criteria** - The visual system consistently follows
`rules.md`. - Layout works on mobile, tablet and desktop. - Components
are accessible and reusable.

## Phase 6 --- Application pages

-   [x] Landing page with hero, statistics, how-it-works, benefits and
    CTA.
-   [x] Bounty explorer with search, filtering, sorting and states.
-   [x] Create bounty form and validation.
-   [x] Bounty details and submission flow.
-   [x] Creator approval and payout confirmation.
-   [x] Wallet and wrong-network experience.

**Acceptance criteria** - All required pages and user states exist. - No
fabricated live data or transaction success. - Forms have validation and
useful feedback.

## Phase 7 --- Wallet and contract integration

-   [x] Configure wagmi and viem for Monad Testnet.
-   [x] Integrate wallet connect/disconnect.
-   [x] Connect contract reads to UI.
-   [x] Connect create, submit and approve writes.
-   [x] Wait for receipts and refresh reads after confirmation.
-   [x] Verify frontend ABI/address matches the deployed contract.

**Acceptance criteria** - Contract-backed actions use the correct chain
and address. - Pending, success, rejection and error states are
handled. - On-chain data is rendered honestly.

## Phase 8 --- Verification and demo readiness

-   [x] Run backend compile and tests.
-   [x] Run frontend lint/typecheck/build scripts where available.
-   [x] Fix all reproducible issues.
-   [x] Walk through the demo with two wallets when a deployment is
    available.
-   [x] Update README files and task statuses.
-   [x] Document limitations and anything not verified.

**Acceptance criteria** - Commands and outcomes are reported
accurately. - Demo steps are documented. - Remaining blockers are
clearly identified.
