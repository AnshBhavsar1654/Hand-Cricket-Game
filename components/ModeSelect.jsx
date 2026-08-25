const MODES = [
  {
    id: "quick",
    title: "Quick Bat",
    desc: "Endless batting. Keep scoring until the computer reads your hand.",
  },
  {
    id: "match",
    title: "Full Match",
    desc: "Bat first to set a target, then bowl the CPU out to defend it.",
  },
];

export default function ModeSelect({ onStart }) {
  return (
    <section aria-label="Choose a game mode">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onStart(m.id)}
            className="text-left rounded-2xl border border-slate-200 bg-white p-5 cursor-pointer shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-you/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-you/50 active:scale-[0.98] dark:bg-ink-900 dark:border-white/[0.06]"
          >
            <div className="font-semibold text-slate-900 dark:text-white">{m.title}</div>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{m.desc}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
