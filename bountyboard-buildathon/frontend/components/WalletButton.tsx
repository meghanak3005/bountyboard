"use client";

import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from "wagmi";
import { useSyncExternalStore, useState } from "react";
import { monadTestnet } from "@/lib/config";
import { shortenAddress, formatMon } from "@/lib/utils";
import { Wallet, LogOut, AlertTriangle, ChevronDown } from "lucide-react";

const emptySubscribe = () => () => {};

export function WalletButton() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { data: balanceData } = useBalance({ address });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!mounted) {
    return (
      <div className="h-11 px-5 bg-white border-2 border-[#121212] shadow-bauhaus-sm font-bold text-xs uppercase flex items-center gap-2">
        <Wallet className="w-4 h-4" />
        CONNECT WALLET
      </div>
    );
  }

  // Case 1: Connected but Wrong Network
  if (isConnected && chainId !== monadTestnet.id) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => switchChain({ chainId: monadTestnet.id })}
          className="btn-press px-4 py-2 bg-[#D02020] text-white border-2 border-[#121212] shadow-bauhaus font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#b01818]"
        >
          <AlertTriangle className="w-4 h-4 animate-bounce text-[#F0C020]" />
          SWITCH TO MONAD
        </button>
        <button
          onClick={() => disconnect()}
          title="Disconnect"
          className="btn-press p-2 bg-white text-[#121212] border-2 border-[#121212] shadow-bauhaus hover:bg-[#E0E0E0]"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Case 2: Connected on Monad Testnet
  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {/* Network indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F0C020] border-2 border-[#121212] shadow-bauhaus-sm text-[11px] font-black uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#1040C0]" />
          MONAD
        </div>

        {/* Address and Balance Pill */}
        <div className="flex items-center border-2 border-[#121212] shadow-bauhaus bg-white text-xs font-bold divide-x-2 divide-[#121212]">
          <div className="px-3 py-2 bg-[#F0F0F0] text-[#121212] font-mono">
            {balanceData ? `${formatMon(balanceData.value)} MON` : "..."}
          </div>
          <div className="px-3 py-2 font-mono text-[#1040C0]">
            {shortenAddress(address)}
          </div>
        </div>

        {/* Disconnect button */}
        <button
          onClick={() => disconnect()}
          title="Disconnect wallet"
          className="btn-press p-2 bg-[#D02020] text-white border-2 border-[#121212] shadow-bauhaus hover:bg-[#b01818]"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Case 3: Disconnected
  return (
    <div className="relative">
      <button
        onClick={() => {
          // If only 1 connector or metaMask is primary, connect directly
          const preferred = connectors.find((c) => c.id === "metaMask") || connectors[0];
          if (connectors.length <= 1 && preferred) {
            connect({ connector: preferred });
          } else {
            setDropdownOpen(!dropdownOpen);
          }
        }}
        disabled={isPending}
        className="btn-press px-5 py-2.5 bg-[#1040C0] text-white border-2 border-[#121212] shadow-bauhaus font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#0c329b] disabled:opacity-50"
      >
        <Wallet className="w-4 h-4" />
        {isPending ? "CONNECTING..." : "CONNECT WALLET"}
        {connectors.length > 1 && <ChevronDown className="w-3.5 h-3.5 ml-1" />}
      </button>

      {dropdownOpen && connectors.length > 1 && (
        <div className="absolute right-0 mt-2 w-52 bg-white border-3 border-[#121212] shadow-bauhaus-md z-50 p-2 flex flex-col gap-1.5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-2 py-1">
            SELECT WALLET
          </p>
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => {
                connect({ connector });
                setDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-2 font-bold text-xs uppercase tracking-wider border-2 border-[#121212] bg-[#F0F0F0] hover:bg-[#F0C020] transition-colors"
            >
              {connector.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
