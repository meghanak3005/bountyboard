# BountyBoard Frontend

Next.js App Router application using TypeScript, Tailwind CSS, wagmi and
viem.

## Responsibilities

-   Bauhaus-styled responsive UI.
-   Wallet connection and Monad Testnet network experience.
-   Reading bounty state from the contract.
-   Creating bounties, submitting solutions and approving winners.

## Setup

1.  Install the dependencies in this directory using the package manager
    selected for the project.
2.  Copy `.env.example` to `.env.local`.
3.  Set the deployed contract address and public chain configuration.
4.  Start the Next.js development server using the package script.

Do not put private keys or seed phrases in frontend environment
variables. The UI must wait for transaction confirmation before
displaying success.
