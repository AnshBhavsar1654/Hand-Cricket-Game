export default function HistoryStrip({ history }) {
  return (
    <div aria-label="Recent balls">
      <div className="flex justify-center gap-1.5 flex-wrap min-h-[26px]">
        {history.map((h, i) =>
          h.out ? (
            <span
              key={i}
              className="text-xs font-medium rounded-full px-2.5 py-1 border bg-rose-50 border-rose-200 text-cpu animate-rise dark:bg-cpu/10 dark:border-cpu/20"
            >
              OUT
            </span>
          ) : (
            <span
              key={i}
              className="text-xs font-medium tabular-nums rounded-full px-2.5 py-1 border bg-white border-slate-200 text-slate-500 animate-rise dark:bg-ink-800 dark:border-white/10 dark:text-slate-400"
            >
              +{h.runs}
            </span>
          )
        )}
      </div>
    </div>
  );
}
