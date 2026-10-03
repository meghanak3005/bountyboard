import Link from "next/link";
import { StatusBadge } from "./StatusBadge";
import { formatMon, shortenAddress, formatTimestamp } from "@/lib/utils";
import { ArrowRight, User, Layers, Calendar } from "lucide-react";

export interface BountyCardData {
  id: bigint | number;
  creator: string;
  title: string;
  description: string;
  reward: bigint;
  createdAt: bigint | number;
  status: number;
  winner: string;
  submissionCount: bigint | number;
}

interface BountyCardProps {
  bounty: BountyCardData;
}

export function BountyCard({ bounty }: BountyCardProps) {
  const idStr = bounty.id.toString();
  const submissions = Number(bounty.submissionCount);

  return (
    <div className="group bg-white border-bauhaus shadow-bauhaus-md hover:-translate-x-1 hover:-translate-y-1 hover:shadow-bauhaus-lg transition-all flex flex-col justify-between p-6">
      <div>
        {/* Header: ID, Status, and Reward */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-[#121212] text-white font-mono text-xs font-black">
              #{idStr}
            </span>
            <StatusBadge status={bounty.status} />
          </div>

          <div className="px-3.5 py-1.5 bg-[#F0C020] border-2 border-[#121212] shadow-bauhaus-sm text-right">
            <span className="text-[10px] font-black uppercase tracking-wider block text-[#121212] leading-none mb-0.5">
              REWARD
            </span>
            <span className="text-lg font-black text-[#121212] leading-none">
              {formatMon(bounty.reward)} <span className="text-xs">MON</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-[#121212] uppercase tracking-tight mb-2 line-clamp-2 group-hover:text-[#1040C0] transition-colors">
          {bounty.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-700 font-medium line-clamp-3 mb-6 leading-relaxed">
          {bounty.description}
        </p>
      </div>

      <div>
        {/* Metadata info */}
        <div className="grid grid-cols-2 gap-2 pt-4 border-t-2 border-[#121212] text-xs font-bold text-[#121212] mb-5">
          <div className="flex items-center gap-1.5 text-gray-600">
            <User className="w-3.5 h-3.5 text-[#1040C0]" />
            <span className="font-mono">{shortenAddress(bounty.creator)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-600 justify-end">
            <Layers className="w-3.5 h-3.5 text-[#D02020]" />
            <span>{submissions} {submissions === 1 ? "Solution" : "Solutions"}</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-500 col-span-2 text-[11px]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Created {formatTimestamp(bounty.createdAt)}</span>
          </div>
        </div>

        {/* Action Link */}
        <Link
          href={`/bounties/${idStr}`}
          className="btn-press w-full py-2.5 bg-[#121212] text-white hover:bg-[#1040C0] border-2 border-[#121212] shadow-bauhaus-sm font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
        >
          VIEW BOUNTY DETAILS
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
