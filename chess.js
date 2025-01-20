const readline = require('readline');

class ChessValidator {
    constructor(fen) {
        this.board = Array(8).fill().map(() => Array(8).fill(0));
        this.castlingRights = Array(4).fill(false);
        this.parseFEN(fen);
    }

    parseFEN(fen) {
        const parts = fen.split(' ');
        const position = parts[0];
        
        let rank = 0;
        let file = 0;
        
        for (const c of position) {
            if (c === '/') {
                rank++;
                file = 0;
            } else if (!isNaN(c)) {
                file += parseInt(c);
            } else {
                this.board[rank][file] = c;
                file++;
            }
        }

        this.whiteToMove = parts[1] === 'w';

        if (parts[2] !== '-') {
            for (const c of parts[2]) {
                switch (c) {
                    case 'K': this.castlingRights[0] = true; break;
                    case 'Q': this.castlingRights[1] = true; break;
                    case 'k': this.castlingRights[2] = true; break;
                    case 'q': this.castlingRights[3] = true; break;
                }
            }
        }

        if (parts[3] !== '-') {
            this.enPassantSquare = [
                '8'.charCodeAt(0) - parts[3].charAt(1).charCodeAt(0),
                parts[3].charCodeAt(0) - 'a'.charCodeAt(0)
            ];
        } else {
            this.enPassantSquare = null;
        }

        this.halfMoveClock = parseInt(parts[4]);
        this.fullMoveNumber = parseInt(parts[5]);
    }

    makeMove(move) {
        const startFile = move.charCodeAt(0) - 'a'.charCodeAt(0);
        const startRank = '8'.charCodeAt(0) - move.charCodeAt(1);
        const endFile = move.charCodeAt(2) - 'a'.charCodeAt(0);
        const endRank = '8'.charCodeAt(0) - move.charCodeAt(3);

        const piece = this.board[startRank][startFile];
        const capturedPiece = this.board[endRank][endFile];

        if (piece.toLowerCase() === 'p' || capturedPiece !== 0) {
            this.halfMoveClock = 0;
        } else {
            this.halfMoveClock++;
        }

        // Handle en passant capture
        if (piece.toLowerCase() === 'p' && 
            this.enPassantSquare &&
            endFile === this.enPassantSquare[1] && 
            endRank === this.enPassantSquare[0]) {
            this.board[startRank][endFile] = 0;
        }

        // Handle castling
        if (piece.toLowerCase() === 'k' && Math.abs(endFile - startFile) === 2) {
            const rookStartFile = endFile > startFile ? 7 : 0;
            const rookEndFile = endFile > startFile ? endFile - 1 : endFile + 1;
            const rook = this.board[startRank][rookStartFile];
            this.board[startRank][rookStartFile] = 0;
            this.board[startRank][rookEndFile] = rook;
        }

        this.updateCastlingRights(startRank, startFile, endRank, endFile);

        this.board[endRank][endFile] = piece;
        this.board[startRank][startFile] = 0;

        if (piece.toLowerCase() === 'p' && Math.abs(startRank - endRank) === 2) {
            this.enPassantSquare = [(startRank + endRank) / 2, startFile];
        } else {
            this.enPassantSquare = null;
        }

        if (!this.whiteToMove) {
            this.fullMoveNumber++;
        }
        this.whiteToMove = !this.whiteToMove;
    }

    updateCastlingRights(startRank, startFile, endRank, endFile) {
        if (this.board[startRank][startFile] === 'K') {
            this.castlingRights[0] = false;
            this.castlingRights[1] = false;
        } else if (this.board[startRank][startFile] === 'k') {
            this.castlingRights[2] = false;
            this.castlingRights[3] = false;
        }

        if (startRank === 0 && startFile === 0) this.castlingRights[3] = false;
        if (startRank === 0 && startFile === 7) this.castlingRights[2] = false;
        if (startRank === 7 && startFile === 0) this.castlingRights[1] = false;
        if (startRank === 7 && startFile === 7) this.castlingRights[0] = false;

        if (endRank === 0 && endFile === 0) this.castlingRights[3] = false;
        if (endRank === 0 && endFile === 7) this.castlingRights[2] = false;
        if (endRank === 7 && endFile === 0) this.castlingRights[1] = false;
        if (endRank === 7 && endFile === 7) this.castlingRights[0] = false;
    }

    getFEN() {
        let fen = '';
        
        for (let rank = 0; rank < 8; rank++) {
            let emptyCount = 0;
            for (let file = 0; file < 8; file++) {
                if (this.board[rank][file] === 0) {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        fen += emptyCount;
                        emptyCount = 0;
                    }
                    fen += this.board[rank][file];
                }
            }
            if (emptyCount > 0) {
                fen += emptyCount;
            }
            if (rank < 7) {
                fen += '/';
            }
        }

        fen += ' ' + (this.whiteToMove ? 'w' : 'b');

        fen += ' ';
        let hasCastling = false;
        if (this.castlingRights[0]) { fen += 'K'; hasCastling = true; }
        if (this.castlingRights[1]) { fen += 'Q'; hasCastling = true; }
        if (this.castlingRights[2]) { fen += 'k'; hasCastling = true; }
        if (this.castlingRights[3]) { fen += 'q'; hasCastling = true; }
        if (!hasCastling) { fen += '-'; }

        fen += ' ';
        if (this.enPassantSquare !== null) {
            fen += String.fromCharCode('a'.charCodeAt(0) + this.enPassantSquare[1]);
            fen += String.fromCharCode('8'.charCodeAt(0) - this.enPassantSquare[0]);
        } else {
            fen += '-';
        }

        fen += ' ' + this.halfMoveClock;
        fen += ' ' + this.fullMoveNumber;

        return fen;
    }

    printBoard() {
        console.log('  a b c d e f g h');
        for (let rank = 0; rank < 8; rank++) {
            process.stdout.write(`${8 - rank} `);
            for (let file = 0; file < 8; file++) {
                const piece = this.board[rank][file];
                process.stdout.write(`${piece === 0 ? '.' : piece} `);
            }
            console.log(8 - rank);
        }
        console.log('  a b c d e f g h');
        console.log(`Current turn: ${this.whiteToMove ? 'White' : 'Black'}`);
    }
}

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (query) => new Promise((resolve) => rl.question(query, resolve));

    let chess = null;

    while (true) {
        if (chess === null) {
            const fen = await question('\nEnter FEN position (or \'exit\' to quit):\n');
            
            if (fen.toLowerCase() === 'exit') {
                break;
            }

            try {
                chess = new ChessValidator(fen);
                console.log('\nCurrent position:');
                chess.printBoard();
            } catch (e) {
                console.log('Invalid fein');
                continue;
            }
        }

        const input = await question('\nEnter move or:\n- \'fen\' to input new position\n- \'board\' to show current position\n- \'exit\' to quit\n');

        if (input.toLowerCase() === 'exit') {
            break;
        } else if (input.toLowerCase() === 'fen') {
            chess = null;
            continue;
        } else if (input.toLowerCase() === 'board') {
            chess.printBoard();
            console.log('Current FEN:', chess.getFEN());
            continue;
        }

        try {
            if (input.length === 4) {
                chess.makeMove(input);
                console.log('Move done new pos;');
                chess.printBoard();
                console.log('New FEN:', chess.getFEN());
            } else {
                console.log('Bruh wtf use \'e2e4\'');
            }
        } catch (e) {
            console.log('Error making move! Try again.');
        }
    }
    
    console.log('bye!');
    rl.close();
}

main();