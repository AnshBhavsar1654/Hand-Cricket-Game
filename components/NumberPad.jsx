const VALUES = [0, 1, 2, 3, 4, 5, 6];

const BTN =
  "num-btn aspect-square rounded-full border border-slate-200 bg-white text-base sm:text-lg font-medium text-slate-500 cursor-pointer transition-all duration-200 hover:border-you/50 hover:text-slate-900 hover:bg-you/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-you/50 active:scale-90 disabled:opacity-30 disabled:pointer-events-none dark:border-white/10 dark:bg-ink-800 dark:text-slate-400 dark:hover:text-white dark:hover:bg-you/10";

export default function NumberPad({ onPick, disabled }) {
  return (
    <section aria-label="Choose a number">
      <div className="grid grid-cols-7 gap-2 sm:gap-2.5 max-w-md mx-auto">
        {VALUES.map((v) => (
          <button
            key={v}
            type="button"
            data-value={v}
            disabled={disabled}
            aria-label={`Play ${v}`}
            onClick={() => onPick(v)}
            className={BTN}
          >
            {v}
          </button>
        ))}
      </div>
    </section>
  );
}
