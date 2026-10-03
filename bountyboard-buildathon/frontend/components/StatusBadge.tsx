import { BountyStatusType, getStatusText } from "@/lib/utils";

interface StatusBadgeProps {
  status: BountyStatusType | number;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const text = typeof status === "number" ? getStatusText(status) : status;

  if (text === "Open") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1040C0] text-white border-2 border-[#121212] shadow-bauhaus-sm font-black text-[11px] uppercase tracking-widest">
        <span className="w-2 h-2 rounded-full bg-[#F0C020] animate-pulse" />
        OPEN
      </span>
    );
  }

  if (text === "Completed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0C020] text-[#121212] border-2 border-[#121212] shadow-bauhaus-sm font-black text-[11px] uppercase tracking-widest">
        <span className="w-2 h-2 bg-[#D02020]" />
        COMPLETED
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E0E0E0] text-[#121212] border-2 border-[#121212] shadow-bauhaus-sm font-black text-[11px] uppercase tracking-widest">
      CANCELLED
    </span>
  );
}
