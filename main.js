class MemoryGame extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.emojis = ['🚀', '🪐', '👽', '☄️', '🌑', '🌟', '🛸', '🛰️'];
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.seconds = 0;
        this.timer = null;
        this.isLocked = false;
        
        // Bind methods
        this.startGame = this.startGame.bind(this);
        this.updateTimer = this.updateTimer.bind(this);
        this.flipCard = this.flipCard.bind(this);
    }

    connectedCallback() {
        this.render();
        this.startGame();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2rem;
                width: 100%;
                max-width: 800px;
                animation: fadeIn 0.8s ease-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .stats-bar {
                display: flex;
                justify-content: center;
                gap: 1.5rem;
                width: 100%;
            }

            .stat-item {
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(12px);
                padding: 0.6rem 1.8rem;
                border-radius: 50px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                flex-direction: column;
                align-items: center;
                min-width: 110px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }

            .label { font-size: 0.75rem; text-transform: uppercase; opacity: 0.7; letter-spacing: 1px; }
            .value { font-size: 1.3rem; font-weight: 600; font-family: 'Poppins', sans-serif; color: #fff; }

            .game-board {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 15px;
                perspective: 1200px;
                width: 100%;
                max-width: 500px;
                margin: 0 auto;
            }

            .card {
                background: none;
                border: none;
                padding: 0;
                aspect-ratio: 3/4;
                cursor: pointer;
                outline: none;
                position: relative;
                width: 100%;
                perspective: 1000px;
            }

            .card-inner {
                position: relative;
                width: 100%;
                height: 100%;
                text-align: center;
                transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                transform-style: preserve-3d;
                border-radius: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }

            .card.flipped .card-inner {
                transform: rotateY(180deg);
            }

            .card.matched .card-inner {
                box-shadow: 0 0 20px rgba(0, 255, 204, 0.6);
                animation: pop 0.4s ease;
            }

            @keyframes pop {
                0% { transform: rotateY(180deg) scale(1); }
                50% { transform: rotateY(180deg) scale(1.1); }
                100% { transform: rotateY(180deg) scale(1); }
            }

            .card-face {
                position: absolute;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
                border-radius: 14px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 2.8rem;
                border: 1px solid rgba(255, 255, 255, 0.15);
            }

            .face-down {
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                background-image: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px);
                background-size: 20px 20px;
                color: #fff;
            }

            .face-down::after {
                content: "✦";
                font-size: 1.5rem;
                opacity: 0.3;
            }

            .face-up {
                background: rgba(255, 255, 255, 0.95);
                color: #1a1a1a;
                transform: rotateY(180deg);
            }

            .controls {
                margin-top: 1rem;
            }

            .btn {
                background: linear-gradient(45deg, #00c6ff, #0072ff);
                border: none;
                padding: 14px 35px;
                border-radius: 50px;
                color: white;
                font-family: 'Poppins', sans-serif;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-shadow: 0 8px 15px rgba(0, 114, 255, 0.3);
                display: flex;
                align-items: center;
                gap: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .btn:hover {
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 12px 20px rgba(0, 114, 255, 0.4);
            }

            .btn:active { transform: translateY(0); }

            /* Modal */
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.85);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                backdrop-filter: blur(8px);
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.5s ease;
            }

            .modal.visible {
                opacity: 1;
                pointer-events: auto;
            }

            .modal-content {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(25px);
                padding: 3.5rem;
                border-radius: 30px;
                text-align: center;
                border: 1px solid rgba(255,255,255,0.2);
                box-shadow: 0 0 50px rgba(0,0,0,0.5);
                max-width: 90%;
                width: 450px;
                transform: scale(0.8);
                transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }

            .modal.visible .modal-content { transform: scale(1); }

            .modal h2 { font-size: 2.5rem; margin-bottom: 0.5rem; color: #fff; text-shadow: 0 0 10px rgba(0,255,204,0.5); }
            .modal p { color: #ccc; margin-bottom: 2rem; }

            .final-stats {
                display: flex;
                justify-content: space-around;
                margin-bottom: 2.5rem;
                background: rgba(255,255,255,0.05);
                padding: 1.5rem;
                border-radius: 20px;
            }

            .final-stat { display: flex; flex-direction: column; gap: 0.3rem; }
            .final-stat .label { font-size: 0.7rem; opacity: 0.6; }
            .final-stat .value { font-size: 1.5rem; font-weight: 700; color: #00ffcc; }

            /* Responsive */
            @media (max-width: 500px) {
                .game-board {
                    grid-template-columns: repeat(4, 1fr); /* 4x4 is small enough for 4 columns usually */
                    gap: 8px;
                }
                .face-up { font-size: 2rem; }
            }
            
            @media (max-width: 380px) {
                .game-board {
                    grid-template-columns: repeat(3, 1fr); /* 3 columns for very small screens */
                }
            }
        </style>

        <div class="stats-bar">
            <div class="stat-item">
                <span class="label">Moves</span>
                <span class="value" id="moves">0</span>
            </div>
            <div class="stat-item">
                <span class="label">Time</span>
                <span class="value" id="timer">00:00</span>
            </div>
        </div>

        <div class="game-board" id="board"></div>

        <div class="controls">
            <button class="btn" id="restartBtn">
                <span>↺</span> Restart
            </button>
        </div>

        <div class="modal" id="winModal">
            <div class="modal-content">
                <h2>Victory! 🎉</h2>
                <p>You've successfully explored the cosmos.</p>
                <div class="final-stats">
                    <div class="final-stat">
                        <span class="label">Moves</span>
                        <span class="value" id="finalMoves">0</span>
                    </div>
                    <div class="final-stat">
                        <span class="label">Time</span>
                        <span class="value" id="finalTime">00:00</span>
                    </div>
                </div>
                <button class="btn" id="playAgainBtn">Play Again</button>
            </div>
        </div>
        `;
        
        // Setup references
        this.board = this.shadowRoot.getElementById('board');
        this.movesEl = this.shadowRoot.getElementById('moves');
        this.timerEl = this.shadowRoot.getElementById('timer');
        this.winModal = this.shadowRoot.getElementById('winModal');
        this.finalMovesEl = this.shadowRoot.getElementById('finalMoves');
        this.finalTimeEl = this.shadowRoot.getElementById('finalTime');
        
        this.shadowRoot.getElementById('restartBtn').onclick = this.startGame;
        this.shadowRoot.getElementById('playAgainBtn').onclick = this.startGame;
    }

    startGame() {
        this.isLocked = false;
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.seconds = 0;
        
        this.movesEl.textContent = this.moves;
        this.timerEl.textContent = this.formatTime(0);
        this.winModal.classList.remove('visible');
        
        clearInterval(this.timer);
        this.timer = setInterval(this.updateTimer, 1000);

        const shuffledEmojis = this.shuffle([...this.emojis, ...this.emojis]);
        this.board.innerHTML = '';
        
        shuffledEmojis.forEach((emoji, index) => {
            const card = document.createElement('button');
            card.classList.add('card');
            card.setAttribute('aria-label', 'Memory card');
            card.dataset.emoji = emoji;
            card.dataset.id = index;
            
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-face face-down"></div>
                    <div class="card-face face-up">${emoji}</div>
                </div>
            `;
            
            card.onclick = () => this.flipCard(card);
            this.board.appendChild(card);
        });
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    formatTime(t) {
        const m = Math.floor(t / 60).toString().padStart(2, '0');
        const s = (t % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    updateTimer() {
        this.seconds++;
        this.timerEl.textContent = this.formatTime(this.seconds);
    }

    flipCard(card) {
        if (this.isLocked || this.flippedCards.includes(card) || card.classList.contains('matched')) {
            return;
        }

        card.classList.add('flipped');
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.movesEl.textContent = this.moves;
            this.checkMatch();
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const match = card1.dataset.emoji === card2.dataset.emoji;

        if (match) {
            this.handleMatch(card1, card2);
        } else {
            this.handleMismatch(card1, card2);
        }
    }

    handleMatch(c1, c2) {
        c1.classList.add('matched');
        c2.classList.add('matched');
        this.matchedPairs++;
        this.flippedCards = [];

        if (this.matchedPairs === this.emojis.length) {
            this.endGame();
        }
    }

    handleMismatch(c1, c2) {
        this.isLocked = true;
        setTimeout(() => {
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
            this.flippedCards = [];
            this.isLocked = false;
        }, 1000);
    }

    endGame() {
        clearInterval(this.timer);
        setTimeout(() => {
            this.finalMovesEl.textContent = this.moves;
            this.finalTimeEl.textContent = this.formatTime(this.seconds);
            this.winModal.classList.add('visible');
        }, 600);
    }
}

customElements.define('memory-game', MemoryGame);
