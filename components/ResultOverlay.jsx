export default function ResultOverlay({ visible, result, onRematch, onMenu }) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Match result"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 shadow-card p-8 text-center animate-pop-in dark:bg-ink-900 dark:border-white/[0.06] dark:shadow-card-dark">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{result.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{result.sub}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onRematch}
            className="rounded-full bg-you px-4 py-2.5 text-sm font-semibold text-white cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-you/50"
          >
            Play Again
          </button>
          <button
            type="button"
            onClick={onMenu}
            className="rounded-full border border-slate-200 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-500 cursor-pointer transition-all duration-200 hover:text-slate-900 hover:border-slate-300 active:scale-95 dark:border-white/10 dark:text-slate-400 dark:hover:text-white dark:hover:border-white/20"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
