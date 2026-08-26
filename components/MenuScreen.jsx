"use client";

import { IMAGE_MAP } from "@/lib/images";
import { DIFFICULTIES, DIFFICULTY_INFO } from "@/lib/cpu";

function ZapIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6m12 5h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22m7-7.34V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M9 2v6a3 3 0 0 0 6 0V2" />
    </svg>
  );
}

const MODES = [
  {
    id: "quick",
    title: "Quick Bat",
    tag: "Endless",
    desc: "One innings, no limits. Score as much as you can before the CPU reads your hand.",
    icon: <ZapIcon />,
    accent: "hover:border-you/60",
    iconWrap: "bg-you/10 text-you",
    cta: "Start Batting",
  },
  {
    id: "match",
    title: "Full Match",
    tag: "Coin Toss \u00b7 2 Innings",
    desc: "Win the toss, bat to set a target, then bowl the CPU out to defend it.",
    icon: <TrophyIcon />,
    accent: "hover:border-cpu/60",
    iconWrap: "bg-cpu/10 text-cpu",
    cta: "Play The Toss",
  },
];

const STEPS = [
  { n: "1", title: "Pick a number", desc: "Choose 0\u20136 each ball. The CPU secretly picks one too." },
  { n: "2", title: "Hands reveal", desc: "Both hands show their numbers after the countdown." },
  { n: "3", title: "Match means out", desc: "Equal numbers and you're out. Otherwise, your runs add up." },
];

export default function MenuScreen({ bestScore, difficulty, onDifficultyChange, onStart }) {
  return (
    <>
      {/* Hero */}
      <section
        className="relative w-full rounded-3xl bg-white border border-slate-200 shadow-card px-6 py-10 sm:p-12 overflow-hidden text-center transition-colors duration-300 dark:bg-ink-900 dark:border-white/[0.06] dark:shadow-card-dark"
      >
        {/* Soft ambient blobs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-you/10 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-cpu/10 blur-3xl" />
        </div>

        {/* Hand preview */}
        <div className="relative flex items-center justify-center gap-5 sm:gap-8 mb-7" aria-hidden="true">
          <div className="floaty">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMAGE_MAP[3]}
              alt=""
              draggable="false"
              className="w-20 sm:w-28 rounded-2xl bg-slate-50 ring-1 ring-you/30 p-1 shadow-card -rotate-6 select-none dark:bg-white"
            />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 border border-slate-200 rounded-full px-3 py-1 dark:bg-ink-800 dark:border-white/10 mb-6">
            vs
          </span>
          <div className="floaty" style={{ animationDelay: "-1.5s" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMAGE_MAP[5]}
              alt=""
              draggable="false"
              className="w-20 sm:w-28 rounded-2xl bg-slate-50 ring-1 ring-cpu/30 p-1 shadow-card rotate-6 scale-x-[-1] select-none dark:bg-white"
            />
          </div>
        </div>

        <h2 className="relative text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Beat the CPU at its own game
        </h2>
        <p className="relative mt-2 max-w-md mx-auto text-sm leading-relaxed text-slate-500">
          The classic hand-cricket duel. Outsmart the computer ball by ball &mdash; just don't let it read your palm.
        </p>

        {bestScore > 0 && (
          <div className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5 text-xs font-semibold text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l2.4 4.86 5.36.78-3.88 3.78.92 5.34L12 14.24l-4.8 2.52.92-5.34L4.24 7.64l5.36-.78L12 2z" />
            </svg>
            Personal best: {bestScore} runs
          </div>
        )}
      </section>

      {/* Difficulty selector */}
      <section
        aria-label="CPU difficulty"
        className="flex flex-col items-center gap-2.5 rounded-2xl bg-white border border-slate-200 shadow-card px-5 py-4 transition-colors duration-300 dark:bg-ink-900 dark:border-white/[0.06] dark:shadow-card-dark"
      >
        <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          CPU Difficulty
        </div>
        <div className="grid grid-cols-3 gap-1 rounded-full bg-slate-100 border border-slate-200 p-1 w-full max-w-xs dark:bg-ink-800 dark:border-white/10">
          {DIFFICULTIES.map((d) => {
            const active = difficulty === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => onDifficultyChange(d)}
                aria-pressed={active}
                className={`py-1.5 rounded-full text-sm font-semibold capitalize cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-you/50 active:scale-95 ${
                  active
                    ? "bg-white text-you shadow-card dark:bg-you/20 dark:text-you-soft"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {DIFFICULTY_INFO[d].label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-500">{DIFFICULTY_INFO[difficulty].desc}</p>
      </section>

      {/* Modes */}
      <section aria-label="Choose a game mode" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onStart(m.id)}
            className={`group text-left flex flex-col rounded-2xl border border-slate-200 bg-white p-5 cursor-pointer shadow-card transition-all duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-you/50 active:scale-[0.98] dark:bg-ink-900 dark:border-white/[0.06] ${m.accent}`}
          >
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center justify-center h-10 w-10 rounded-xl ${m.iconWrap}`}>
                {m.icon}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-1 dark:bg-ink-800 dark:border-white/[0.06]">
                {m.tag}
              </span>
            </div>
            <div className="mt-4 font-semibold text-slate-900 dark:text-white">{m.title}</div>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 flex-1">{m.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-you dark:text-you-soft">
              {m.cta}
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </span>
          </button>
        ))}
      </section>

      {/* How to play */}
      <section aria-label="How to play" className="rounded-2xl bg-white border border-slate-200 shadow-card p-5 transition-colors duration-300 dark:bg-ink-900 dark:border-white/[0.06] dark:shadow-card-dark">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-4">How to play</div>
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STEPS.map((s) => (
            <li key={s.n} className="flex sm:flex-col gap-3">
              <span className="shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-500 dark:bg-ink-800 dark:border-white/10 dark:text-slate-400">
                {s.n}
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{s.title}</div>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
