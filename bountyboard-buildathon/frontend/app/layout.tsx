import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "BountyBoard — On-Chain Monad Bounty Marketplace",
  description:
    "A constructivist on-chain bounty marketplace for the Monad Testnet. Create bounties, submit verified solutions, and earn instant MON payouts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F0F0F0] text-[#121212] selection:bg-[#F0C020] selection:text-[#121212]">
        <Providers>
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
