import Link from "next/link";
import { ExternalLink, Layers, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
      {/* Header */}
      <div className="border-b-4 border-[#121212] pb-8 mb-12">
        <span className="text-xs font-black uppercase tracking-[0.25em] text-[#D02020] block mb-2">
          PHILOSOPHY & SPECIFICATION
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-[#121212] uppercase tracking-tight">
          ABOUT BOUNTYBOARD
        </h1>
        <p className="text-base text-gray-700 font-medium mt-3 max-w-2xl">
          Constructivist design meets high-throughput decentralized execution. Form follows function.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
        {/* Left: Design Manifesto */}
        <div className="md:col-span-7 bg-white border-bauhaus shadow-bauhaus-md p-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#1040C0]" />
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#121212]">
              THE BAUHAUS MANIFESTO
            </h2>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed font-medium mb-4">
            Founded in Weimar in 1919 by Walter Gropius, the Bauhaus movement championed a bold
            synthesis of art, craft, and technology. Every design element must serve a purpose:
          </p>
          <ul className="text-xs text-gray-700 space-y-3 font-medium">
            <li className="p-3 bg-[#F0F0F0] border-2 border-[#121212]">
              <span className="font-black text-[#D02020] uppercase block">
                Primary Colors Only
              </span>
              Canvas off-white (#F0F0F0), Bauhaus red (#D02020), Bauhaus blue (#1040C0), and Bauhaus
              yellow (#F0C020). No arbitrary gradients or decorative blurs.
            </li>
            <li className="p-3 bg-[#F0F0F0] border-2 border-[#121212]">
              <span className="font-black text-[#1040C0] uppercase block">
                Pure Geometry
              </span>
              Circles, squares, and triangles. Sharp 90-degree corners or full roundness—no ambiguous
              in-between radii.
            </li>
            <li className="p-3 bg-[#F0F0F0] border-2 border-[#121212]">
              <span className="font-black text-[#121212] uppercase block">
                Physical Tactility
              </span>
              Hard offset shadows (3px–8px) and responsive button press feedback that brings tangible
              mechanics to Web3 interactions.
            </li>
          </ul>
        </div>

        {/* Right: Technical Spec Card */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="bg-[#121212] text-white border-bauhaus shadow-bauhaus-md p-8">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-[#F0C020]" />
              <h3 className="text-xl font-black uppercase tracking-tight text-[#F0C020]">
                MONAD ARCHITECTURE
              </h3>
            </div>
            <div className="space-y-4 font-mono text-xs">
              <div>
                <span className="text-gray-400 block font-sans font-bold text-[10px] uppercase">
                  NETWORK
                </span>
                <span className="font-bold text-white">Monad Testnet</span>
              </div>
              <div>
                <span className="text-gray-400 block font-sans font-bold text-[10px] uppercase">
                  CHAIN ID
                </span>
                <span className="font-bold text-[#F0C020]">10143</span>
              </div>
              <div>
                <span className="text-gray-400 block font-sans font-bold text-[10px] uppercase">
                  NATIVE CURRENCY
                </span>
                <span className="font-bold text-white">MON (18 Decimals)</span>
              </div>
              <div>
                <span className="text-gray-400 block font-sans font-bold text-[10px] uppercase">
                  CONTRACT LANGUAGE
                </span>
                <span className="font-bold text-[#1040C0]">Solidity 0.8.28</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <a
                href="https://testnet.monadscan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press w-full py-2.5 bg-[#F0C020] text-[#121212] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-yellow-400"
              >
                EXPLORE ON MONADSCAN <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
