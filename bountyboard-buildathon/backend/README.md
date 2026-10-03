# BountyBoard Backend

Solidity and Hardhat workspace for the BountyBoard contract.

## Responsibilities

-   Compile the Solidity contract.
-   Run automated contract tests.
-   Deploy to Monad Testnet when explicitly requested.
-   Provide the ABI and deployed address to the frontend.

## Setup

1.  Install dependencies in this directory.
2.  Copy `.env.example` to `.env`.
3.  Configure the Monad RPC URL and a testnet deployment key if
    deployment is needed.
4.  Run the package scripts for compilation and tests.
5.  Deploy only after reviewing the script and confirming deployment is
    intended.

Never commit `.env` or expose deployment credentials. Do not use a real
wallet's seed phrase. The frontend should use only the deployed contract
address and ABI, never the deployer key.
