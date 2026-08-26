"use client";

const COIN_BASE =
  "h-24 w-24 rounded-full flex items-center justify-center font-display font-black text-xl uppercase tracking-widest shadow-card border-4";

const BTN =
  "rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-you/50 hover:text-you hover:bg-you/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-you/50 active:scale-95 dark:border-white/10 dark:bg-ink-800 dark:text-slate-300 dark:hover:border-you/50 dark:hover:text-you dark:hover:bg-you/10";

export default function Toss({ stage, coin, onCall, onChoose }) {
  return (
    <section
      className="flex flex-col items-center gap-6 rounded-3xl bg-white border border-slate-200 shadow-card p-8 dark:bg-ink-900 dark:border-white/[0.06] dark:shadow-card-dark transition-colors duration-300"
      aria-label="The toss"
    >
      {/* Coin */}
      <div key={coin || "pending"} className={stage === "flipping" ? "animate-spin" : coin ? "coin-flip" : ""}>
        <div
          className={`${COIN_BASE} ${
            coin === "tails"
              ? "bg-gradient-to-br from-slate-200 to-slate-400 border-slate-500 text-slate-700"
              : "bg-gradient-to-br from-amber-200 to-amber-400 border-amber-500 text-amber-800"
          }`}
        >
          {coin ? coin : "\u00b7"}
        </div>
      </div>

      {stage === "call" && (
        <>
          <p className="text-sm text-slate-500">Call it in the air</p>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => onCall("heads")} className={BTN}>
              Heads
            </button>
            <button type="button" onClick={() => onCall("tails")} className={BTN}>
              Tails
            </button>
          </div>
        </>
      )}

      {stage === "choice" && (
        <>
          <p className="text-sm font-medium text-you">You won the toss!</p>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => onChoose("bat")} className={BTN}>
              Bat First
            </button>
            <button type="button" onClick={() => onChoose("bowl")} className={BTN}>
              Bowl First
            </button>
          </div>
        </>
      )}

      {(stage === "flipping" || stage === "done") && (
        <p className="text-sm text-slate-500 min-h-[1.5em]">Coin is in the air&hellip;</p>
      )}
    </section>
  );
}
