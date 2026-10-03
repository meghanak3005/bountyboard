import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#121212] text-white border-t-4 border-[#121212] mt-auto">
      {/* Decorative Bauhaus stripe */}
      <div className="grid grid-cols-3 h-2 w-full">
        <div className="bg-[#D02020]" />
        <div className="bg-[#1040C0]" />
        <div className="bg-[#F0C020]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Philosophy */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#D02020] border border-white" />
              <div className="w-5 h-5 bg-[#1040C0] border border-white" />
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderBottom: "20px solid #F0C020",
                }}
              />
              <span className="text-xl font-black uppercase tracking-widest text-white">
                BOUNTYBOARD
              </span>
            </div>
            <p className="text-sm text-gray-300 max-w-md font-medium leading-relaxed">
              Constructivist Web3 bounty marketplace engineered for the Monad Testnet.
              Transparent escrows, verifiable solution submissions, and instant on-chain payouts.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-1 bg-[#1040C0] text-[10px] font-black uppercase tracking-widest text-white border border-white">
                CHAIN ID: 10143
              </span>
              <span className="px-2.5 py-1 bg-[#F0C020] text-[10px] font-black uppercase tracking-widest text-[#121212] border border-white">
                MONAD TESTNET
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#F0C020] border-b-2 border-white/20 pb-2">
              MARKETPLACE
            </h4>
            <Link href="/bounties" className="text-sm hover:text-[#F0C020] font-medium transition-colors">
              Explore Bounties
            </Link>
            <Link href="/create" className="text-sm hover:text-[#F0C020] font-medium transition-colors">
              Create a Bounty
            </Link>
            <Link href="/how-it-works" className="text-sm hover:text-[#F0C020] font-medium transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="text-sm hover:text-[#F0C020] font-medium transition-colors">
              About & Philosophy
            </Link>
          </div>

          {/* Col 3: Resources & Network */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#D02020] border-b-2 border-white/20 pb-2">
              NETWORK & CODE
            </h4>
            <a
              href="https://testnet.monadscan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-[#F0C020] font-medium transition-colors flex items-center gap-1.5"
            >
              MonadScan Explorer <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://rpc.testnet.monad.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-[#F0C020] font-medium transition-colors flex items-center gap-1.5"
            >
              Monad Testnet RPC <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://docs.monad.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-[#F0C020] font-medium transition-colors flex items-center gap-1.5"
            >
              Monad Documentation <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} BountyBoard — Form Follows Function.</p>
          <p className="font-mono">Monad Testnet Native • Solidity 0.8.28</p>
        </div>
      </div>
    </footer>
  );
}
