"use client";

const BTN =
  "rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-you/50 hover:text-you hover:bg-you/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-you/50 active:scale-95 dark:border-white/10 dark:bg-ink-800 dark:text-slate-300 dark:hover:border-you/50 dark:hover:text-you dark:hover:bg-you/10";

export default function Toss({ stage, coin, flipKey, onCall, onChoose }) {
  const isIdle = stage === "call";
  const landClass = !isIdle && coin ? `coin-land-${coin}` : "";
  const shadowClass = stage === "flipping" ? "shadow-flip" : "";

  return (
    <section
      className="flex flex-col items-center gap-6 rounded-3xl bg-white border border-slate-200 shadow-card p-8 sm:p-10 overflow-hidden relative transition-colors duration-300 dark:bg-ink-900 dark:border-white/[0.06] dark:shadow-card-dark"
      aria-label="The toss"
    >
      {/* Soft ambient blobs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 h-52 w-52 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      {/* Coin */}
      <div className="relative flex flex-col items-center">
        <div className="coin-scene">
          <div
            key={isIdle ? "idle" : `flip-${flipKey}`}
            className={`coin ${isIdle ? "coin-idle" : landClass}`}
          >
            <div className="coin-face coin-heads">H</div>
            <div className="coin-face coin-tails">T</div>
          </div>
        </div>
        <div className="coin-shadow-wrap">
          <div className={`coin-shadow ${shadowClass}`} />
        </div>
      </div>

      {/* Call phase */}
      {stage === "call" && (
        <>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Call it in the air</p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            <button type="button" onClick={() => onCall("heads")} className={BTN}>Heads</button>
            <button type="button" onClick={() => onCall("tails")} className={BTN}>Tails</button>
          </div>
        </>
      )}

      {/* Spinning */}
      {stage === "flipping" && (
        <p className="text-sm font-medium text-slate-500 animate-pulse min-h-[1.5em]">
          The coin is in the air&hellip;
        </p>
      )}

      {/* Won the toss — choose */}
      {stage === "choice" && (
        <>
          <p className="text-sm font-semibold text-you capitalize">{coin}! You won the toss &mdash; choose:</p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            <button type="button" onClick={() => onChoose("bat")} className={BTN}>Bat First</button>
            <button type="button" onClick={() => onChoose("bowl")} className={BTN}>Bowl First</button>
          </div>
        </>
      )}

      {/* CPU decides */}
      {stage === "done" && (
        <p className="text-sm font-medium text-cpu capitalize min-h-[1.5em]">
          {coin} &mdash; CPU won the toss
        </p>
      )}
    </section>
  );
}
