"use client";

import { useState } from "react";
import { QrScanner } from "./qr-scanner";
import { ScanResult } from "./scan-result";

type Phase = "scan" | "result";

export default function ScanningPage() {
  const [phase, setPhase] = useState<Phase>("scan");
  const [result, setResult] = useState<string | null>(null);
  const [scannedAt, setScannedAt] = useState<Date | null>(null);
  const [scanKey, setScanKey] = useState(0);

  const handleScan = (decodedText: string) => {
    setResult(decodedText);
    setScannedAt(new Date());
    setPhase("result");
  };

  const handleScanAgain = () => {
    setResult(null);
    setScannedAt(null);
    setPhase("scan");
    setScanKey((k) => k + 1);
  };

  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-zinc-100 text-zinc-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-indigo-950/40 dark:text-zinc-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(99 102 241 / 0.15) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <header className="relative border-b border-indigo-100/80 bg-white/70 px-6 py-6 backdrop-blur-md dark:border-indigo-500/20 dark:bg-zinc-950/70">
        <div className="mx-auto flex w-full max-w-lg items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              Accelerate &apos;26
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              {phase === "scan" ? "Check-in scanner" : "Check-in complete"}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {phase === "scan"
                ? "Point your camera at the attendee QR code"
                : "Attendee verified — ready for entry"}
            </p>
          </div>
          <StepBadge step={phase === "scan" ? 1 : 2} />
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-lg flex-1 px-6 py-8">
        <div className="transition-opacity duration-300">
          {phase === "scan" ? (
            <QrScanner key={scanKey} onScan={handleScan} />
          ) : (
            result &&
            scannedAt && (
              <ScanResult
                value={result}
                scannedAt={scannedAt}
                onScanAgain={handleScanAgain}
              />
            )
          )}
        </div>
      </main>

      <footer className="relative px-6 pb-8 pt-2 text-center text-xs text-zinc-500">
        Secure on-site check-in · Camera used only while scanning
      </footer>
    </div>
  );
}

function StepBadge({ step }: { step: 1 | 2 }) {
  return (
    <div
      className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 dark:bg-indigo-500 dark:shadow-indigo-500/20"
      aria-label={`Step ${step} of 2`}
    >
      <span className="text-[10px] font-medium uppercase opacity-80">Step</span>
      <span className="text-lg font-bold leading-none">{step}</span>
    </div>
  );
}
