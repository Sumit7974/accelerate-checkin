"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";

const SCANNER_ELEMENT_ID = "qr-reader";
const COOLDOWN_MS = 3000;

type Props = {
  isVerifying?: boolean;
  onScan: (decodedText: string) => void | Promise<void>;
};

export function QrScanner({ isVerifying = false, onScan }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const onScanRef = useRef(onScan);
  const isVerifyingRef = useRef(isVerifying);
  const cooldownTimerRef = useRef<number | null>(null);
  const lastScannedRef = useRef<string | null>(null);
  const isCoolingDownRef = useRef(false);
  const isMountedRef = useRef(false);

  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    isVerifyingRef.current = isVerifying;
  }, [isVerifying]);

  const clearCooldown = useCallback(() => {
    if (cooldownTimerRef.current) {
      window.clearTimeout(cooldownTimerRef.current);
      cooldownTimerRef.current = null;
    }
  }, []);

  const resumeScanner = useCallback(() => {
    const scanner = scannerRef.current;
    if (!scanner) return;

    try {
      if (scanner.getState() === Html5QrcodeScannerState.PAUSED) {
        scanner.resume();
      }
    } catch (err) {
      if (isMountedRef.current) {
        const message =
          err instanceof Error ? err.message : "Could not resume scanner";
        setError(message);
      }
    } finally {
      isCoolingDownRef.current = false;
      if (isMountedRef.current) {
        setIsCoolingDown(false);
      }
    }
  }, []);

  const startCooldown = useCallback(() => {
    const scanner = scannerRef.current;
    if (!scanner) return;

    isCoolingDownRef.current = true;
    setIsCoolingDown(true);

    try {
      if (scanner.getState() === Html5QrcodeScannerState.SCANNING) {
        scanner.pause(false);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not pause scanner";
      setError(message);
    }

    clearCooldown();
    cooldownTimerRef.current = window.setTimeout(() => {
      cooldownTimerRef.current = null;
      resumeScanner();
    }, COOLDOWN_MS);
  }, [clearCooldown, resumeScanner]);

  const handleScanSuccess = useCallback(
    (decodedText: string) => {
      const normalizedValue = decodedText.trim();

      if (!normalizedValue || isCoolingDownRef.current || isVerifyingRef.current) {
        return;
      }

      lastScannedRef.current = normalizedValue;
      setLastScanned(normalizedValue);
      void onScanRef.current(normalizedValue);
      startCooldown();
    },
    [startCooldown]
  );

  const cleanupScanner = useCallback(async () => {
    clearCooldown();
    isCoolingDownRef.current = false;

    const scanner = scannerRef.current;
    if (!scanner) return;

    try {
      const state = scanner.getState();
      if (
        state === Html5QrcodeScannerState.SCANNING ||
        state === Html5QrcodeScannerState.PAUSED
      ) {
        if (state === Html5QrcodeScannerState.PAUSED) {
          scanner.resume();
        }
        await scanner.stop();
      }
      scanner.clear();
    } catch {
      // Cleanup should never block route changes or component unmounts.
    } finally {
      scannerRef.current = null;
      if (isMountedRef.current) {
        setReady(false);
        setIsCoolingDown(false);
      }
    }
  }, [clearCooldown]);

  useEffect(() => {
    isMountedRef.current = true;
    let cancelled = false;
    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = scanner;

    void (async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          handleScanSuccess,
          () => {
            // No QR in frame.
          }
        );

        if (!cancelled && isMountedRef.current) {
          setReady(true);
          setError(null);
        }
      } catch (err) {
        if (!cancelled && isMountedRef.current) {
          const message =
            err instanceof Error ? err.message : "Could not access camera";
          setError(message);
        }
      }
    })();

    return () => {
      cancelled = true;
      isMountedRef.current = false;
      void cleanupScanner();
    };
  }, [cleanupScanner, handleScanSuccess]);

  return (
    <div className="flex flex-col gap-5">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/25 ring-1 ring-indigo-300/10">
        <div
          id={SCANNER_ELEMENT_ID}
          className="min-h-[300px] w-full sm:min-h-[360px] [&_video]:!h-auto [&_video]:!max-h-[520px] [&_video]:!w-full [&_video]:!object-cover"
        />

        {ready && <ViewfinderOverlay paused={isCoolingDown} />}

        {(isCoolingDown || isVerifying) && (
          <div className="absolute inset-x-4 top-4 flex items-center justify-center gap-3 rounded-2xl border border-amber-300/30 bg-zinc-950/75 px-4 py-3 text-center text-sm font-semibold text-amber-100 shadow-lg shadow-black/20 backdrop-blur-md">
            {isVerifying && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-100 border-t-transparent" />
            )}
            {isVerifying ? "Verifying participant..." : "Scanning paused..."}
          </div>
        )}

        {!ready && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-950/95">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            <p className="text-sm font-medium text-zinc-300">
              Starting camera...
            </p>
          </div>
        )}
      </section>

      {error && (
        <div
          role="alert"
          className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 dark:border-red-900/50 dark:bg-red-950/40"
        >
          <WarningIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-300" />
          <div>
            <p className="text-sm font-semibold text-red-900 dark:text-red-200">
              Camera unavailable
            </p>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 shadow-sm backdrop-blur-xl">
        <p className="text-center text-sm font-medium text-zinc-100">
          {isCoolingDown
            ? "Scanner will resume automatically"
            : isVerifying
              ? "Verifying participant..."
            : "Align the QR code inside the frame"}
        </p>
        <p className="mt-1 break-all text-center text-xs text-zinc-500">
          {lastScanned
            ? `Last scanned: ${lastScanned}`
            : "Hold steady - Good lighting helps"}
        </p>
      </div>
    </div>
  );
}

function ViewfinderOverlay({ paused }: { paused: boolean }) {
  const corner = paused
    ? "absolute h-8 w-8 border-amber-300"
    : "absolute h-8 w-8 border-indigo-400 dark:border-indigo-300";

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative h-56 w-56">
        <span
          className={`${corner} left-0 top-0 rounded-tl-lg border-l-4 border-t-4`}
        />
        <span
          className={`${corner} right-0 top-0 rounded-tr-lg border-r-4 border-t-4`}
        />
        <span
          className={`${corner} bottom-0 left-0 rounded-bl-lg border-b-4 border-l-4`}
        />
        <span
          className={`${corner} bottom-0 right-0 rounded-br-lg border-b-4 border-r-4`}
        />
        <span
          className={`absolute left-2 right-2 top-1/2 h-0.5 -translate-y-1/2 ${
            paused ? "bg-amber-300/70" : "animate-pulse bg-indigo-400/60"
          }`}
        />
      </div>
    </div>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 9v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 17h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
