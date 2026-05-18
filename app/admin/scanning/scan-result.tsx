type Props = {
  value: string;
  scannedAt: Date;
  onScanAgain: () => void;
};

export function ScanResult({ value, scannedAt, onScanAgain }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white shadow-lg shadow-emerald-900/5 dark:border-emerald-800/50 dark:from-emerald-950/50 dark:to-zinc-900 dark:shadow-emerald-950/20">
        <div className="border-b border-emerald-200/60 bg-emerald-600 px-6 py-4 dark:border-emerald-800/50 dark:bg-emerald-700">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl text-white">
              ✓
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Check-in successful</p>
              <p className="text-xs text-emerald-100">
                {scannedAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Attendee ID
          </p>
          <p className="mt-2 break-all rounded-xl bg-white/80 px-4 py-3 font-mono text-base leading-relaxed text-zinc-900 ring-1 ring-emerald-200/60 dark:bg-zinc-950/80 dark:text-zinc-50 dark:ring-emerald-800/40">
            {value}
          </p>
        </div>
      </section>

      <button
        type="button"
        onClick={onScanAgain}
        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30 active:scale-[0.98] dark:bg-indigo-500 dark:shadow-indigo-500/20 dark:hover:bg-indigo-400"
      >
        <span className="transition-transform group-hover:-rotate-90">↻</span>
        Scan another code
      </button>
    </div>
  );
}
