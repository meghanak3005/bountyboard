"use client";

import Link from "next/link";
import { useReadContract } from "wagmi";
import { BOUNTY_BOARD_ADDRESS, BOUNTY_BOARD_ABI } from "@/lib/contracts/bountyBoard";
import { formatMon } from "@/lib/utils";
import { ArrowRight, ShieldCheck, Zap, Coins, CheckCircle, Code2, Globe } from "lucide-react";

export default function Home() {
  // Real contract read for statistics
  const { data: allBounties, isLoading: isStatsLoading } = useReadContract({
    address: BOUNTY_BOARD_ADDRESS,
    abi: BOUNTY_BOARD_ABI,
    functionName: "getAllBounties",
    query: {
      enabled: BOUNTY_BOARD_ADDRESS !== "0x0000000000000000000000000000000000000000",
    },
  });

  const bountiesList = Array.isArray(allBounties) ? allBounties : [];
  const totalCount = bountiesList.length;
  const openCount = bountiesList.filter((b) => Number(b.status) === 0).length;
  const completedCount = bountiesList.filter((b) => Number(b.status) === 1).length;
  const totalMonReward = bountiesList.reduce((acc, curr) => acc + (curr.reward || 0n), 0n);

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION: Off-white content panel + Bauhaus-blue visual panel */}
      <section className="border-b-4 border-[#121212] bg-[#F0F0F0]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center border-b-4 lg:border-b-0 lg:border-r-4 border-[#121212]">
            {/* Monad Testnet Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F0C020] border-2 border-[#121212] shadow-bauhaus-sm self-start mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1040C0]" />
              <span className="text-xs font-black uppercase tracking-widest text-[#121212]">
                MONAD TESTNET • CHAIN ID 10143
              </span>
            </div>

            {/* Giant Bauhaus Headline */}
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black text-[#121212] uppercase tracking-tight leading-[0.95] mb-6">
              BUILD.
              <br />
              <span className="text-[#1040C0]">SUBMIT.</span>
              <br />
              <span className="text-[#D02020]">EARN.</span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-gray-800 font-medium max-w-xl leading-relaxed mb-8">
              A constructivist Web3 bounty marketplace where creators lock MON in escrow,
              developers submit verifiable open-source solutions, and approved winners receive
              immediate on-chain payouts.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/bounties"
                className="btn-press px-8 py-4 bg-[#1040C0] text-white border-3 border-[#121212] shadow-bauhaus-md font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-[#0c329b]"
              >
                EXPLORE BOUNTIES
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/create"
                className="btn-press px-8 py-4 bg-[#F0C020] text-[#121212] border-3 border-[#121212] shadow-bauhaus-md font-black text-sm uppercase tracking-widest hover:bg-yellow-400"
              >
                CREATE A BOUNTY
              </Link>
            </div>
          </div>

          {/* Right Hero: Bauhaus Geometric Composition Visual Panel */}
          <div className="lg:col-span-5 bg-[#1040C0] p-8 sm:p-12 flex items-center justify-center relative overflow-hidden">
            {/* Geometric Art Composition */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Outer Rotated Square */}
              <div className="absolute inset-0 bg-[#F0C020] border-4 border-[#121212] shadow-bauhaus-lg rotate-12 transition-transform hover:rotate-6" />

              {/* Red Circle */}
              <div className="absolute w-56 h-56 rounded-full bg-[#D02020] border-4 border-[#121212] shadow-bauhaus -translate-x-6 -translate-y-4" />

              {/* Off-White Inner Square */}
              <div className="relative w-44 h-44 bg-[#F0F0F0] border-4 border-[#121212] shadow-bauhaus-md p-5 flex flex-col justify-between z-10 -rotate-6">
                <div className="flex items-center justify-between">
                  <div className="w-4 h-4 rounded-full bg-[#1040C0]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    BAUHAUS 1919
                  </span>
                </div>
                <div className="text-center font-black text-xs uppercase tracking-widest text-[#121212] border-y-2 border-[#121212] py-2">
                  FORM FOLLOWS FUNCTION
                </div>
                <div className="flex justify-between items-end">
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "8px solid transparent",
                      borderRight: "8px solid transparent",
                      borderBottom: "16px solid #D02020",
                    }}
                  />
                  <span className="font-mono text-[10px] font-bold">MONAD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATISTICS SECTION: Yellow section */}
      <section className="bg-[#F0C020] border-b-4 border-[#121212] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat 1 */}
            <div className="bg-white border-bauhaus shadow-bauhaus p-6">
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-500 block mb-1">
                TOTAL BOUNTIES
              </span>
              <span className="text-4xl font-black text-[#121212]">
                {isStatsLoading ? "..." : totalCount}
              </span>
            </div>

            {/* Stat 2 */}
            <div className="bg-white border-bauhaus shadow-bauhaus p-6">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#1040C0] block mb-1">
                OPEN CHALLENGES
              </span>
              <span className="text-4xl font-black text-[#1040C0]">
                {isStatsLoading ? "..." : openCount}
              </span>
            </div>

            {/* Stat 3 */}
            <div className="bg-white border-bauhaus shadow-bauhaus p-6">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#D02020] block mb-1">
                COMPLETED
              </span>
              <span className="text-4xl font-black text-[#D02020]">
                {isStatsLoading ? "..." : completedCount}
              </span>
            </div>

            {/* Stat 4 */}
            <div className="bg-white border-bauhaus shadow-bauhaus p-6">
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-500 block mb-1">
                TOTAL REWARDS
              </span>
              <span className="text-4xl font-black text-[#121212]">
                {isStatsLoading ? "..." : formatMon(totalMonReward)}{" "}
                <span className="text-base font-bold">MON</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS: 4-Step Bauhaus Process */}
      <section className="bg-[#F0F0F0] py-20 border-b-4 border-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#1040C0] block mb-2">
              LIFECYCLE
            </span>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#121212]">
              HOW BOUNTYBOARD WORKS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white border-bauhaus shadow-bauhaus p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-[#D02020] text-white border-2 border-[#121212] shadow-bauhaus-sm font-black text-lg flex items-center justify-center mb-6">
                  01
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight mb-2">
                  PUBLISH & ESCROW
                </h3>
                <p className="text-xs font-medium text-gray-700 leading-relaxed">
                  Creator specifies task requirements and deposits MON into the smart contract.
                  Funds are secured on Monad Testnet until completion.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border-bauhaus shadow-bauhaus p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-[#1040C0] text-white border-2 border-[#121212] shadow-bauhaus-sm font-black text-lg flex items-center justify-center mb-6">
                  02
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight mb-2">
                  BUILD & SUBMIT
                </h3>
                <p className="text-xs font-medium text-gray-700 leading-relaxed">
                  Developers build the solution and submit their pull request, repository, or live
                  demo URL directly to the on-chain registry.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border-bauhaus shadow-bauhaus p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-[#F0C020] text-[#121212] border-2 border-[#121212] shadow-bauhaus-sm font-black text-lg flex items-center justify-center mb-6">
                  03
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight mb-2">
                  REVIEW & APPROVE
                </h3>
                <p className="text-xs font-medium text-gray-700 leading-relaxed">
                  The bounty creator reviews candidate submissions and approves the winning developer
                  via a single on-chain transaction.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white border-bauhaus shadow-bauhaus p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-[#121212] text-white border-2 border-[#121212] shadow-bauhaus-sm font-black text-lg flex items-center justify-center mb-6">
                  04
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight mb-2">
                  INSTANT PAYOUT
                </h3>
                <p className="text-xs font-medium text-gray-700 leading-relaxed">
                  Upon approval, the smart contract automatically releases the escrowed MON directly to
                  the winning developer wallet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BENEFITS: Red section with white text and yellow accents */}
      <section className="bg-[#D02020] text-white py-20 border-b-4 border-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#F0C020] block mb-2">
              WHY ON-CHAIN
            </span>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">
              TRANSPARENT. VERIFIABLE. DECENTRALIZED.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-[#121212] border-3 border-white p-8 shadow-bauhaus-lg">
              <Coins className="w-10 h-10 text-[#F0C020] mb-4" />
              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-3">
                TRUSTLESS ESCROWS
              </h3>
              <p className="text-xs text-gray-300 font-medium leading-relaxed">
                Creators cannot falsely claim they have funds—rewards must be deposited upfront into
                the smart contract.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-[#121212] border-3 border-white p-8 shadow-bauhaus-lg">
              <Zap className="w-10 h-10 text-[#F0C020] mb-4" />
              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-3">
                MONAD SUB-SECOND SPEED
              </h3>
              <p className="text-xs text-gray-300 font-medium leading-relaxed">
                Experience near-instant finality and minimal gas fees on Monad Testnet for creation,
                submission, and payout.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-[#121212] border-3 border-white p-8 shadow-bauhaus-lg">
              <ShieldCheck className="w-10 h-10 text-[#F0C020] mb-4" />
              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-3">
                AUDITABLE LIFECYCLE
              </h3>
              <p className="text-xs text-gray-300 font-medium leading-relaxed">
                Every bounty, submission, and payout emits tamper-proof events indexed by block
                explorers like MonadScan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA: Yellow section with geometric decoration */}
      <section className="bg-[#F0C020] py-20 relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#1040C0] border-4 border-[#121212] opacity-30 pointer-events-none" />
        <div className="absolute left-10 top-6 w-24 h-24 bg-[#D02020] border-4 border-[#121212] rotate-45 opacity-30 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl sm:text-6xl font-black text-[#121212] uppercase tracking-tight mb-6">
            READY TO BUILD OR CREATE?
          </h2>
          <p className="text-base sm:text-lg text-gray-900 font-medium max-w-xl mx-auto mb-10 leading-relaxed">
            Jump in, browse active tasks on the Monad Testnet, or sponsor a new bounty today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/bounties"
              className="btn-press px-8 py-4 bg-[#1040C0] text-white border-3 border-[#121212] shadow-bauhaus-md font-black text-sm uppercase tracking-widest hover:bg-[#0c329b]"
            >
              BROWSE OPEN BOUNTIES
            </Link>
            <Link
              href="/create"
              className="btn-press px-8 py-4 bg-white text-[#121212] border-3 border-[#121212] shadow-bauhaus-md font-black text-sm uppercase tracking-widest hover:bg-[#E0E0E0]"
            >
              CREATE A BOUNTY NOW
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
