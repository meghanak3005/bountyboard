# BountyBoard Task Checklist

Use `[ ]` for not started, `[~]` for in progress, and `[x]` for
completed. Only mark items complete after verification.

## Discovery

-   [x] Inspect repository and existing implementation.
-   [x] Record stack, conventions and constraints.
-   [x] Plan changes without deleting useful work.

## Workspace

-   [x] Create/verify `frontend/`.
-   [x] Create/verify `backend/`.
-   [x] Add root `README.md`.
-   [x] Add `phases.md`.
-   [x] Add `task.md`.
-   [x] Add `rules.md`.
-   [x] Add secret-safe `.gitignore` entries.

## Backend / Solidity

-   [x] Configure Hardhat and compiler.
-   [x] Implement `BountyBoard.sol`.
-   [x] Implement create bounty.
-   [x] Implement solution submission.
-   [x] Implement creator approval and payout.
-   [x] Add read methods and events.
-   [x] Add access control, validation and reentrancy protection.
-   [x] Compile contract.

## Backend / Tests and deployment

-   [x] Add lifecycle and authorization tests.
-   [x] Add payout and repeat-payout tests.
-   [x] Add failure/security-focused tests.
-   [x] Run tests and resolve failures.
-   [x] Add deployment script.
-   [x] Add `backend/.env.example`.
-   [x] Document testnet deployment.
-   [x] Deploy only if explicitly requested.
-   [x] Record actual address and explorer link if deployed.

## Frontend / Foundation

-   [x] Set up Next.js App Router and TypeScript.
-   [x] Configure Tailwind and Outfit.
-   [x] Add Bauhaus design tokens.
-   [x] Build geometric logo.
-   [x] Build navigation and footer.
-   [x] Build reusable buttons, cards and status badges.
-   [x] Add responsive and accessible behavior.

## Frontend / Pages

-   [x] Landing page.
-   [x] Bounty explorer.
-   [x] Create bounty page.
-   [x] Bounty details page.
-   [x] Submission form.
-   [x] Approval confirmation.
-   [x] Wallet connection and network states.
-   [x] Loading, empty, error and disconnected states.

## Integration

-   [x] Configure wagmi and viem.
-   [x] Add Monad Testnet chain configuration.
-   [x] Connect contract reads.
-   [x] Connect bounty creation transaction.
-   [x] Connect submission transaction.
-   [x] Connect approval/payout transaction.
-   [x] Verify ABI and address handoff.
-   [x] Add transaction receipt and explorer links.
-   [x] Refresh relevant data after confirmed transactions.

## Final verification

-   [x] Run contract compilation.
-   [x] Run contract tests.
-   [x] Run frontend lint/typecheck/build.
-   [x] Test responsive layouts.
-   [x] Test wallet rejection and wrong-network states.
-   [x] Test complete lifecycle when deployment is available.
-   [x] Update all documentation.
-   [x] Report verified outcomes and remaining limitations.
