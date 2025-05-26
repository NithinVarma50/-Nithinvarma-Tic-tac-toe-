class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.isComputerOpponent = false;
        this.difficulty = 'easy';
        this.scores = { X: 0, O: 0 };
        this.currentRound = 1;
        this.totalRounds = 5;
        
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.cells = document.querySelectorAll('.cell');
        this.gameStatus = document.querySelector('.game-status');
        this.opponentSelect = document.getElementById('opponent-type');
        this.difficultySelect = document.getElementById('difficulty');
        this.startButton = document.getElementById('start-tournament');
        this.player1Score = document.querySelector('.player1-score span');
        this.player2Score = document.querySelector('.player2-score span');
        this.roundInfo = document.querySelector('.round-info span');
    }

    setupEventListeners() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });

        this.opponentSelect.addEventListener('change', () => {
            this.isComputerOpponent = this.opponentSelect.value === 'computer';
            this.difficultySelect.style.display = this.isComputerOpponent ? 'inline' : 'none';
        });

        this.startButton.addEventListener('click', () => this.startNewTournament());
    }

    startNewTournament() {
        this.scores = { X: 0, O: 0 };
        this.currentRound = 1;
        this.updateScoreDisplay();
        this.resetBoard();
        this.isComputerOpponent = this.opponentSelect.value === 'computer';
        this.difficulty = this.difficultySelect.value;
        this.gameStatus.textContent = `Round ${this.currentRound} - ${this.currentPlayer}'s turn`;
    }

    handleCellClick(cell) {
        const index = cell.dataset.index;
        if (this.board[index] || !this.gameActive) return;

        this.makeMove(index);
        
        if (this.isComputerOpponent && this.gameActive) {
            setTimeout(() => this.makeComputerMove(), 500);
        }
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.cells[index].textContent = this.currentPlayer;
        this.cells[index].classList.add(this.currentPlayer.toLowerCase());

        if (this.checkWin()) {
            this.handleWin();
        } else if (this.checkDraw()) {
            this.handleDraw();
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.gameStatus.textContent = `${this.currentPlayer}'s turn`;
        }
    }

    makeComputerMove() {
        let index;
        switch (this.difficulty) {
            case 'hard':
                index = this.getBestMove();
                break;
            case 'medium':
                index = Math.random() < 0.7 ? this.getBestMove() : this.getRandomMove();
                break;
            default: // easy
                index = this.getRandomMove();
        }
        this.makeMove(index);
    }

    getBestMove() {
        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < 9; i++) {
            if (!this.board[i]) {
                this.board[i] = 'O';
                let score = this.minimax(this.board, 0, false);
                this.board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }

    minimax(board, depth, isMaximizing) {
        const scores = {
            O: 10,
            X: -10,
            draw: 0
        };

        let result = this.checkGameEnd();
        if (result) return scores[result];

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (!board[i]) {
                    board[i] = 'O';
                    let score = this.minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (!board[i]) {
                    board[i] = 'X';
                    let score = this.minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    getRandomMove() {
        const emptyCells = this.board
            .map((cell, index) => cell === '' ? index : null)
            .filter(cell => cell !== null);
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return this.board[a] &&
                   this.board[a] === this.board[b] &&
                   this.board[a] === this.board[c];
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    checkGameEnd() {
        if (this.checkWin()) {
            return this.currentPlayer;
        } else if (this.checkDraw()) {
            return 'draw';
        }
        return null;
    }

    handleWin() {
        this.gameActive = false;
        this.scores[this.currentPlayer]++;
        this.updateScoreDisplay();
        this.gameStatus.textContent = `${this.currentPlayer} wins round ${this.currentRound}!`;
        
        setTimeout(() => this.prepareNextRound(), 1500);
    }

    handleDraw() {
        this.gameActive = false;
        this.gameStatus.textContent = `Round ${this.currentRound} is a draw!`;
        setTimeout(() => this.prepareNextRound(), 1500);
    }

    prepareNextRound() {
        this.currentRound++;
        if (this.currentRound <= this.totalRounds) {
            this.resetBoard();
            this.gameStatus.textContent = `Round ${this.currentRound} - ${this.currentPlayer}'s turn`;
        } else {
            this.endTournament();
        }
    }

    endTournament() {
        const winner = this.scores.X > this.scores.O ? 'X' :
                      this.scores.O > this.scores.X ? 'O' : 'Nobody';
        this.gameStatus.textContent = `Tournament ended! ${winner} wins the tournament!`;
    }

    resetBoard() {
        this.board = Array(9).fill('');
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
        this.gameActive = true;
        this.roundInfo.textContent = this.currentRound;
    }

    updateScoreDisplay() {
        this.player1Score.textContent = this.scores.X;
        this.player2Score.textContent = this.scores.O;
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});