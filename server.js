const express = require('express');
const app = express();
const ChessValidator = require('./chess');

app.use(express.static('public'));
app.use(express.json());

let chess = null;

app.post('/api/initBoard', (req, res) => {
    try {
        const { fen } = req.body;
        chess = new ChessValidator(fen);
        res.json({
            board: chess.getBoard(),
            fen: chess.getFEN(),
            turn: chess.whiteToMove ? 'white' : 'black'
        });
    } catch (e) {
        res.status(400).json({ error: 'Invalid FEN' });
    }
});

app.post('/api/makeMove', (req, res) => {
    try {
        const { move } = req.body;
        if (!chess) {
            return res.status(400).json({ error: 'No game in progress' });
        }
        chess.makeMove(move);
        res.json({
            board: chess.getBoard(),
            fen: chess.getFEN(),
            turn: chess.whiteToMove ? 'white' : 'black'
        });
    } catch (e) {
        res.status(400).json({ error: 'Invalid move' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});