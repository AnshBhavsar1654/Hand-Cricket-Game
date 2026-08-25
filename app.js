let score = 0;
let ball = 0;
let isGameActive = true;
let isAnimating = false;
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

const setStatusChip = (text, accentClass = "") => {
    statusChip.textContent = text;
    statusChip.className =
        "absolute left-1/2 top-4 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-widest rounded-full px-3 py-1 transition-colors duration-300 bg-ink-800 border border-white/[0.06] " +
        (accentClass || "text-slate-500");
};

const renderHistory = () => {
    historyElement.innerHTML = history
        .map(h => `<span class="text-xs font-medium tabular-nums rounded-full px-2.5 py-1 border ${h.out ? "border-cpu/30 bg-cpu/10 text-cpu" : "border-white/10 bg-ink-800 text-slate-400"} animate-rise">${h.out ? "OUT" : `+${h.runs}`}</span>`)
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

const resetRound = () => {
    score = 0;
    ball = 0;
    history = [];
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
};

const handleGameOver = () => {
    isGameActive = false;
    ballLabelElement.textContent = "Innings";
    lastBallElement.textContent = "OUT";
    lastBallElement.className = "mt-0.5 text-3xl font-semibold text-cpu tabular-nums animate-pop-in";
    setStatusChip("Out", "text-cpu border-cpu/20");
    setMessage(`Out! You scored ${score}. Pick a number to start a new innings.`);
    document.body.classList.add("animate-shake");

    setTimeout(() => {
        document.body.classList.remove("animate-shake");
        resetRound();
        isGameActive = true;
        setControlsEnabled(true);
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
    setStatusChip("Ball " + ball);
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
            lastBallElement.className = "mt-0.5 text-3xl font-semibold text-white tabular-nums animate-pop-in";
            setStatusChip("Playing", "text-you border-you/20");
            setMessage(`${userChoice} run${userChoice > 1 ? "s" : ""}. Score: ${score}`);
        } else {
            lastBallElement.textContent = "0";
            lastBallElement.className = "mt-0.5 text-3xl font-semibold text-slate-500 tabular-nums animate-pop-in";
            setStatusChip("Playing", "text-you border-you/20");
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
    if (e.key >= "0" && e.key <= "6") playGame(Number(e.key));
});

bestScoreElement.textContent = bestScore;
resetRound();
