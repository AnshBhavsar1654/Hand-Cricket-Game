# Hand Cricket

A modern, browser-based hand cricket game built with **Next.js 15**, **React 19**, and **Tailwind CSS v4**. Play the classic schoolyard game against a CPU — pick a number each ball, and if the CPU matches your hand, you're out.

![Tech](https://img.shields.io/badge/Next.js-15-black) ![React](https://img.shields.io/badge/React-19-blue) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8)

---

## Features

### Game Modes
| Mode | Description |
|------|-------------|
| **Quick Bat** | Endless batting. Score as much as you can before the CPU reads your hand. Best score is saved locally. |
| **Full Match** | The complete experience — coin toss, two innings, target chase, and a full result screen with margins. |

### Full Match Flow
1. **The Toss** — call heads or tails and watch the animated 3D coin flip land on the real result face. Winner chooses to bat or bowl first.
2. **Innings 1** — bat to set a target (`score + 1`), or bowl to dismiss the CPU.
3. **Innings break** — an interstitial announces the target before roles flip.
4. **Innings 2** — chase the target or defend it. Win, loss (by runs / balls to spare), and tie outcomes are all detected.

### Gameplay & UX
- Animated ball sequence: both hands show a fist, bob up and down, then reveal their numbers with a pop
- Live scoreboard that adapts per phase (Score / Ball / Best → Defending / CPU Score / Target)
- Recent-balls strip tracking the last 8 deliveries (+runs and OUT chips)
- Status chip showing game state at a glance (*Batting · Ball 4*, *Wicket!*, *Victory*…)
- Keyboard controls: **0–6** to play a delivery, **R** to quit to menu, **T** to toggle theme

### Interface
- Refined dark/light theme with a no-flash toggle (respects OS preference, persists choice)
- Calm "premium app" design language: soft surfaces, muted indigo/rose accents, Inter typography
- Professional landing menu with animated hero preview, mode cards, and how-to-play guide
- Fully responsive from mobile to desktop

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18.18 or later
- npm (bundled with Node.js)

### Install

```bash
git clone <repo-url>
cd "Hand Cricket Game"
npm install
```

### Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** Avoid running `npm run build` while `npm run dev` is active — both write to the `.next` folder and will corrupt each other's output.

### Production build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## How to Play

1. **Pick a number (0–6)** each ball by tapping the buttons or pressing the number keys.
2. The CPU secretly picks its own number for the same ball.
3. Both hands animate and reveal:
   - **Numbers match** → whoever is batting is **out**
   - **Numbers differ** → the batter scores *their own number* as runs (a pick of 0 is a dot ball)

In a **Full Match**, the toss decides who bats/bowls first; the side batting second must beat the first innings total to win.

---

## Project Structure

```
app/
  layout.js          # Root layout — Inter font, metadata, theme init (no-flash)
  globals.css        # Tailwind v4 theme tokens + custom animations
  page.js            # Renders <Game />
components/
  Game.jsx           # Client state machine: menu → toss → innings → result
  MenuScreen.jsx     # Landing page — hero, mode cards, how-to-play
  Toss.jsx           # Coin toss UI with 3D flip animation
  Arena.jsx          # Player vs CPU hand reveal area
  StatsBar.jsx       # Phase-aware scoreboard
  NumberPad.jsx      # 0–6 delivery picker
  HistoryStrip.jsx   # Last 8 deliveries
  ResultOverlay.jsx  # Win/loss/tie modal
  ThemeToggle.jsx    # Dark/light switch
lib/
  images.js          # Hand image map, preloading, CPU random picker
public/              # Hand images (Zero–Six.jpg)
```

### State Management
`Game.jsx` keeps all match state in a single `useState` object mirrored into a ref, so timer-driven flows (ball animation, innings breaks, result delays) always read fresh values without stale closures.

### Styling
Tailwind CSS v4 with CSS-first configuration — colors (`ink`, `you`, `cpu`), shadows, and keyframes are defined as `@theme` tokens in `globals.css`. Dark mode uses a class-based `@custom-variant`.

---

## Roadmap Ideas

- Sound effects with mute toggle
- Adaptive CPU that learns your number patterns
- Local two-player hot-seat mode
- Achievements and career stats page
- PWA support for offline play

---

## License

MIT