"use client";

import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import StatsBar from "@/components/StatsBar";
import Arena from "@/components/Arena";
import HistoryStrip from "@/components/HistoryStrip";
import ModeSelect from "@/components/ModeSelect";
import NumberPad from "@/components/NumberPad";
import ResultOverlay from "@/components/ResultOverlay";
import { IMAGE_MAP, getComputerChoice } from "@/lib/images";

const initialState = {
  mode: null, // 'quick' | 'match'
  phase: "menu", // menu | playing | break | over
  role: "bat", // bat | bowl
  innings: 1,
  score: 0,
  cpuScore: 0,
  target: 0,
  ball: 0,
  history: [],
  bestScore: 0,
  lastBall: { text: "\u2013", cls: "text-slate-400" },
  msg: "Choose a game mode to get started.",
  subtitle: "Match the computer's number and you're out.",
  chip: { text: "Ready", style: "idle" },
  playerLabel: "You \u00b7 Batting",
  cpuLabel: "CPU \u00b7 Bowling",
  playerHandValue: 0,
  cpuHandValue: 0,
  bobKey: 0,
  revealKey: 0,
  isAnimating: false,
  shaking: false,
  result: null, // { title, sub }
};

export default function Game() {
  const [state, setState] = useState(initialState);
  const ref = useRef(state);
  const timerRef = useRef(null);

  const patch = (p) => {
    ref.current = { ...ref.current, ...p };
    setState(ref.current);
  };

  const later = (fn, ms) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(fn, ms);
  };

  useEffect(() => {
    patch({ bestScore: Number(localStorage.getItem("bestScore") || 0) });
    return () => clearTimeout(timerRef.current);
  }, []);

  /* ---------- Flow ---------- */

  const goToMenu = () => {
    clearTimeout(timerRef.current);
    patch({
      mode: null,
      phase: "menu",
      innings: 1,
      score: 0,
      cpuScore: 0,
      target: 0,
      ball: 0,
      history: [],
      isAnimating: false,
      shaking: false,
      result: null,
      lastBall: { text: "\u2013", cls: "text-slate-400" },
      msg: "Choose a game mode to get started.",
      subtitle: "Match the computer's number and you're out.",
      chip: { text: "Ready", style: "idle" },
      playerLabel: "You \u00b7 Batting",
      cpuLabel: "CPU \u00b7 Bowling",
      playerHandValue: 0,
      cpuHandValue: 0,
      revealKey: ref.current.revealKey + 1,
    });
  };

  const beginInnings = (role) => {
    const s = ref.current;
    patch({
      phase: "playing",
      role,
      ball: 0,
      history: [],
      score: role === "bat" ? 0 : s.score,
      cpuScore: role === "bowl" ? 0 : s.cpuScore,
      isAnimating: false,
      shaking: false,
      result: null,
      lastBall: { text: "\u2013", cls: "text-slate-400" },
      playerHandValue: 0,
      cpuHandValue: 0,
      revealKey: ref.current.revealKey + 1,
      playerLabel:
        s.mode === "match"
          ? role === "bat"
            ? "You \u00b7 Batting"
            : "You \u00b7 Bowling"
          : "You \u00b7 Batting",
      cpuLabel:
        s.mode === "match"
          ? role === "bat"
            ? "CPU \u00b7 Bowling"
            : "CPU \u00b7 Batting"
          : "CPU \u00b7 Bowling",
    });

    if (s.innings === 2) {
      patch({
        msg: `Defend your total! Get the CPU out before it reaches ${s.target}.`,
        subtitle: `Innings 2 \u2014 CPU needs ${s.target} to win.`,
        chip: { text: `Bowling \u00b7 Ball 1`, style: "playing" },
      });
    } else {
      patch({
        msg: "Pick a number to begin your innings.",
        subtitle: "Match the computer's number and you're out.",
        chip: { text: "Batting \u00b7 Ball 1", style: "playing" },
      });
    }
  };

  const startGame = (mode) => {
    clearTimeout(timerRef.current);
    patch({ mode, innings: 1 });
    // beginInnings reads ref; ensure mode is set first
    ref.current.mode = mode;
    beginInnings("bat");
  };

  /* ---------- Out handling ---------- */

  const handleOutBatting = () => {
    const s = ref.current;
    patch({ chip: { text: "Out", style: "out" }, shaking: true });

    if (s.mode === "quick") {
      patch({
        msg: `Out! You scored ${s.score}. Pick a number to start again.`,
      });
      later(() => {
        patch({ shaking: false });
        beginInnings("bat");
      }, 2200);
      return;
    }

    if (s.innings === 1) {
      const target = s.score + 1;
      patch({
        phase: "break",
        target,
        chip: { text: "Innings Break", style: "idle" },
        msg: `Innings over! You scored ${s.score}. The CPU needs ${target} to win.`,
        subtitle: "Innings break \u2014 you're bowling next.",
      });
      later(() => {
        patch({ innings: 2, shaking: false });
        beginInnings("bowl");
      }, 2600);
    }
  };

  const finishMatchAfterCpuOut = () => {
    const s = ref.current;
    if (s.cpuScore > s.score) showResult("loss");
    else if (s.cpuScore === s.score) showResult("tie");
    else showResult("win");
  };

  const showResult = (outcome) => {
    const s = ref.current;
    let title, sub;
    if (outcome === "win") {
      title = "Victory!";
      const margin = s.score - s.cpuScore;
      sub = `The CPU was bowled out for ${s.cpuScore} \u2014 you win by ${margin} run${margin === 1 ? "" : "s"}.`;
    } else if (outcome === "loss") {
      title = "Defeat";
      const ballsLeft = Math.max(0, 7 - s.ball);
      sub =
        ballsLeft > 0
          ? `The CPU chased ${s.target} with ${ballsLeft} ball${ballsLeft === 1 ? "" : "s"} to spare.`
          : `The CPU chased ${s.target} successfully.`;
    } else {
      title = "It's a Tie!";
      sub = `Both sides finished on ${s.score}. What are the odds?`;
    }

    patch({
      phase: "over",
      isAnimating: false,
      result: { title, sub },
      chip: {
        text: outcome === "win" ? "Victory" : outcome === "loss" ? "Defeat" : "Tie",
        style: outcome === "win" ? "playing" : "out",
      },
    });
  };

  /* ---------- Ball resolution ---------- */

  const resolveBall = (userChoice, cpuChoice) => {
    const s = ref.current;
    const out = userChoice === cpuChoice;

    const history = [...s.history, { runs: s.role === "bat" ? userChoice : cpuChoice, out }];
    if (history.length > 8) history.shift();
    patch({ ball: s.ball + 1, history });

    const chipText = `${s.role === "bat" ? "Batting" : "Bowling"} \u00b7 Ball ${s.ball + 1}`;

    if (out && s.role === "bat") {
      handleOutBatting();
      return;
    }

    if (out && s.role === "bowl") {
      patch({
        chip: { text: "Wicket!", style: "out" },
        msg: "Howzat! The CPU is bowled out.",
      });
      later(finishMatchAfterCpuOut, 1600);
      return;
    }

    if (s.role === "bat") {
      if (userChoice > 0) {
        const score = s.score + userChoice;
        patch({
          score,
          chip: { text: chipText, style: "playing" },
          msg: `${userChoice} run${userChoice > 1 ? "s" : ""}. Score: ${score}`,
        });
        updateBest(score);
      } else {
        patch({
          chip: { text: chipText, style: "playing" },
          msg: "Dot ball.",
        });
      }
    } else {
      const cpuScore = s.cpuScore + cpuChoice;
      patch({
        cpuScore,
        chip: { text: chipText, style: "playing" },
        msg:
          cpuChoice > 0
            ? `The CPU takes ${cpuChoice} run${cpuChoice > 1 ? "s" : ""}. CPU: ${cpuScore}/${ref.current.target}`
            : `No run. CPU: ${cpuScore}/${ref.current.target}`,
      });

      if (cpuScore >= ref.current.target) {
        later(() => showResult("loss"), 1400);
      }
    }
  };

  const updateBest = (score) => {
    const s = ref.current;
    if (s.mode === "quick" && score > s.bestScore) {
      localStorage.setItem("bestScore", String(score));
      patch({ bestScore: score });
    }
  };

  /* ---------- Play a ball ---------- */

  const playBall = (userChoice) => {
    const s = ref.current;
    if (s.phase !== "playing" || s.isAnimating) return;

    const cpuChoice = getComputerChoice();

    patch({
      isAnimating: true,
      bobKey: ref.current.bobKey + 1,
      playerHandValue: 0,
      cpuHandValue: 0,
      playerNumShown: "?",
      cpuNumShown: "?",
      msg: "Hands up\u2026",
    });

    later(() => {
      patch({
        isAnimating: false,
        revealKey: ref.current.revealKey + 1,
        playerHandValue: userChoice,
        cpuHandValue: cpuChoice,
        playerNumShown: userChoice,
        cpuNumShown: cpuChoice,
      });
      resolveBall(userChoice, cpuChoice);
    }, 1050);
  };

  /* ---------- Keyboard ---------- */

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key >= "0" && e.key <= "6") playBall(Number(e.key));
      else if (e.key.toLowerCase() === "r") goToMenu();
      else if (e.key.toLowerCase() === "t") HC_toggleTheme();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  function HC_toggleTheme() {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem(
      "hc-theme",
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  }

  /* ---------- Derived HUD ---------- */

  const controlsEnabled = state.phase === "playing" && !state.isAnimating;

  let stats;
  if (state.phase === "menu" || state.phase === "over") {
    stats = [
      { label: "Score", value: state.phase === "over" ? state.score : 0, cls: "text-slate-900 dark:text-white" },
      { label: "Ball 1", value: "\u2013", cls: "text-slate-400" },
      { label: "Best", value: state.bestScore, cls: "text-slate-900 dark:text-white" },
    ];
  } else if (state.role === "bat") {
    stats = [
      { label: "Your Score", value: state.score, cls: "text-slate-900 dark:text-white" },
      { label: `Ball ${state.ball + 1}`, value: state.lastBall.text, cls: state.lastBall.cls },
      { label: "Best", value: state.bestScore, cls: "text-slate-900 dark:text-white" },
    ];
  } else {
    stats = [
      { label: "Defending", value: state.score, cls: "text-slate-900 dark:text-white" },
      { label: "CPU Score", value: state.cpuScore, cls: "text-cpu" },
      { label: "Target", value: state.target, cls: "text-slate-900 dark:text-white" },
    ];
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center px-4 py-10 sm:py-14 bg-slate-100 text-slate-700 dark:bg-ink-950 dark:text-slate-200 selection:bg-you/20 dark:selection:bg-you/30 transition-colors duration-300 ${
        state.shaking ? "animate-shake" : ""
      }`}
    >
      <ThemeToggle />

      {/* Header */}
      <header className="text-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Hand Cricket
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">{state.subtitle}</p>
      </header>

      <main className="w-full max-w-2xl flex flex-col gap-5">
        <StatsBar stats={stats} />

        <Arena
          playerLabel={state.playerLabel}
          cpuLabel={state.cpuLabel}
          playerHandSrc={IMAGE_MAP[state.playerHandValue]}
          cpuHandSrc={IMAGE_MAP[state.cpuHandValue]}
          playerNum={state.isAnimating ? "?" : state.playerNumShown ?? "\u2013"}
          cpuNum={state.isAnimating ? "?" : state.cpuNumShown ?? "\u2013"}
          animating={state.isAnimating}
          bobKey={state.bobKey}
          revealKey={state.revealKey}
          chip={state.chip}
        />

        {/* Message */}
        <p
          role="status"
          aria-live="polite"
          className="text-center text-sm sm:text-base text-slate-500 min-h-[1.5em] transition-colors duration-300"
        >
          {state.msg}
        </p>

        <HistoryStrip history={state.history} />

        {state.phase === "menu" ? (
          <ModeSelect onStart={startGame} />
        ) : (
          <>
            <NumberPad onPick={playBall} disabled={!controlsEnabled} />
            <div className="mt-5 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={goToMenu}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500 cursor-pointer transition-all duration-200 hover:border-cpu/40 hover:text-cpu hover:bg-cpu/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cpu/40 active:scale-95 dark:border-white/10 dark:bg-ink-800 dark:text-slate-400"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Quit to Menu
              </button>
            </div>
            <footer className="mt-4 text-xs text-slate-400 dark:text-slate-600 text-center">
              Keys 0 &ndash; 6 to play &middot; R to quit &middot; T to toggle theme
            </footer>
          </>
        )}
      </main>

      <ResultOverlay
        visible={!!state.result}
        result={state.result}
        onRematch={() => startGame(state.mode)}
        onMenu={goToMenu}
      />
    </div>
  );
}
