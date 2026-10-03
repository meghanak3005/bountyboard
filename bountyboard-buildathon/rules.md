# BountyBoard Agent Rules

These rules are persistent instructions for any coding agent working in
this repository.

## 1. Workflow

-   Inspect the repository before editing.
-   Follow `phases.md` in order and keep `task.md` current.
-   Preserve useful existing code and conventions.
-   Make focused, understandable changes.
-   Do not stop after producing a plan; implement unless blocked.
-   Do not claim a command, test, build or deployment succeeded unless
    it was actually run and succeeded.

## 2. Repository boundaries

-   `frontend/` is the Next.js application and contains UI, wagmi and
    viem integration.
-   `backend/` contains Solidity, Hardhat, deployment scripts and
    contract tests.
-   Keep dependencies and scripts in the correct package.
-   Keep the ABI/address integration explicit, centralized and
    documented.
-   Do not create duplicate competing contract configurations.

## 3. Bauhaus design rules

-   Follow the design tokens in `master-prompt.md`.
-   Use only off-white, black, red, blue, yellow, muted gray and white
    as the core palette.
-   Use Outfit typography.
-   Use geometric shapes: circles, squares and triangles.
-   Use square corners or full circles; avoid intermediate radii.
-   Use bold black borders and hard offset shadows only.
-   Use color-blocked sections intentionally.
-   Do not use gradients, glassmorphism, blur shadows or generic SaaS
    styling.
-   Keep decorative shapes behind content and away from controls.
-   Keep the UI responsive and accessible.

## 4. Frontend engineering

-   Use TypeScript and avoid `any` unless there is a documented reason.
-   Prefer reusable components and centralized design tokens.
-   Keep wallet and contract logic out of unrelated presentation
    components.
-   Use semantic HTML and accessible labels.
-   Provide keyboard focus states and respect reduced motion.
-   Handle loading, empty, disconnected, wrong-network and error states.
-   Validate user input before submitting transactions.
-   Never present mock data as live chain data.
-   Never simulate a successful transaction.

## 5. Web3 and transaction integrity

-   Use Monad Testnet chain ID `10143` for this MVP.
-   Use wagmi and viem for wallet and EVM interactions.
-   Verify the configured chain before writes.
-   Wait for transaction receipts before showing success.
-   Handle wallet rejection, insufficient balance, contract reverts and
    RPC failures.
-   Prevent duplicate submissions while a write is pending.
-   Refresh contract-backed data after confirmed transactions.
-   Display transaction hashes and explorer links when available.
-   Keep ABI and contract address synchronized with the backend
    deployment.

## 6. Solidity security

-   Enforce positive rewards and valid inputs.
-   Enforce bounty existence, open status and creator authorization.
-   Prevent creator self-submission and duplicate submissions.
-   Require a valid submission before approval.
-   Ensure completion and payout can happen only once.
-   Use checks-effects-interactions and reentrancy protection for
    payouts.
-   Handle failed transfers safely.
-   Emit events for important state changes.
-   Do not add unnecessary complexity to the MVP.
-   Add tests for authorization, lifecycle, payout and failure paths.

## 7. Secrets and deployment

-   Never hardcode private keys, seed phrases or credentials.
-   Never commit `.env` files.
-   Never expose private keys in `NEXT_PUBLIC_*` variables.
-   Keep `.env.example` placeholders only.
-   Never deploy automatically.
-   Do not use mainnet for the MVP.
-   Do not claim a contract is deployed or verified without evidence.

## 8. Dependencies and code quality

-   Prefer existing dependencies when suitable.
-   Avoid unnecessary packages and duplicated functionality.
-   Keep code formatted and type-safe.
-   Run available lint, typecheck, build, compile and test commands.
-   Fix errors introduced by the changes.
-   Document important setup assumptions and known limitations.

## 9. Completion reporting

At the end of a work session: - Summarize what changed. - List the
commands actually run and their outcomes. - Identify what remains
incomplete. - State whether deployment occurred and provide the actual
address only if available. - Never overstate test coverage, security
review or production readiness.
