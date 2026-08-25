const CHIP_STYLES = {
  idle: "bg-slate-100 border-slate-200 text-slate-500 dark:bg-ink-800 dark:border-white/[0.06]",
  playing: "bg-indigo-50 border-indigo-200 text-you dark:bg-you/10 dark:border-you/20",
  out: "bg-rose-50 border-rose-200 text-cpu dark:bg-cpu/10 dark:border-cpu/20",
};

function HandSide({ label, labelCls, src, alt, num, numCls, animating, bobKey, revealKey, mirror }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`text-[11px] font-semibold uppercase tracking-widest ${labelCls}`}>{label}</div>
      <div className="h-36 sm:h-48 flex items-end justify-center">
        <div className={mirror ? "-scale-x-100 animate-rise" : "animate-rise"}>
          <div
            key={animating ? `bob-${bobKey}` : `pop-${revealKey}`}
            className={animating ? "hand-bob" : "animate-pop-in"}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              draggable="false"
              className={`w-24 sm:w-32 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-1 shadow-card pointer-events-none select-none dark:bg-white dark:ring-transparent ${
                mirror ? "rotate-2" : "-rotate-2"
              }`}
            />
          </div>
        </div>
      </div>
      <div className={`text-xl sm:text-2xl font-semibold tabular-nums min-h-[1.5em] ${numCls}`}>
        {num}
      </div>
    </div>
  );
}

export default function Arena({
  playerLabel,
  cpuLabel,
  playerHandSrc,
  cpuHandSrc,
  playerNum,
  cpuNum,
  animating,
  bobKey,
  revealKey,
  chip,
}) {
  return (
    <section
      className="relative rounded-3xl bg-white border border-slate-200 shadow-card p-6 sm:p-8 overflow-hidden dark:bg-ink-900 dark:border-white/[0.06] dark:shadow-card-dark transition-colors duration-300"
      aria-label="Arena"
    >
      <span
        className={`absolute left-1/2 top-4 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-widest rounded-full px-3 py-1 border transition-colors duration-300 ${CHIP_STYLES[chip.style]}`}
      >
        {chip.text}
      </span>

      <div className="grid grid-cols-2 gap-4 items-end mt-4">
        <HandSide
          label={playerLabel}
          labelCls="text-you"
          src={playerHandSrc}
          alt="Your hand"
          num={playerNum}
          numCls="text-you"
          animating={animating}
          bobKey={bobKey}
          revealKey={revealKey}
          mirror={false}
        />

        {/* Divider */}
        <div
          className="absolute left-1/2 top-10 bottom-8 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent pointer-events-none dark:via-white/10"
          aria-hidden="true"
        />

        <HandSide
          label={cpuLabel}
          labelCls="text-cpu"
          src={cpuHandSrc}
          alt="Computer's hand"
          num={cpuNum}
          numCls="text-cpu"
          animating={animating}
          bobKey={bobKey}
          revealKey={revealKey}
          mirror
        />
      </div>
    </section>
  );
}
