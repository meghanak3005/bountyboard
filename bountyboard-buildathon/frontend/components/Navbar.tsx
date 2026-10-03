"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BauhausLogo } from "./BauhausLogo";
import { WalletButton } from "./WalletButton";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/bounties", label: "EXPLORE BOUNTIES" },
    { href: "/create", label: "CREATE BOUNTY" },
    { href: "/how-it-works", label: "HOW IT WORKS" },
    { href: "/about", label: "ABOUT" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F0F0F0] border-b-4 border-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <BauhausLogo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 transition-all ${
                  isActive
                    ? "bg-[#1040C0] text-white border-2 border-[#121212] shadow-bauhaus-sm"
                    : "text-[#121212] hover:bg-[#F0C020] border-2 border-transparent hover:border-[#121212] hover:shadow-bauhaus-sm"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Wallet Button & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <WalletButton />

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2.5 bg-white border-2 border-[#121212] shadow-bauhaus text-[#121212] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t-3 border-[#121212] p-4 flex flex-col gap-3 shadow-bauhaus-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`p-3 text-sm font-black uppercase tracking-wider border-2 border-[#121212] ${
                  isActive
                    ? "bg-[#1040C0] text-white shadow-bauhaus"
                    : "bg-[#F0F0F0] text-[#121212] hover:bg-[#F0C020]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
