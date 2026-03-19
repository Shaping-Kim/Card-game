const cardsArray = [
    { name: 'A', id: 1 },
    { name: 'B', id: 2 },
    { name: 'C', id: 3 },
    { name: 'D', id: 4 },
    { name: 'E', id: 5 },
    { name: 'F', id: 6 },
    { name: 'G', id: 7 },
    { name: 'H', id: 8 },
];

const gameBoard = document.querySelector('.game-board');
const movesSpan = document.querySelector('.moves');
const timerSpan = document.querySelector('.timer');
const restartBtn = document.querySelector('.restart-btn');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let timer;
let seconds = 0;

function shuffle(array) {
    array.sort(() => 0.5 - Math.random());
}

function startGame() {
    moves = 0;
    seconds = 0;
    movesSpan.textContent = `Moves: ${moves}`;
    timerSpan.textContent = `Time: ${seconds}s`;
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);

    gameBoard.innerHTML = '';
    const gameCards = [...cardsArray, ...cardsArray];
    shuffle(gameCards);

    gameCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = card.name;

        cardElement.innerHTML = `
            <div class="card-face card-front">?</div>
            <div class="card-face card-back">${card.name}</div>
        `;

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    movesSpan.textContent = `Moves: ${moves}`;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function updateTimer() {
    seconds++;
    timerSpan.textContent = `Time: ${seconds}s`;
}

restartBtn.addEventListener('click', startGame);

startGame();
