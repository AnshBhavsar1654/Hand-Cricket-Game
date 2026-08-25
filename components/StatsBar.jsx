const CARD =
  "rounded-2xl bg-white border border-slate-200 px-4 py-3.5 text-center shadow-card dark:bg-ink-900 dark:border-white/[0.06] dark:shadow-card-dark transition-colors duration-300";

export default function StatsBar({ stats }) {
  return (
    <section className="grid grid-cols-3 gap-3" aria-label="Stats">
      {stats.map((s) => (
        <div key={s.label} className={CARD}>
          <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            {s.label}
          </div>
          <div className={`mt-0.5 text-3xl font-semibold tabular-nums ${s.cls}`}>{s.value}</div>
        </div>
      ))}
    </section>
  );
}
