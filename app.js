let score = 0;
let ball = 0;
let isGameActive = true;
let isAnimating = false;
let gameOverTimer = null;
let bestScore = localStorage.getItem('bestScore') || 0;
let history = [];

const msgElement = document.querySelector("#message");
const scoreElement = document.querySelector("#score");
const lastBallElement = document.querySelector("#last-ball");
const ballLabelElement = document.querySelector("#ball-label");
const bestScoreElement = document.querySelector("#best-score");
const statusChip = document.querySelector("#status-chip");
const playerHand = document.querySelector("#player-hand");
const cpuHand = document.querySelector("#cpu-hand");
const playerHandWrap = document.querySelector("#player-hand-wrap");
const cpuHandWrap = document.querySelector("#cpu-hand-wrap");
const playerNum = document.querySelector("#player-num");
const cpuNum = document.querySelector("#cpu-num");
const controls = document.querySelector("#controls");
const historyElement = document.querySelector("#history");
const themeToggle = document.querySelector("#theme-toggle");
const iconMoon = document.querySelector("#icon-moon");
const iconSun = document.querySelector("#icon-sun");
const resetButton = document.querySelector("#reset-game");

const IMAGE_MAP = {
    0: "Zero.jpg",
    1: "One.jpg",
    2: "Two.jpg",
    3: "Three.jpg",
    4: "Four.jpg",
    5: "Five.jpg",
    6: "Six.jpg"
};

Object.values(IMAGE_MAP).forEach(src => { new Image().src = src; });

/* ---------- Theme ---------- */

const applyThemeIcons = () => {
    const isDark = document.documentElement.classList.contains("dark");
    iconMoon.classList.toggle("hidden", !isDark);
    iconSun.classList.toggle("hidden", isDark);
};

const setTheme = (dark) => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem('hc-theme', dark ? 'dark' : 'light');
    applyThemeIcons();
};

themeToggle.addEventListener("click", () => {
    setTheme(!document.documentElement.classList.contains("dark"));
});

applyThemeIcons();

/* ---------- Game helpers ---------- */

const setHandImage = (img, value) => {
    img.src = IMAGE_MAP[value];
};

const replayAnimation = (element, className) => {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
};

const setMessage = (text) => {
    msgElement.textContent = text;
};

const CHIP_BASE = "absolute left-1/2 top-4 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-widest rounded-full px-3 py-1 transition-colors duration-300 border";
const CHIP_STYLES = {
    idle: `${CHIP_BASE} bg-slate-100 border-slate-200 text-slate-500 dark:bg-ink-800 dark:border-white/[0.06]`,
    playing: `${CHIP_BASE} bg-indigo-50 border-indigo-200 text-you dark:bg-you/10 dark:border-you/20`,
    out: `${CHIP_BASE} bg-rose-50 border-rose-200 text-cpu dark:bg-cpu/10 dark:border-cpu/20`
};

const setStatusChip = (text, style = "idle") => {
    statusChip.textContent = text;
    statusChip.className = CHIP_STYLES[style];
};

const renderHistory = () => {
    historyElement.innerHTML = history
        .map(h => h.out
            ? `<span class="text-xs font-medium rounded-full px-2.5 py-1 border bg-rose-50 border-rose-200 text-cpu animate-rise dark:bg-cpu/10 dark:border-cpu/20">OUT</span>`
            : `<span class="text-xs font-medium tabular-nums rounded-full px-2.5 py-1 border bg-white border-slate-200 text-slate-500 animate-rise dark:bg-ink-800 dark:border-white/10 dark:text-slate-400">+${h.runs}</span>`)
        .join("");
};

const setControlsEnabled = (enabled) => {
    controls.querySelectorAll("button").forEach(btn => {
        btn.disabled = !enabled;
    });
};

const updateBestScore = () => {
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
        bestScoreElement.textContent = bestScore;
    }
};

const resetGame = () => {
    if (isAnimating) return;

    clearTimeout(gameOverTimer);
    document.body.classList.remove("animate-shake");

    score = 0;
    ball = 0;
    history = [];
    isGameActive = true;

    scoreElement.textContent = "0";
    ballLabelElement.textContent = "Ball 1";
    lastBallElement.textContent = "–";
    lastBallElement.className = "mt-0.5 text-3xl font-semibold text-slate-400 tabular-nums";
    playerNum.textContent = "–";
    cpuNum.textContent = "–";
    setHandImage(playerHand, 0);
    setHandImage(cpuHand, 0);
    historyElement.innerHTML = "";
    setStatusChip("Ready");
    setMessage("Pick a number to begin your innings.");
    setControlsEnabled(true);
};

resetButton.addEventListener("click", resetGame);

const handleGameOver = () => {
    isGameActive = false;
    ballLabelElement.textContent = "Innings";
    lastBallElement.textContent = "OUT";
    lastBallElement.className = "mt-0.5 text-3xl font-semibold text-cpu tabular-nums animate-pop-in";
    setStatusChip("Out", "out");
    setMessage(`Out! You scored ${score}. Pick a number to start a new innings.`);
    document.body.classList.add("animate-shake");

    gameOverTimer = setTimeout(() => {
        document.body.classList.remove("animate-shake");
        resetGame();
    }, 2200);
};

const getComputerChoice = () => Math.floor(Math.random() * 7);

const playGame = (userChoice) => {
    if (!isGameActive || isAnimating) return;
    isAnimating = true;
    setControlsEnabled(false);

    const cpuChoice = getComputerChoice();
    ball += 1;

    playerNum.textContent = "?";
    cpuNum.textContent = "?";
    setHandImage(playerHand, 0);
    setHandImage(cpuHand, 0);
    setStatusChip("Ball " + ball, "playing");
    setMessage("Hands up…");

    playerHandWrap.classList.add("hand-bob");
    cpuHandWrap.classList.add("hand-bob");

    setTimeout(() => {
        playerHandWrap.classList.remove("hand-bob");
        cpuHandWrap.classList.remove("hand-bob");

        setHandImage(playerHand, userChoice);
        setHandImage(cpuHand, cpuChoice);
        replayAnimation(playerHandWrap, "animate-pop-in");
        replayAnimation(cpuHandWrap, "animate-pop-in");
        playerNum.textContent = userChoice;
        cpuNum.textContent = cpuChoice;

        const out = userChoice === cpuChoice;

        history.push({ runs: userChoice, out });
        if (history.length > 8) history.shift();
        renderHistory();

        if (out) {
            updateBestScore();
            handleGameOver();
            return;
        }

        score += userChoice;
        scoreElement.textContent = score;
        replayAnimation(scoreElement.parentElement, "animate-rise");
        updateBestScore();

        ballLabelElement.textContent = "Ball " + (ball + 1);
        if (userChoice > 0) {
            lastBallElement.textContent = `+${userChoice}`;
            lastBallElement.className = "mt-0.5 text-3xl font-semibold text-slate-900 tabular-nums animate-pop-in dark:text-white";
            setMessage(`${userChoice} run${userChoice > 1 ? "s" : ""}. Score: ${score}`);
        } else {
            lastBallElement.textContent = "0";
            lastBallElement.className = "mt-0.5 text-3xl font-semibold text-slate-400 tabular-nums animate-pop-in";
            setMessage("Dot ball.");
        }

        isAnimating = false;
        setControlsEnabled(true);
    }, 1050);
};

controls.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => playGame(Number(btn.dataset.value)));
});

document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key >= "0" && e.key <= "6") playGame(Number(e.key));
    else if (e.key.toLowerCase() === "r") resetGame();
    else if (e.key.toLowerCase() === "t") themeToggle.click();
});

bestScoreElement.textContent = bestScore;
resetGame();
