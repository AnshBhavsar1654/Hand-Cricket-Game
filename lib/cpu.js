/**
 * CPU bowling brain with three difficulty levels.
 *
 * The CPU tries to "read" the batter by guessing which number they will play.
 * Guessing correctly gets the batter out.
 *
 * - easy:   plays completely at random
 * - medium: mostly random, but occasionally leans on your habits
 * - hard:   frequency analysis + recency bias, and sometimes locks
 *           outright onto your favourite number
 */

const rand7 = () => Math.floor(Math.random() * 7);

const weightedPick = (weights) => {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r < 0) return i;
  }
  return 6;
};

/**
 * @param {number[]} playerPicks - every number the human has played this game
 * @param {"easy"|"medium"|"hard"} difficulty
 * @returns {number} the CPU's pick (0-6)
 */
export const getCpuChoice = (playerPicks, difficulty) => {
  if (difficulty === "easy" || playerPicks.length === 0) return rand7();

  /* Frequency of every number played so far */
  const counts = new Array(7).fill(0);
  playerPicks.forEach((v) => counts[v]++);

  if (difficulty === "medium") {
    /* 55% pure guess, 45% mildly pattern-aware */
    if (Math.random() < 0.55) return rand7();
    return weightedPick(counts.map((c) => c + 2));
  }

  /* Hard: strong pattern prediction */
  const recent = playerPicks.slice(-5);
  const recentCounts = new Array(7).fill(0);
  recent.forEach((v) => recentCounts[v]++);

  const weights = counts.map((c, i) => Math.pow(c + 1, 1.5) + recentCounts[i] * 4);

  /* Sometimes commit outright to your most-used number */
  if (playerPicks.length >= 6 && Math.random() < 0.25) {
    return weights.indexOf(Math.max(...weights));
  }
  return weightedPick(weights);
};

export const DIFFICULTIES = ["easy", "medium", "hard"];

export const DIFFICULTY_INFO = {
  easy: { label: "Easy", desc: "Plays completely at random." },
  medium: { label: "Medium", desc: "Mostly random, but starts picking up on your habits." },
  hard: { label: "Hard", desc: "Studies your patterns and hunts your favourite numbers." },
};
