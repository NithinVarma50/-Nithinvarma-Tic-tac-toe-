class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.cells = document.querySelectorAll('.cell');
        this.gameStatus = document.querySelector('.game-status');
    }

    setupEventListeners() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });
    }

    handleCellClick(cell) {
        const index = cell.dataset.index;
        if (this.board[index] || !this.gameActive) return;

        this.makeMove(index);
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.cells[index].textContent = this.currentPlayer;
        this.cells[index].classList.add(this.currentPlayer.toLowerCase());

        if (this.checkWin()) {
            this.gameActive = false;
            this.gameStatus.textContent = `${this.currentPlayer} wins!`;
        } else if (this.checkDraw()) {
            this.gameActive = false;
            this.gameStatus.textContent = "Game is a draw!";
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.gameStatus.textContent = `${this.currentPlayer}'s turn`;
        }
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
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});