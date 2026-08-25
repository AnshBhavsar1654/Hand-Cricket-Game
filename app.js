let score = 0;
let isGameActive = true;
let isAnimating = false;
let bestScore = localStorage.getItem('bestScore') || 0;

const msgElement = document.querySelector("#message");
const scoreElement = document.querySelector("#score");
const lastBallElement = document.querySelector("#last-ball");
const bestScoreElement = document.querySelector("#best-score");
const playerHand = document.querySelector("#player-hand");
const cpuHand = document.querySelector("#cpu-hand");
const playerNum = document.querySelector("#player-num");
const cpuNum = document.querySelector("#cpu-num");
const controls = document.querySelector("#controls");

const HAND_COLORS = {
    player: { base: '#c7d2fe', dark: '#4f46e5', stroke: '#818cf8' },
    cpu: { base: '#fecdd3', dark: '#be123c', stroke: '#fb7185' }
};

const FINGER_X = [56, 78, 100, 122];
const UP_Y = 52;
const UP_H = 120;
const FOLD_Y = 136;
const FOLD_H = 34;

const handSVG = (side, count) => {
    const c = HAND_COLORS[side];
    const id = `grad-${side}-${count}`;
    const ups = [0, 0, 0, 0];
    for (let i = 0; i < Math.min(count, 4); i++) ups[i] = 1;
    const thumbOut = count >= 5;

    const fingers = FINGER_X.map((x, i) => ups[i]
        ? `<rect x="${x}" y="${UP_Y}" width="20" height="${UP_H}" rx="10" fill="url(#${id})" stroke="${c.stroke}" stroke-width="2"/>`
        : `<rect x="${x}" y="${FOLD_Y}" width="20" height="${FOLD_H}" rx="12" fill="url(#${id})" stroke="${c.dark}" stroke-width="2" opacity="0.85"/>`
    ).join('');

    const thumb = thumbOut
        ? `<rect x="-12" y="92" width="22" height="70" rx="11" fill="url(#${id})" stroke="${c.stroke}" stroke-width="2" transform="rotate(-40 -1 127)"/>`
        : `<rect x="34" y="164" width="26" height="44" rx="13" fill="url(#${id})" stroke="${c.dark}" stroke-width="2" opacity="0.85"/>`;

    return `
        <svg viewBox="-25 30 255 245" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
            <defs>
                <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="${c.base}"/>
                    <stop offset="1" stop-color="${c.dark}"/>
                </linearGradient>
            </defs>
            ${thumb}
            ${fingers}
            <rect x="54" y="148" width="94" height="92" rx="30" fill="url(#${id})" stroke="${c.stroke}" stroke-width="2"/>
            <rect x="82" y="230" width="40" height="45" rx="14" fill="url(#${id})"/>
            <rect x="72" y="176" width="58" height="14" rx="7" fill="rgba(14,16,21,0.25)"/>
        </svg>`;
};

const renderHand = (element, side, count) => {
    element.innerHTML = handSVG(side, count);
};

const popReveal = (element) => {
    element.classList.remove("animate-pop-in");
    void element.offsetWidth;
    element.classList.add("animate-pop-in");
};

const setMessage = (text) => {
    msgElement.textContent = text;
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

const setLastBall = (text, colorClass) => {
    lastBallElement.textContent = text;
    lastBallElement.className = `mt-0.5 text-3xl font-semibold tabular-nums ${colorClass} animate-pop-in`;
};

const resetRound = () => {
    score = 0;
    scoreElement.textContent = "0";
    playerNum.textContent = "–";
    cpuNum.textContent = "–";
    renderHand(playerHand, "player", 0);
    renderHand(cpuHand, "cpu", 0);
    setMessage("Pick a number to begin your innings.");
};

const handleGameOver = () => {
    isGameActive = false;
    setLastBall("OUT", "text-cpu");
    setMessage(`Out! You scored ${score}. Pick a number to start again.`);
    document.body.classList.add("animate-shake");

    setTimeout(() => {
        document.body.classList.remove("animate-shake");
        resetRound();
        isGameActive = true;
        setControlsEnabled(true);
    }, 2000);
};

const getComputerChoice = () => Math.floor(Math.random() * 7);

const playGame = (userChoice) => {
    if (!isGameActive || isAnimating) return;
    isAnimating = true;
    setControlsEnabled(false);

    const cpuChoice = getComputerChoice();

    playerNum.textContent = "?";
    cpuNum.textContent = "?";
    setMessage("Hands up…");

    renderHand(playerHand, "player", 0);
    renderHand(cpuHand, "cpu", 0);
    playerHand.classList.add("hand-bob");
    cpuHand.classList.add("hand-bob");

    setTimeout(() => {
        playerHand.classList.remove("hand-bob");
        cpuHand.classList.remove("hand-bob");

        renderHand(playerHand, "player", userChoice);
        renderHand(cpuHand, "cpu", cpuChoice);
        popReveal(playerHand);
        popReveal(cpuHand);
        playerNum.textContent = userChoice;
        cpuNum.textContent = cpuChoice;

        if (userChoice === cpuChoice) {
            updateBestScore();
            handleGameOver();
        } else {
            score += userChoice;
            scoreElement.textContent = score;
            updateBestScore();

            setLastBall(
                userChoice > 0 ? `+${userChoice}` : "0",
                userChoice > 0 ? "text-white" : "text-slate-500"
            );
            setMessage(
                userChoice > 0
                    ? `${userChoice} run${userChoice > 1 ? "s" : ""}. Score: ${score}`
                    : "Dot ball."
            );
        }

        isAnimating = false;
        if (isGameActive) setControlsEnabled(true);
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
