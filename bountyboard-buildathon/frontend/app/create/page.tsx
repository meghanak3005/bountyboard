"use client";

import { useState } from "react";
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from "wagmi";
import { BOUNTY_BOARD_ADDRESS, BOUNTY_BOARD_ABI } from "@/lib/contracts/bountyBoard";
import { monadTestnet } from "@/lib/config";
import { parseMonSafe, formatMon, shortenAddress } from "@/lib/utils";
import { TransactionFeedback } from "@/components/TransactionFeedback";
import { PlusCircle, Wallet, Lock, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CreateBountyPage() {
  const { address, isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { data: balanceData } = useBalance({ address });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rewardMon, setRewardMon] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    data: hash,
    writeContract,
    isPending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // 1. Validation
    if (!title.trim()) {
      setValidationError("Please enter a title for the bounty.");
      return;
    }
    if (!description.trim()) {
      setValidationError("Please provide detailed requirements in the description.");
      return;
    }
    const rewardWei = parseMonSafe(rewardMon);
    if (!rewardWei || rewardWei <= 0n) {
      setValidationError("Reward must be a positive number greater than 0 MON.");
      return;
    }

    if (!isConnected) {
      setValidationError("Please connect your Web3 wallet first.");
      return;
    }

    if (chainId !== monadTestnet.id) {
      setValidationError("Your wallet must be connected to Monad Testnet (Chain ID 10143).");
      return;
    }

    if (balanceData && balanceData.value < rewardWei) {
      setValidationError(
        `Insufficient balance. You have ${formatMon(balanceData.value)} MON, but reward is ${rewardMon} MON.`
      );
      return;
    }

    // 2. Submit transaction
    writeContract({
      address: BOUNTY_BOARD_ADDRESS,
      abi: BOUNTY_BOARD_ABI,
      functionName: "createBounty",
      args: [title.trim(), description.trim()],
      value: rewardWei,
      chainId: monadTestnet.id,
    });
  };

  const isContractUnset =
    BOUNTY_BOARD_ADDRESS === "0x0000000000000000000000000000000000000000";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
      {/* Header */}
      <div className="border-b-4 border-[#121212] pb-6 mb-8">
        <span className="text-xs font-black uppercase tracking-[0.25em] text-[#1040C0] block mb-2">
          CREATOR ESCROW
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#121212] uppercase tracking-tight">
          CREATE A NEW BOUNTY
        </h1>
        <p className="text-sm font-medium text-gray-700 mt-2">
          Lock MON in the smart contract escrow. Once your challenge is completed and approved,
          the funds will be instantly released to the winner.
        </p>
      </div>

      {/* Contract unconfigured alert */}
      {isContractUnset && (
        <div className="mb-6 p-4 bg-[#F0C020] border-2 border-[#121212] shadow-bauhaus-sm text-xs font-bold text-[#121212] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#D02020]" />
          Note: BOUNTY_BOARD_ADDRESS is currently set to placeholder address. Make sure to deploy
          to Monad Testnet and set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-8 bg-white border-bauhaus shadow-bauhaus-md p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Title Field */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#121212] mb-2">
                BOUNTY TITLE <span className="text-[#D02020]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Build an On-Chain Analytics Dashboard"
                disabled={isPending || isConfirming}
                className="w-full px-4 py-3 bg-[#F0F0F0] border-2 border-[#121212] text-sm font-bold text-[#121212] placeholder-gray-500 focus:outline-none focus:bg-white"
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#121212] mb-2">
                DETAILED REQUIREMENTS & SPECIFICATIONS <span className="text-[#D02020]">*</span>
              </label>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what needs to be built, acceptance criteria, submission format (e.g. GitHub repo link + live demo)..."
                disabled={isPending || isConfirming}
                className="w-full px-4 py-3 bg-[#F0F0F0] border-2 border-[#121212] text-sm font-medium text-[#121212] placeholder-gray-500 focus:outline-none focus:bg-white"
              />
            </div>

            {/* Reward Field */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#121212] mb-2">
                ESCROW REWARD AMOUNT (MON) <span className="text-[#D02020]">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  min="0.0001"
                  value={rewardMon}
                  onChange={(e) => setRewardMon(e.target.value)}
                  placeholder="0.5"
                  disabled={isPending || isConfirming}
                  className="w-full px-4 py-3 bg-[#F0F0F0] border-2 border-[#121212] text-sm font-bold text-[#121212] placeholder-gray-500 focus:outline-none focus:bg-white"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black uppercase tracking-wider text-gray-500">
                  MON
                </span>
              </div>
              <p className="text-[11px] font-medium text-gray-600 mt-1.5 flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#1040C0]" />
                This amount will be locked in the contract until you approve a solution.
              </p>
            </div>

            {/* Validation Error Banner */}
            {validationError && (
              <div className="p-3 bg-[#D02020] text-white border-2 border-[#121212] shadow-bauhaus-sm text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#F0C020]" />
                {validationError}
              </div>
            )}

            {/* Transaction Feedback */}
            <TransactionFeedback
              isPending={isPending}
              isConfirming={isConfirming}
              isSuccess={isConfirmed}
              hash={hash}
              error={writeError || receiptError}
              successTitle="Bounty Created Successfully!"
              successMessage="Your reward has been escrowed on Monad Testnet and the bounty is now OPEN for submissions."
            />

            {/* Action Buttons */}
            {isConfirmed ? (
              <div className="flex gap-4">
                <Link
                  href="/bounties"
                  className="btn-press flex-1 py-3.5 bg-[#1040C0] text-white border-2 border-[#121212] shadow-bauhaus font-black text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:bg-[#0c329b]"
                >
                  VIEW ALL BOUNTIES <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setTitle("");
                    setDescription("");
                    setRewardMon("");
                    resetWrite();
                  }}
                  className="btn-press px-6 py-3.5 bg-[#F0C020] text-[#121212] border-2 border-[#121212] shadow-bauhaus font-black text-xs uppercase tracking-widest hover:bg-yellow-400"
                >
                  CREATE ANOTHER
                </button>
              </div>
            ) : !isConnected ? (
              <div className="p-4 bg-[#F0F0F0] border-2 border-[#121212] text-center text-xs font-bold">
                Please connect your wallet in the navigation header to create a bounty.
              </div>
            ) : chainId !== monadTestnet.id ? (
              <button
                type="button"
                onClick={() => switchChain({ chainId: monadTestnet.id })}
                className="btn-press w-full py-4 bg-[#D02020] text-white border-3 border-[#121212] shadow-bauhaus font-black text-xs uppercase tracking-widest hover:bg-[#b01818]"
              >
                SWITCH TO MONAD TESTNET TO PUBLISH
              </button>
            ) : (
              <button
                type="submit"
                disabled={isPending || isConfirming}
                className="btn-press w-full py-4 bg-[#1040C0] text-white border-3 border-[#121212] shadow-bauhaus-md font-black text-xs uppercase tracking-widest hover:bg-[#0c329b] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                {isPending
                  ? "CONFIRM IN WALLET..."
                  : isConfirming
                  ? "CONFIRMING ON MONAD TESTNET..."
                  : "PUBLISH BOUNTY & LOCK MON"}
              </button>
            )}
          </form>
        </div>

        {/* Sidebar Info Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Wallet Summary Card */}
          <div className="bg-white border-bauhaus shadow-bauhaus p-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 border-b-2 border-[#121212] pb-2 mb-4">
              CONNECTED WALLET
            </h3>
            {isConnected && address ? (
              <div className="flex flex-col gap-2 font-mono text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-sans font-bold">
                    ADDRESS
                  </span>
                  <span className="font-bold text-[#121212] break-all">{address}</span>
                </div>
                <div className="mt-2">
                  <span className="text-gray-500 block text-[10px] uppercase font-sans font-bold">
                    BALANCE
                  </span>
                  <span className="text-lg font-black text-[#1040C0]">
                    {balanceData ? `${formatMon(balanceData.value)} MON` : "..."}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-600 font-medium">Wallet is currently disconnected.</p>
            )}
          </div>

          {/* Rules & Integrity Card */}
          <div className="bg-[#121212] text-white border-bauhaus shadow-bauhaus p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#F0C020] border-b border-white/20 pb-2 mb-4">
              ESCROW GUARANTEE
            </h3>
            <ul className="text-xs text-gray-300 space-y-3 font-medium">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D02020] mt-1.5 flex-shrink-0" />
                <span>Rewards are locked directly in Solidity escrow—not held by any custodian.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1040C0] mt-1.5 flex-shrink-0" />
                <span>Only you, the verified creator, can approve a submission and trigger payout.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0C020] mt-1.5 flex-shrink-0" />
                <span>Submissions are permanent and verifiable on the Monad Testnet ledger.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
