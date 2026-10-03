"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
} from "wagmi";
import { BOUNTY_BOARD_ADDRESS, BOUNTY_BOARD_ABI } from "@/lib/contracts/bountyBoard";
import { monadTestnet } from "@/lib/config";
import {
  formatMon,
  shortenAddress,
  formatTimestamp,
  getStatusText,
} from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";
import { TransactionFeedback } from "@/components/TransactionFeedback";
import {
  User,
  Calendar,
  Layers,
  Send,
  CheckCircle,
  ExternalLink,
  AlertTriangle,
  Award,
  Link as LinkIcon,
  X,
} from "lucide-react";
import Link from "next/link";

export default function BountyDetailsPage() {
  const params = useParams();
  const bountyIdStr = params?.id as string;
  const bountyId = bountyIdStr !== undefined ? BigInt(bountyIdStr) : 0n;

  const { address, isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  // State for Solution Submission form
  const [solutionURI, setSolutionURI] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  // State for Creator Approval Confirmation Modal
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 1. Read Bounty Details
  const {
    data: bountyRaw,
    isLoading: isBountyLoading,
    isError: isBountyError,
    refetch: refetchBounty,
  } = useReadContract({
    address: BOUNTY_BOARD_ADDRESS,
    abi: BOUNTY_BOARD_ABI,
    functionName: "getBounty",
    args: [bountyId],
    query: {
      enabled:
        BOUNTY_BOARD_ADDRESS !== "0x0000000000000000000000000000000000000000" &&
        bountyIdStr !== undefined,
    },
  });

  // 2. Read Submissions for this Bounty
  const {
    data: submissionsRaw,
    isLoading: isSubmissionsLoading,
    refetch: refetchSubmissions,
  } = useReadContract({
    address: BOUNTY_BOARD_ADDRESS,
    abi: BOUNTY_BOARD_ABI,
    functionName: "getSubmissions",
    args: [bountyId],
    query: {
      enabled:
        BOUNTY_BOARD_ADDRESS !== "0x0000000000000000000000000000000000000000" &&
        bountyIdStr !== undefined,
    },
  });

  // 3. Read if connected user has already submitted
  const {
    data: hasSubmittedRaw,
    refetch: refetchHasSubmitted,
  } = useReadContract({
    address: BOUNTY_BOARD_ADDRESS,
    abi: BOUNTY_BOARD_ABI,
    functionName: "hasUserSubmitted",
    args: [bountyId, address as `0x${string}`],
    query: {
      enabled:
        BOUNTY_BOARD_ADDRESS !== "0x0000000000000000000000000000000000000000" &&
        !!address &&
        bountyIdStr !== undefined,
    },
  });

  const hasSubmitted = Boolean(hasSubmittedRaw);

  // Transaction hook for writing (Submit Solution or Approve Winner)
  const {
    data: txHash,
    writeContract,
    isPending: isTxPending,
    error: txError,
    reset: resetTx,
  } = useWriteContract();

  const {
    isLoading: isTxConfirming,
    isSuccess: isTxConfirmed,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Refresh data when transaction confirms
  if (isTxConfirmed) {
    refetchBounty();
    refetchSubmissions();
    refetchHasSubmitted();
  }

  // Parse bounty data
  const bounty = bountyRaw
    ? {
        id: (bountyRaw as any).id,
        creator: (bountyRaw as any).creator as string,
        title: (bountyRaw as any).title as string,
        description: (bountyRaw as any).description as string,
        reward: (bountyRaw as any).reward as bigint,
        createdAt: (bountyRaw as any).createdAt,
        status: Number((bountyRaw as any).status),
        winner: (bountyRaw as any).winner as string,
        submissionCount: (bountyRaw as any).submissionCount,
      }
    : null;

  const submissions = Array.isArray(submissionsRaw)
    ? submissionsRaw.map((s: any) => ({
        submitter: s.submitter as string,
        solutionURI: s.solutionURI as string,
        submittedAt: s.submittedAt,
      }))
    : [];

  const isCreator =
    !!address &&
    !!bounty &&
    address.toLowerCase() === bounty.creator.toLowerCase();

  const isOpen = bounty?.status === 0;
  const isCompleted = bounty?.status === 1;

  // Handler: Submit solution
  const handleSubmitSolution = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    resetTx();

    if (!solutionURI.trim()) {
      setSubmitError("Please enter a valid solution link (e.g. GitHub URL or demo).");
      return;
    }
    if (!isConnected) {
      setSubmitError("Please connect your wallet first.");
      return;
    }
    if (chainId !== monadTestnet.id) {
      setSubmitError("Please switch your wallet to Monad Testnet.");
      return;
    }

    writeContract({
      address: BOUNTY_BOARD_ADDRESS,
      abi: BOUNTY_BOARD_ABI,
      functionName: "submitSolution",
      args: [bountyId, solutionURI.trim()],
      chainId: monadTestnet.id,
    });
  };

  // Handler: Approve Winner
  const handleApproveWinner = () => {
    if (!selectedWinner) return;
    resetTx();

    writeContract({
      address: BOUNTY_BOARD_ADDRESS,
      abi: BOUNTY_BOARD_ABI,
      functionName: "approveSubmission",
      args: [bountyId, selectedWinner as `0x${string}`],
      chainId: monadTestnet.id,
    });
    setModalOpen(false);
  };

  if (isBountyLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block p-6 bg-white border-bauhaus shadow-bauhaus font-black text-sm uppercase tracking-widest">
          LOADING BOUNTY #{bountyIdStr} FROM MONAD TESTNET...
        </div>
      </div>
    );
  }

  if (isBountyError || !bounty) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="p-8 bg-white border-bauhaus shadow-bauhaus-md">
          <AlertTriangle className="w-12 h-12 text-[#D02020] mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
            BOUNTY NOT FOUND
          </h2>
          <p className="text-xs text-gray-600 mb-6 font-medium">
            Could not retrieve bounty #{bountyIdStr} from the contract. It may not exist or the RPC
            is unreachable.
          </p>
          <Link
            href="/bounties"
            className="btn-press px-6 py-3 bg-[#1040C0] text-white border-2 border-[#121212] shadow-bauhaus font-black text-xs uppercase"
          >
            BACK TO EXPLORER
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/bounties"
          className="text-xs font-black uppercase tracking-widest text-[#1040C0] hover:underline"
        >
          ← BACK TO BOUNTIES
        </Link>
      </div>

      {/* Completion Banner if completed */}
      {isCompleted && (
        <div className="mb-8 p-6 bg-[#F0C020] border-bauhaus shadow-bauhaus-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#121212] text-[#F0C020] flex items-center justify-center font-black">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#121212] block">
                CHALLENGE COMPLETED & PAID
              </span>
              <p className="text-sm font-bold font-mono text-[#121212]">
                Winner: {bounty.winner}
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-white border-2 border-[#121212] font-black text-xs uppercase">
            PAID: {formatMon(bounty.reward)} MON
          </div>
        </div>
      )}

      {/* Main Grid: Details Left, Submissions Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Bounty Specification */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white border-bauhaus shadow-bauhaus-md p-6 sm:p-8">
            {/* Header info */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#121212] text-white font-mono text-xs font-black">
                  #{bounty.id.toString()}
                </span>
                <StatusBadge status={bounty.status} />
              </div>

              <div className="px-4 py-2 bg-[#F0C020] border-2 border-[#121212] shadow-bauhaus-sm text-right">
                <span className="text-[10px] font-black uppercase text-[#121212] block">
                  ESCROW REWARD
                </span>
                <span className="text-xl font-black text-[#121212]">
                  {formatMon(bounty.reward)} MON
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-black text-[#121212] uppercase tracking-tight mb-4">
              {bounty.title}
            </h1>

            {/* Metadata Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-y-2 border-[#121212] text-xs font-bold text-gray-700 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#1040C0]" />
                <span>Creator:</span>
                <span className="font-mono text-[#121212]">{shortenAddress(bounty.creator)}</span>
                {isCreator && (
                  <span className="px-1.5 py-0.5 bg-[#1040C0] text-white text-[10px] uppercase font-black">
                    YOU
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 sm:justify-end">
                <Calendar className="w-4 h-4 text-[#D02020]" />
                <span>Created: {formatTimestamp(bounty.createdAt)}</span>
              </div>
            </div>

            {/* Requirements Body */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                TASK REQUIREMENTS & SCOPE
              </h3>
              <p className="text-sm text-[#121212] font-medium whitespace-pre-wrap leading-relaxed">
                {bounty.description}
              </p>
            </div>
          </div>

          {/* Submission Form Section (Only if open and not creator and not submitted) */}
          {isOpen && !isCreator && (
            <div className="bg-white border-bauhaus shadow-bauhaus-md p-6 sm:p-8">
              <div className="flex items-center justify-between border-b-2 border-[#121212] pb-3 mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#1040C0] block">
                    DEVELOPER ACTION
                  </span>
                  <h3 className="text-xl font-black uppercase tracking-tight text-[#121212]">
                    SUBMIT YOUR SOLUTION
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#1040C0] text-white flex items-center justify-center font-black">
                  <Send className="w-4 h-4" />
                </div>
              </div>

              {hasSubmitted ? (
                <div className="p-4 bg-[#F0F0F0] border-2 border-[#121212] flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#1040C0]" />
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider block">
                      SOLUTION SUBMITTED
                    </span>
                    <p className="text-xs text-gray-600 font-medium">
                      You have already submitted a solution to this bounty. Awaiting creator review.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitSolution} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#121212] mb-1.5">
                      SOLUTION LINK (GITHUB PR / REPOSITORY / DEMO) <span className="text-[#D02020]">*</span>
                    </label>
                    <input
                      type="url"
                      value={solutionURI}
                      onChange={(e) => setSolutionURI(e.target.value)}
                      placeholder="https://github.com/username/project/pull/1"
                      disabled={isTxPending || isTxConfirming}
                      className="w-full px-4 py-3 bg-[#F0F0F0] border-2 border-[#121212] text-xs font-bold text-[#121212] placeholder-gray-500 focus:outline-none focus:bg-white"
                    />
                    <p className="text-[11px] text-gray-500 font-medium mt-1">
                      Note: Submitting is not automatic approval. The bounty creator will review your link.
                    </p>
                  </div>

                  {submitError && (
                    <div className="p-3 bg-[#D02020] text-white text-xs font-bold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#F0C020]" />
                      {submitError}
                    </div>
                  )}

                  <TransactionFeedback
                    isPending={isTxPending}
                    isConfirming={isTxConfirming}
                    isSuccess={isTxConfirmed}
                    hash={txHash}
                    error={txError}
                    successTitle="Solution Submitted Successfully!"
                    successMessage="Your solution link is now recorded on Monad Testnet."
                  />

                  {!isConnected ? (
                    <div className="p-3 bg-[#F0F0F0] border-2 border-[#121212] text-xs font-bold text-center">
                      Connect your wallet in the navigation to submit a solution.
                    </div>
                  ) : chainId !== monadTestnet.id ? (
                    <button
                      type="button"
                      onClick={() => switchChain({ chainId: monadTestnet.id })}
                      className="btn-press py-3 bg-[#D02020] text-white font-black text-xs uppercase"
                    >
                      SWITCH TO MONAD TESTNET TO SUBMIT
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isTxPending || isTxConfirming}
                      className="btn-press py-3.5 bg-[#1040C0] text-white border-2 border-[#121212] shadow-bauhaus font-black text-xs uppercase tracking-widest hover:bg-[#0c329b] disabled:opacity-50"
                    >
                      {isTxPending
                        ? "CONFIRM IN WALLET..."
                        : isTxConfirming
                        ? "AWAITING CONFIRMATION..."
                        : "SUBMIT SOLUTION LINK"}
                    </button>
                  )}
                </form>
              )}
            </div>
          )}

          {isCreator && isOpen && (
            <div className="p-4 bg-[#F0C020] border-2 border-[#121212] shadow-bauhaus-sm text-xs font-bold text-[#121212]">
              💡 You are the creator of this bounty. Review candidate submissions on the right and click
              &quot;APPROVE &amp; PAYOUT&quot; to award the escrowed MON.
            </div>
          )}
        </div>

        {/* Right Column: Submissions List */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white border-bauhaus shadow-bauhaus-md p-6">
            <div className="flex items-center justify-between border-b-2 border-[#121212] pb-3 mb-6">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#1040C0]" />
                <h3 className="text-lg font-black uppercase tracking-tight">
                  SUBMISSIONS ({submissions.length})
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-gray-500">
                {submissions.length === 1 ? "1 entry" : `${submissions.length} entries`}
              </span>
            </div>

            {isSubmissionsLoading ? (
              <p className="text-xs text-gray-500 py-6 text-center font-bold">
                Loading submissions...
              </p>
            ) : submissions.length === 0 ? (
              <div className="py-12 text-center text-gray-500 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#E0E0E0] border-2 border-[#121212] flex items-center justify-center font-bold mb-3 text-lg">
                  0
                </div>
                <p className="text-xs font-black uppercase tracking-wider text-[#121212] mb-1">
                  NO SUBMISSIONS YET
                </p>
                <p className="text-xs font-medium max-w-xs">
                  Be the first developer to complete this task and submit a solution!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {submissions.map((sub, idx) => {
                  const isWinner =
                    bounty.winner &&
                    sub.submitter.toLowerCase() === bounty.winner.toLowerCase();

                  return (
                    <div
                      key={idx}
                      className={`p-4 border-2 border-[#121212] ${
                        isWinner
                          ? "bg-[#F0C020] shadow-bauhaus-sm"
                          : "bg-[#F0F0F0] hover:bg-white transition-colors"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-black text-[#121212]">
                          {shortenAddress(sub.submitter)}
                        </span>
                        {isWinner ? (
                          <span className="px-2 py-0.5 bg-[#D02020] text-white text-[10px] font-black uppercase tracking-wider">
                            WINNER
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-500 font-medium">
                            {formatTimestamp(sub.submittedAt)}
                          </span>
                        )}
                      </div>

                      {/* Solution URI Link */}
                      <a
                        href={sub.solutionURI}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#1040C0] font-bold underline flex items-center gap-1.5 break-all mb-3 hover:text-[#0c329b]"
                      >
                        <LinkIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        {sub.solutionURI}
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>

                      {/* Creator Approval Action Button */}
                      {isCreator && isOpen && !isCompleted && (
                        <button
                          onClick={() => {
                            setSelectedWinner(sub.submitter);
                            setModalOpen(true);
                          }}
                          className="btn-press w-full py-2 bg-[#D02020] text-white border-2 border-[#121212] shadow-bauhaus-sm font-black text-xs uppercase tracking-wider hover:bg-[#b01818]"
                        >
                          APPROVE & AWARD {formatMon(bounty.reward)} MON
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Creator Approval */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-none flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#121212] shadow-bauhaus-lg max-w-lg w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 p-1 hover:bg-[#E0E0E0] border-2 border-[#121212]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-[#D02020] text-white border-2 border-[#121212] shadow-bauhaus-sm flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-black uppercase tracking-tight text-[#121212] mb-2">
              CONFIRM WINNER APPROVAL
            </h3>
            <p className="text-xs text-gray-700 font-medium mb-6 leading-relaxed">
              This action will finalize Bounty #{bounty.id.toString()} and immediately transfer the
              escrowed reward to the winner. This on-chain action cannot be undone.
            </p>

            <div className="bg-[#F0F0F0] border-2 border-[#121212] p-4 font-mono text-xs mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">WINNER:</span>
                <span className="font-bold text-[#121212] break-all">{selectedWinner}</span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-2">
                <span className="text-gray-500">PAYOUT AMOUNT:</span>
                <span className="font-bold text-[#1040C0] text-sm">
                  {formatMon(bounty.reward)} MON
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setModalOpen(false)}
                className="btn-press flex-1 py-3 bg-[#E0E0E0] text-[#121212] border-2 border-[#121212] font-black text-xs uppercase"
              >
                CANCEL
              </button>
              <button
                onClick={handleApproveWinner}
                className="btn-press flex-1 py-3 bg-[#D02020] text-white border-2 border-[#121212] shadow-bauhaus font-black text-xs uppercase tracking-wider hover:bg-[#b01818]"
              >
                CONFIRM & PAYOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
