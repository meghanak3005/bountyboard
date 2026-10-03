"use client";

import { useState, useMemo } from "react";
import { useReadContract, useAccount } from "wagmi";
import { BOUNTY_BOARD_ADDRESS, BOUNTY_BOARD_ABI } from "@/lib/contracts/bountyBoard";
import { BountyCard, BountyCardData } from "@/components/BountyCard";
import { Search, Filter, ArrowUpDown, Plus, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function BountiesExplorerPage() {
  const { isConnected } = useAccount();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "OPEN" | "COMPLETED">("ALL");
  const [sortBy, setSortBy] = useState<"NEWEST" | "REWARD_HIGH" | "REWARD_LOW">("NEWEST");

  const {
    data: allBountiesRaw,
    isLoading,
    isError,
    error,
    refetch,
  } = useReadContract({
    address: BOUNTY_BOARD_ADDRESS,
    abi: BOUNTY_BOARD_ABI,
    functionName: "getAllBounties",
    query: {
      enabled: BOUNTY_BOARD_ADDRESS !== "0x0000000000000000000000000000000000000000",
    },
  });

  const bounties: BountyCardData[] = useMemo(() => {
    if (!Array.isArray(allBountiesRaw)) return [];
    return allBountiesRaw.map((b: any) => ({
      id: b.id,
      creator: b.creator,
      title: b.title,
      description: b.description,
      reward: b.reward,
      createdAt: b.createdAt,
      status: Number(b.status),
      winner: b.winner,
      submissionCount: b.submissionCount,
    }));
  }, [allBountiesRaw]);

  // Filtering and sorting
  const filteredBounties = useMemo(() => {
    return bounties
      .filter((b) => {
        // Status filter
        if (statusFilter === "OPEN" && b.status !== 0) return false;
        if (statusFilter === "COMPLETED" && b.status !== 1) return false;

        // Search term filter
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchesTitle = b.title.toLowerCase().includes(term);
          const matchesDesc = b.description.toLowerCase().includes(term);
          return matchesTitle || matchesDesc;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "NEWEST") {
          return Number(b.createdAt) - Number(a.createdAt);
        }
        if (sortBy === "REWARD_HIGH") {
          return a.reward < b.reward ? 1 : -1;
        }
        if (sortBy === "REWARD_LOW") {
          return a.reward > b.reward ? 1 : -1;
        }
        return 0;
      });
  }, [bounties, statusFilter, searchTerm, sortBy]);

  const isContractUnset =
    BOUNTY_BOARD_ADDRESS === "0x0000000000000000000000000000000000000000";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b-4 border-[#121212] mb-8">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#1040C0] block mb-2">
            EXPLORER
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#121212] uppercase tracking-tight">
            ACTIVE BOUNTIES
          </h1>
          <p className="text-sm font-medium text-gray-700 mt-2 max-w-xl">
            Browse all tasks escrowed on Monad Testnet. Submit solution links and earn MON rewards.
          </p>
        </div>

        <Link
          href="/create"
          className="btn-press self-start md:self-auto px-6 py-3.5 bg-[#1040C0] text-white border-2 border-[#121212] shadow-bauhaus font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#0c329b]"
        >
          <Plus className="w-4 h-4" />
          CREATE BOUNTY
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border-bauhaus shadow-bauhaus p-4 mb-8 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or description..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F0F0F0] border-2 border-[#121212] text-xs font-bold text-[#121212] placeholder-gray-500 focus:outline-none"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="md:col-span-3 flex items-center border-2 border-[#121212] divide-x-2 divide-[#121212]">
          {(["ALL", "OPEN", "COMPLETED"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`flex-1 py-2.5 text-[11px] font-black uppercase tracking-wider transition-colors ${
                statusFilter === filter
                  ? "bg-[#1040C0] text-white"
                  : "bg-white text-[#121212] hover:bg-[#F0C020]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <div className="md:col-span-3 relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full py-2.5 px-3 bg-white border-2 border-[#121212] text-xs font-black uppercase tracking-wider text-[#121212] appearance-none cursor-pointer focus:outline-none"
          >
            <option value="NEWEST">SORT: NEWEST</option>
            <option value="REWARD_HIGH">SORT: REWARD (HIGH-LOW)</option>
            <option value="REWARD_LOW">SORT: REWARD (LOW-HIGH)</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600" />
        </div>
      </div>

      {/* State 1: Contract address not yet set */}
      {isContractUnset && (
        <div className="p-8 bg-[#F0C020] border-3 border-[#121212] shadow-bauhaus-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-[#D02020] flex-shrink-0" />
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider">
                AWAITING CONTRACT DEPLOYMENT
              </h3>
              <p className="text-xs font-medium text-gray-800">
                Deploy BountyBoard to Monad Testnet and set NEXT_PUBLIC_CONTRACT_ADDRESS to load live on-chain bounties.
              </p>
            </div>
          </div>
          <Link
            href="/create"
            className="px-4 py-2 bg-[#121212] text-white font-black text-xs uppercase tracking-wider hover:bg-[#1040C0]"
          >
            CREATE TEMPLATE BOUNTY
          </Link>
        </div>
      )}

      {/* State 2: Loading State */}
      {isLoading && (
        <div className="py-24 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-white border-2 border-[#121212] shadow-bauhaus font-black text-xs uppercase tracking-widest">
            <RefreshCw className="w-4 h-4 animate-spin text-[#1040C0]" />
            LOADING ON-CHAIN BOUNTIES FROM MONAD TESTNET...
          </div>
        </div>
      )}

      {/* State 3: Error State */}
      {isError && (
        <div className="p-6 bg-[#D02020] text-white border-3 border-[#121212] shadow-bauhaus-md flex items-center justify-between">
          <div>
            <h3 className="font-black text-sm uppercase tracking-wider text-[#F0C020] mb-1">
              FAILED TO FETCH BOUNTIES FROM RPC
            </h3>
            <p className="text-xs font-mono">{error?.message || "RPC connection issue"}</p>
          </div>
          <button
            onClick={() => refetch()}
            className="btn-press px-4 py-2 bg-white text-[#121212] border-2 border-[#121212] shadow-bauhaus-sm font-black text-xs uppercase"
          >
            RETRY
          </button>
        </div>
      )}

      {/* State 4: Empty State */}
      {!isLoading && !isError && filteredBounties.length === 0 && (
        <div className="p-16 bg-white border-bauhaus shadow-bauhaus text-center flex flex-col items-center justify-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#1040C0] text-white border-2 border-[#121212] shadow-bauhaus-sm flex items-center justify-center mb-4 text-2xl font-black">
            !
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight mb-2">
            NO BOUNTIES FOUND
          </h3>
          <p className="text-xs text-gray-600 font-medium max-w-sm mb-6 leading-relaxed">
            {searchTerm || statusFilter !== "ALL"
              ? "No bounties match your current search criteria. Try adjusting your filters."
              : "There are currently no on-chain bounties registered. Be the first to create one on the Monad Testnet!"}
          </p>
          <Link
            href="/create"
            className="btn-press px-6 py-3 bg-[#F0C020] text-[#121212] border-2 border-[#121212] shadow-bauhaus font-black text-xs uppercase tracking-widest hover:bg-yellow-400"
          >
            CREATE THE FIRST BOUNTY
          </Link>
        </div>
      )}

      {/* State 5: Grid of Bounties */}
      {!isLoading && !isError && filteredBounties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBounties.map((bounty) => (
            <BountyCard key={bounty.id.toString()} bounty={bounty} />
          ))}
        </div>
      )}
    </div>
  );
}
