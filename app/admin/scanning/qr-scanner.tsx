"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";

const SCANNER_ELEMENT_ID = "qr-reader";

type Props = {
  onScan: (decodedText: string) => void;
};

export function QrScanner({ onScan }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const onScanRef = useRef(onScan);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;

    try {
      const state = scanner.getState();
      if (state === Html5QrcodeScannerState.SCANNING) {
        await scanner.stop();
      }
      scanner.clear();
    } catch {
      // ignore cleanup errors
    } finally {
      scannerRef.current = null;
      setReady(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = scanner;

    void (async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            void stopScanner().then(() => {
              if (!cancelled) onScanRef.current(decodedText);
            });
          },
          () => {
            // no QR in frame
          }
        );
        if (!cancelled) setReady(true);
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Could not access camera";
          setError(message);
        }
      }
    })();

    return () => {
      cancelled = true;
      void stopScanner();
    };
  }, [stopScanner]);

  return (
    <div className="flex flex-col gap-5">
      <section className="relative overflow-hidden rounded-3xl border-2 border-indigo-200/60 bg-zinc-950 shadow-xl shadow-indigo-900/10 ring-1 ring-black/5 dark:border-indigo-500/30 dark:shadow-indigo-950/40">
        <div
          id={SCANNER_ELEMENT_ID}
          className="min-h-[320px] w-full [&_video]:!h-auto [&_video]:!max-h-[440px] [&_video]:!w-full [&_video]:!object-cover"
        />

        {ready && (
          <ViewfinderOverlay />
        )}

        {!ready && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-950/95">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            <p className="text-sm font-medium text-zinc-300">Starting camera…</p>
          </div>
        )}
      </section>

      {error && (
        <div
          role="alert"
          className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 dark:border-red-900/50 dark:bg-red-950/40"
        >
          <span className="text-lg" aria-hidden>
            ⚠️
          </span>
          <div>
            <p className="text-sm font-semibold text-red-900 dark:text-red-200">
              Camera unavailable
            </p>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-indigo-100 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-sm dark:border-indigo-500/20 dark:bg-zinc-900/80">
        <p className="text-center text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Align the QR code inside the frame
        </p>
        <p className="mt-1 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Hold steady · Good lighting helps
        </p>
      </div>
    </div>
  );
}

function ViewfinderOverlay() {
  const corner =
    "absolute h-8 w-8 border-indigo-400 dark:border-indigo-300";

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative h-56 w-56">
        <span className={`${corner} left-0 top-0 border-l-4 border-t-4 rounded-tl-lg`} />
        <span className={`${corner} right-0 top-0 border-r-4 border-t-4 rounded-tr-lg`} />
        <span className={`${corner} bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg`} />
        <span className={`${corner} bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg`} />
        <span className="absolute left-2 right-2 top-1/2 h-0.5 -translate-y-1/2 animate-pulse bg-indigo-400/60" />
      </div>
    </div>
  );
}
