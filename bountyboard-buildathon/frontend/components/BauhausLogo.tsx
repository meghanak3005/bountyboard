import Link from "next/link";

interface BauhausLogoProps {
  size?: "sm" | "md" | "lg";
}

export function BauhausLogo({ size = "md" }: BauhausLogoProps) {
  const dims = {
    sm: { shape: 16, text: "text-lg" },
    md: { shape: 22, text: "text-2xl" },
    lg: { shape: 32, text: "text-4xl" },
  }[size];

  return (
    <Link href="/" className="inline-flex items-center gap-3 group focus:outline-none">
      {/* Bauhaus Geometric Composition: Circle (Red), Square (Blue), Triangle (Yellow) */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {/* Red Circle */}
        <div
          style={{ width: `${dims.shape}px`, height: `${dims.shape}px` }}
          className="rounded-full bg-[#D02020] border-2 border-[#121212] shadow-[2px_2px_0px_#121212] group-hover:-translate-y-0.5 transition-transform"
        />
        {/* Blue Square */}
        <div
          style={{ width: `${dims.shape}px`, height: `${dims.shape}px` }}
          className="rounded-none bg-[#1040C0] border-2 border-[#121212] shadow-[2px_2px_0px_#121212] group-hover:-translate-y-0.5 transition-transform delay-75"
        />
        {/* Yellow Triangle */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${dims.shape / 2}px solid transparent`,
            borderRight: `${dims.shape / 2}px solid transparent`,
            borderBottom: `${dims.shape}px solid #F0C020`,
            filter: "drop-shadow(2px 2px 0px #121212)",
          }}
          className="group-hover:-translate-y-0.5 transition-transform delay-150"
        />
      </div>

      <div className="flex flex-col">
        <span className={`font-black tracking-widest text-[#121212] ${dims.text} leading-none uppercase`}>
          BOUNTY<span className="text-[#1040C0]">BOARD</span>
        </span>
        <span className="text-[9px] font-bold tracking-[0.25em] text-[#D02020] uppercase leading-none mt-0.5">
          MONAD TESTNET
        </span>
      </div>
    </Link>
  );
}
