import Link from "next/link";
import { ArrowRight, Lock, Code, CheckCircle, Wallet, ShieldAlert } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
      {/* Header */}
      <div className="border-b-4 border-[#121212] pb-8 mb-12">
        <span className="text-xs font-black uppercase tracking-[0.25em] text-[#1040C0] block mb-2">
          DOCUMENTATION & GUIDE
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-[#121212] uppercase tracking-tight">
          HOW BOUNTYBOARD OPERATES
        </h1>
        <p className="text-base text-gray-700 font-medium mt-3 max-w-2xl">
          Everything on BountyBoard is governed directly by our Solidity smart contract on Monad
          Testnet. No intermediaries, no hidden fees, and transparent payouts.
        </p>
      </div>

      {/* Grid of In-Depth Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Step 1 */}
        <div className="bg-white border-bauhaus shadow-bauhaus-md p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-black text-[#D02020]">01</span>
              <Lock className="w-8 h-8 text-[#1040C0]" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-3">
              CREATING & ESCROWING
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed font-medium mb-4">
              When a creator publishes a task, they specify a descriptive title, detailed acceptance
              criteria, and attach a native MON reward. This reward is immediately escrowed inside the
              <code className="text-[#1040C0] font-mono text-xs bg-[#F0F0F0] px-1 py-0.5 ml-1">
                BountyBoard.sol
              </code>{" "}
              contract.
            </p>
            <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4 font-medium">
              <li>Reward must be greater than zero.</li>
              <li>Title and description cannot be empty.</li>
              <li>Creates an immutable on-chain record and emits <span className="font-mono">BountyCreated</span>.</li>
            </ul>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white border-bauhaus shadow-bauhaus-md p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-black text-[#1040C0]">02</span>
              <Code className="w-8 h-8 text-[#D02020]" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-3">
              DEVELOPING & SUBMITTING
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed font-medium mb-4">
              Developers browse active bounties and work on open-source solutions. Once ready, they
              submit a verifiable link (such as a GitHub pull request, repository, or live deployment URL).
            </p>
            <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4 font-medium">
              <li>Only open bounties accept submissions.</li>
              <li>Bounty creators cannot submit to their own bounties.</li>
              <li>Each developer address may submit once per bounty.</li>
            </ul>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white border-bauhaus shadow-bauhaus-md p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-black text-[#F0C020]">03</span>
              <CheckCircle className="w-8 h-8 text-[#121212]" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-3">
              CREATOR REVIEW & APPROVAL
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed font-medium mb-4">
              The bounty creator inspects the submitted links. When satisfied, the creator signs an
              approval transaction selecting the winning developer address.
            </p>
            <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4 font-medium">
              <li>Only the verified creator address can approve.</li>
              <li>Winner must have submitted an existing solution.</li>
              <li>Approval immediately triggers the payout transaction.</li>
            </ul>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white border-bauhaus shadow-bauhaus-md p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-black text-[#121212]">04</span>
              <Wallet className="w-8 h-8 text-[#F0C020]" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-3">
              INSTANT WINNER PAYOUT
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed font-medium mb-4">
              The contract transfers the full escrowed MON balance directly to the winner. State updates
              to <span className="font-mono text-xs">Completed</span> and cannot be approved a second time.
            </p>
            <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4 font-medium">
              <li>Checks-effects-interactions pattern protects against reentrancy.</li>
              <li>Emits <span className="font-mono">BountyCompleted</span> on Monad Testnet.</li>
              <li>Winner address is permanently recorded on-chain.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security and Integrity Banner */}
      <div className="p-8 bg-[#121212] text-white border-bauhaus shadow-bauhaus-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <ShieldAlert className="w-10 h-10 text-[#F0C020] flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-[#F0C020] mb-1">
              TESTNET MVP NOTICE
            </h3>
            <p className="text-xs text-gray-300 font-medium leading-relaxed max-w-xl">
              BountyBoard is configured for the Monad Testnet (Chain ID 10143) using testnet MON.
              All funds escrowed are testnet tokens. Code is built following security best practices.
            </p>
          </div>
        </div>
        <Link
          href="/bounties"
          className="btn-press px-8 py-3.5 bg-[#1040C0] text-white border-2 border-white shadow-bauhaus-sm font-black text-xs uppercase tracking-widest whitespace-nowrap hover:bg-[#0c329b]"
        >
          EXPLORE ACTIVE BOUNTIES <ArrowRight className="w-4 h-4 inline ml-1" />
        </Link>
      </div>
    </div>
  );
}
