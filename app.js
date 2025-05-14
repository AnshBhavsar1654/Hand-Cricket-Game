let score = 0;
let isGameActive = true;
let bestScore = localStorage.getItem('bestScore') || 0;

const choices = document.querySelectorAll(".choice");
const msgElement = document.querySelector("#message");
const scoreElement = document.querySelector("#score");
const computerChoiceElement = document.querySelector("#computer-choice");
const bestScoreElement = document.querySelector("#best-score");

// Initialize best score display
bestScoreElement.textContent = bestScore;

const showComputerChoice = (choice) => {
    // Fixed computer choice display using pointsMap
    const choiceValue = pointsMap[choice];
    computerChoiceElement.textContent = choiceValue;
    computerChoiceElement.parentElement.style.display = "block";
};

const updateBestScore = () => {
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
        bestScoreElement.textContent = bestScore;
    }
};

const resetGame = () => {
    score = 0;
    scoreElement.textContent = "0";
    computerChoiceElement.parentElement.style.display = "none";
    msgElement.textContent = "Tap a number to start playing!";
    msgElement.style.backgroundColor = "#2ecc71";
};

const handleGameOver = () => {
    isGameActive = false;
    msgElement.textContent = "Game Over! Click any number to restart";
    msgElement.style.backgroundColor = "#e74c3c";
    
    setTimeout(() => {
        resetGame();
        isGameActive = true;
    }, 2000);
};

const getComputerChoice = () => {
    const options = ["zero", "one", "two", "three", "four", "five", "six"];
    return options[Math.floor(Math.random() * 7)];
};

const pointsMap = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6
};

choices.forEach(choice => {
    choice.addEventListener("click", () => {
        if (!isGameActive) return;

        // Add click animation
        choice.classList.add("selected");
        setTimeout(() => choice.classList.remove("selected"), 200);

        const userChoice = choice.id;
        playGame(userChoice);
    });
});

const playGame = (userChoice) => {
    const computerChoice = getComputerChoice();
    showComputerChoice(computerChoice);

    if (userChoice === computerChoice) {
        updateBestScore();
        handleGameOver();
    } else {
        const points = pointsMap[userChoice];
        score += points;
        scoreElement.textContent = score;
        updateBestScore();

        msgElement.textContent = points > 0 
            ? `+${points}! Score: ${score}` 
            : "Safe move! Play again";
        msgElement.style.backgroundColor = "#2ecc71";
    }
};