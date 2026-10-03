import { formatEther, parseEther } from "viem";

export function shortenAddress(address?: string): string {
  if (!address) return "";
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatMon(wei?: bigint | string | number): string {
  if (wei === undefined || wei === null) return "0";
  try {
    const valueInEther = typeof wei === "bigint" ? formatEther(wei) : formatEther(BigInt(wei));
    const num = parseFloat(valueInEther);
    if (isNaN(num)) return "0";
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    });
  } catch {
    return "0";
  }
}

export function parseMonSafe(monStr: string): bigint | null {
  try {
    const trimmed = monStr.trim();
    if (!trimmed || isNaN(Number(trimmed)) || Number(trimmed) <= 0) return null;
    return parseEther(trimmed);
  } catch {
    return null;
  }
}

export function formatTimestamp(timestamp?: bigint | number): string {
  if (!timestamp) return "Unknown";
  try {
    const timeMs = Number(timestamp) * 1000;
    return new Date(timeMs).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Unknown";
  }
}

export type BountyStatusType = "Open" | "Completed" | "Cancelled";

export function getStatusText(statusCode?: number): BountyStatusType {
  switch (statusCode) {
    case 0:
      return "Open";
    case 1:
      return "Completed";
    case 2:
      return "Cancelled";
    default:
      return "Open";
  }
}
