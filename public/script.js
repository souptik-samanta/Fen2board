class ChessUI {
    constructor() {
        this.selectedSquare = null;
        this.currentFen = null;
        this.pieceImages = {
            'k': 'bk.png',
            'q': 'bq.png',
            'r': 'br.png',
            'b': 'bb.png',
            'n': 'bn.png',
            'p': 'bp.png',
            'K': 'wk.png',
            'Q': 'wq.png',
            'R': 'wr.png',
            'B': 'wb.png',
            'N': 'wn.png',
            'P': 'wp.png'
        };
        this.init();
    }

    init() {
        document.getElementById('initButton').addEventListener('click', () => this.initializeBoard());
        
        document.querySelectorAll('.load-fen').forEach(button => {
            button.addEventListener('click', (e) => {
                const fen = e.target.closest('.fen-example').dataset.fen;
                document.getElementById('fenInput').value = fen;
                this.initializeBoard();
            });
        });

        const defaultFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
        document.getElementById('fenInput').value = defaultFen;
    }

    async initializeBoard() {
        const fen = document.getElementById('fenInput').value;
        try {
            const response = await fetch('/api/initBoard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fen })
            });
            const data = await response.json();
            
            if (data.error) {
                this.showError(data.error);
                return;
            }
            
            this.currentFen = data.fen;
            this.renderBoard(data.board);
            this.updateStatus(data.turn);
            this.clearError();
        } catch (error) {
            this.showError('Error initializing board');
        }
    }

    renderBoard(board) {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const square = document.createElement('div');
                square.className = `square ${(rank + file) % 2 === 0 ? 'white' : 'black'}`;
                square.dataset.rank = rank;
                square.dataset.file = file;
                
                const piece = board[rank][file];
                if (piece) {
                    const img = document.createElement('img');
                    img.src = `img/${this.pieceImages[piece]}`;
                    img.alt = piece;
                    square.appendChild(img);
                }
                
                square.onclick = () => this.handleSquareClick(square);
                boardElement.appendChild(square);
            }
        }
    }

    async handleSquareClick(square) {
        if (this.selectedSquare === null) {
            if (square.querySelector('img')) {
                this.selectedSquare = square;
                square.classList.add('selected');
            }
        } else {
            const startFile = String.fromCharCode(97 + parseInt(this.selectedSquare.dataset.file));
            const startRank = 8 - parseInt(this.selectedSquare.dataset.rank);
            const endFile = String.fromCharCode(97 + parseInt(square.dataset.file));
            const endRank = 8 - parseInt(square.dataset.rank);
            const move = `${startFile}${startRank}${endFile}${endRank}`;

            await this.makeMove(move);
            this.selectedSquare.classList.remove('selected');
            this.selectedSquare = null;
        }
    }

    async makeMove(move) {
        try {
            const response = await fetch('/api/makeMove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ move })
            });
            const data = await response.json();
            
            if (data.error) {
                this.showError(data.error);
                return;
            }
            
            this.currentFen = data.fen;
            this.renderBoard(data.board);
            this.updateStatus(data.turn);
            this.addMoveToHistory(move);
            this.clearError();
        } catch (error) {
            this.showError('Error making move');
        }
    }

    updateStatus(turn) {
        const status = document.getElementById('status');
        status.textContent = `Current turn: ${turn.charAt(0).toUpperCase() + turn.slice(1)}`;
    }

    addMoveToHistory(move) {
        const history = document.getElementById('moveHistory');
        const moveSpan = document.createElement('span');
        moveSpan.className = 'move';
        moveSpan.textContent = `${move} `;
        history.appendChild(moveSpan);
        history.scrollTop = history.scrollHeight;
    }

    showError(message) {
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }

    clearError() {
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }

    disableBoard() {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.style.pointerEvents = 'none';
        });
    }

    enableBoard() {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.style.pointerEvents = 'auto';
        });
    }

    clearSelection() {
        if (this.selectedSquare) {
            this.selectedSquare.classList.remove('selected');
            this.selectedSquare = null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChessUI();
});