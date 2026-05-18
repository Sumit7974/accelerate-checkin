"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { QrScanner } from "./qr-scanner";
import ScanResult from "./scan-result";
import type { AttendanceScanResult, AttendanceStatus } from "./types";

type ScanHistoryItem = {
  id: string;
  name: string;
  status: AttendanceStatus;
  message: string;
  scannedAt: string;
};

const MAX_HISTORY_ITEMS = 8;
const AUTO_CLEAR_INVALID_MS = 4500;

const historyStatusStyles: Record<AttendanceStatus, string> = {
  CHECK_IN: "bg-emerald-500/15 text-emerald-200 ring-emerald-400/25",
  CHECK_OUT: "bg-red-500/15 text-red-200 ring-red-400/25",
  INVALID_QR: "bg-yellow-500/15 text-yellow-100 ring-yellow-400/25",
  ALREADY_CHECKED_OUT: "bg-sky-500/15 text-sky-200 ring-sky-400/25",
};

const historyStatusLabels: Record<AttendanceStatus, string> = {
  CHECK_IN: "CHECKED IN",
  CHECK_OUT: "CHECKED OUT",
  INVALID_QR: "INVALID QR",
  ALREADY_CHECKED_OUT: "ALREADY SCANNED",
};

export default function ScanningPage() {
  const isVerifyingRef = useRef(false);
  const invalidClearTimerRef = useRef<number | null>(null);
  const [scanResult, setScanResult] = useState<AttendanceScanResult | null>(
    null
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const playScanSound = useScanSound();

  const clearInvalidTimer = useCallback(() => {
    if (invalidClearTimerRef.current) {
      window.clearTimeout(invalidClearTimerRef.current);
      invalidClearTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearInvalidTimer();
    };
  }, [clearInvalidTimer]);

  const addHistoryItem = useCallback((result: AttendanceScanResult) => {
    const item: ScanHistoryItem = {
      id: `${result.scannedAt}-${result.status}-${crypto.randomUUID()}`,
      name: result.participant?.name ?? "Unknown QR",
      status: result.status,
      message: result.message,
      scannedAt: result.scannedAt,
    };

    setScanHistory((items) => [item, ...items].slice(0, MAX_HISTORY_ITEMS));
  }, []);

  const handleScan = async (decodedText: string) => {
    if (isVerifyingRef.current) {
      return;
    }

    clearInvalidTimer();
    isVerifyingRef.current = true;
    setIsVerifying(true);
    setRequestError(null);

    try {
      const response = await fetch("/api/attendance/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qrToken: decodedText }),
      });

      const payload = (await response.json()) as
        | AttendanceScanResult
        | { error?: string };

      if ("error" in payload) {
        throw new Error(payload.error ?? "Could not verify QR code");
      }

      const result = payload as AttendanceScanResult;

      setScanResult(result);
      addHistoryItem(result);
      playScanSound(result.status === "INVALID_QR" ? "invalid" : "success");

      if (result.status === "INVALID_QR") {
        invalidClearTimerRef.current = window.setTimeout(() => {
          setScanResult((current) =>
            current?.status === "INVALID_QR" ? null : current
          );
          invalidClearTimerRef.current = null;
        }, AUTO_CLEAR_INVALID_MS);
      }
    } catch (err) {
      const fallbackResult = createClientErrorResult(
        err instanceof Error ? err.message : "Invalid QR Code"
      );

      setScanResult(fallbackResult);
      setRequestError(fallbackResult.message);
      addHistoryItem(fallbackResult);
      playScanSound("invalid");
      invalidClearTimerRef.current = window.setTimeout(() => {
        setScanResult((current) =>
          current?.status === "INVALID_QR" ? null : current
        );
        setRequestError(null);
        invalidClearTimerRef.current = null;
      }, AUTO_CLEAR_INVALID_MS);
    } finally {
      isVerifyingRef.current = false;
      setIsVerifying(false);
    }
  };

  const clearResult = () => {
    clearInvalidTimer();
    setScanResult(null);
    setRequestError(null);
  };

  const showInvalidCard = scanResult?.status === "INVALID_QR" || requestError;
  const showDetailsPanel = scanResult && scanResult.status !== "INVALID_QR";

  return (
    <div className="relative min-h-full overflow-hidden bg-[#070a12] text-zinc-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(129 140 248 / 0.22) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-indigo-600/20 via-sky-500/10 to-transparent" />

      <header className="relative border-b border-white/10 bg-white/[0.04] px-4 py-5 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
              Accelerate &apos;26
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Event attendance command desk
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
              Live QR check-in, duplicate protection, attendee verification,
              and recent scan monitoring in one operator view.
            </p>
          </div>
          <LiveBadge active={!isVerifying} />
        </div>
      </header>

      <main className="relative mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-6">
          <QrScanner isVerifying={isVerifying} onScan={handleScan} />

          {isVerifying && <VerificationPanel />}

          {showInvalidCard && (
            <InvalidQrCard
              message={requestError ?? scanResult?.message ?? "Invalid QR Code"}
              onClear={clearResult}
            />
          )}

          {showDetailsPanel && (
            <ScanResult result={scanResult} onClear={clearResult} />
          )}
        </div>

        <RecentScanHistory items={scanHistory} />
      </main>

      <footer className="relative px-6 pb-8 pt-2 text-center text-xs text-zinc-500">
        Secure on-site check-in - Camera used only while scanning
      </footer>
    </div>
  );
}

function useScanSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSoundRef = useRef<{
    oscillator: OscillatorNode;
    gain: GainNode;
  } | null>(null);

  useEffect(() => {
    return () => {
      activeSoundRef.current?.oscillator.stop();
      audioContextRef.current?.close();
    };
  }, []);

  return useCallback((type: "success" | "invalid") => {
    if (typeof window === "undefined") return;

    const AudioContextCtor =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextCtor) return;

    const context =
      audioContextRef.current ?? new AudioContextCtor({ latencyHint: "interactive" });
    audioContextRef.current = context;

    if (context.state === "suspended") {
      void context.resume();
    }

    activeSoundRef.current?.oscillator.stop();
    activeSoundRef.current?.gain.disconnect();

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = type === "success" ? "sine" : "square";
    oscillator.frequency.setValueAtTime(type === "success" ? 880 : 220, now);
    oscillator.frequency.exponentialRampToValueAtTime(
      type === "success" ? 1320 : 140,
      now + 0.12
    );
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(type === "success" ? 0.18 : 0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.2);

    activeSoundRef.current = { oscillator, gain };
    oscillator.onended = () => {
      gain.disconnect();
      if (activeSoundRef.current?.oscillator === oscillator) {
        activeSoundRef.current = null;
      }
    };
  }, []);
}

function createClientErrorResult(message: string): AttendanceScanResult {
  return {
    ok: false,
    message: message === "Invalid QR Code" ? "Invalid QR Code" : "Invalid QR Code",
    status: "INVALID_QR",
    scannedAt: new Date().toISOString(),
    dayNumber: new Date().getDate(),
    participant: null,
  };
}

function VerificationPanel() {
  return (
    <section className="rounded-3xl border border-indigo-400/20 bg-white/[0.07] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-300/20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-t-transparent" />
        </div>
        <div>
          <p className="text-base font-semibold text-white">
            Verifying participant...
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            Checking QR token, attendance status, and registration record.
          </p>
        </div>
      </div>
    </section>
  );
}

function InvalidQrCard({
  message,
  onClear,
}: {
  message: string;
  onClear: () => void;
}) {
  return (
    <section className="animate-[shake_420ms_ease-in-out] rounded-3xl border border-red-400/30 bg-red-500/10 p-5 text-red-50 shadow-2xl shadow-red-950/30 backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500 text-white shadow-lg shadow-red-500/25">
            <ErrorIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold">Invalid QR Code</p>
            <p className="mt-1 text-sm text-red-100/80">{message}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-2xl border border-red-300/30 px-4 py-2 text-sm font-semibold text-red-50 transition hover:bg-red-400/10 focus:outline-none focus:ring-4 focus:ring-red-400/20"
        >
          Dismiss
        </button>
      </div>
    </section>
  );
}

function RecentScanHistory({ items }: { items: ScanHistoryItem[] }) {
  return (
    <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl lg:sticky lg:top-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white">Recent scans</h2>
          <p className="mt-1 text-xs text-zinc-400">Latest {MAX_HISTORY_ITEMS} desk events</p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-zinc-300 ring-1 ring-white/10">
          {items.length}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 px-4 py-8 text-center text-sm text-zinc-500">
            Scans will appear here instantly.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="animate-[slideIn_260ms_ease-out] rounded-2xl border border-white/10 bg-zinc-950/50 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300/30 hover:bg-white/[0.08]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {formatTime(item.scannedAt)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ${historyStatusStyles[item.status]}`}
                >
                  {historyStatusLabels[item.status]}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

function LiveBadge({ active }: { active: boolean }) {
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-white shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-300/25"
      aria-label={active ? "Scanner live" : "Scanner verifying"}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full bg-emerald-300 ${
          active ? "animate-pulse shadow-[0_0_0_7px_rgb(110_231_183_/_0.14)]" : ""
        }`}
      />
    </div>
  );
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 8v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 17h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
