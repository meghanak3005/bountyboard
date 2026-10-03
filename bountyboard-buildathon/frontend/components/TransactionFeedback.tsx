import { ExternalLink, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface TransactionFeedbackProps {
  isPending?: boolean;
  isConfirming?: boolean;
  isSuccess?: boolean;
  hash?: `0x${string}` | string;
  error?: Error | null;
  successTitle?: string;
  successMessage?: string;
}

export function TransactionFeedback({
  isPending,
  isConfirming,
  isSuccess,
  hash,
  error,
  successTitle = "Transaction Confirmed!",
  successMessage = "Your action has been recorded on the Monad Testnet.",
}: TransactionFeedbackProps) {
  if (isPending) {
    return (
      <div className="p-4 bg-[#F0C020] border-2 border-[#121212] shadow-bauhaus flex items-center gap-3 text-[#121212]">
        <Loader2 className="w-5 h-5 animate-spin" />
        <div className="text-xs font-black uppercase tracking-wider">
          PLEASE CONFIRM IN YOUR WALLET...
        </div>
      </div>
    );
  }

  if (isConfirming) {
    return (
      <div className="p-4 bg-[#1040C0] text-white border-2 border-[#121212] shadow-bauhaus flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
          <Loader2 className="w-5 h-5 animate-spin text-[#F0C020]" />
          AWAITING MONAD TESTNET BLOCK CONFIRMATION...
        </div>
        {hash && (
          <a
            href={`https://testnet.monadscan.com/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] underline text-[#F0C020] hover:text-white flex items-center gap-1 font-mono"
          >
            Track on MonadScan <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="p-5 bg-white border-3 border-[#121212] shadow-bauhaus-md flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[#1040C0] font-black text-sm uppercase tracking-wider">
          <CheckCircle2 className="w-5 h-5 text-[#D02020]" />
          {successTitle}
        </div>
        <p className="text-xs font-medium text-gray-700">{successMessage}</p>
        {hash && (
          <div className="mt-2 pt-2 border-t-2 border-[#121212] flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-gray-600 truncate max-w-xs">
              Tx: {hash}
            </span>
            <a
              href={`https://testnet.monadscan.com/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-black uppercase tracking-wider bg-[#F0C020] px-3 py-1 border-2 border-[#121212] shadow-bauhaus-sm hover:bg-yellow-400 flex items-center gap-1"
            >
              MonadScan <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    let cleanMessage = error.message;
    if (cleanMessage.includes("User rejected") || cleanMessage.includes("user rejected")) {
      cleanMessage = "Transaction request was cancelled by the user.";
    } else if (cleanMessage.includes("insufficient funds")) {
      cleanMessage = "Insufficient MON balance to pay for transaction and gas fees.";
    } else if (cleanMessage.includes("reverted")) {
      cleanMessage = cleanMessage.split("\n")[0];
    }

    return (
      <div className="p-4 bg-[#D02020] text-white border-2 border-[#121212] shadow-bauhaus flex items-start gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#F0C020]" />
        <div className="flex flex-col gap-1">
          <span className="text-xs font-black uppercase tracking-wider text-[#F0C020]">
            TRANSACTION FAILED
          </span>
          <p className="text-xs font-medium leading-relaxed break-words">{cleanMessage}</p>
        </div>
      </div>
    );
  }

  return null;
}
