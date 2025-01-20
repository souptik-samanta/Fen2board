# Chess Validator

A Node.js command-line tool for validating chess positions and moves using FEN (Forsyth–Edwards Notation) notation.

## Features

- Parse and validate FEN strings
- Display chess positions in ASCII format
- Make and validate chess moves
- Track game state including:
  - Current player's turn
  - Castling rights
  - En passant possibilities
  - Move counters
- Interactive command-line interface
- Support for standard chess notation

## Installation

1. Ensure you have Node.js installed on your system
2. Clone this repository or create a new directory
3. Create the required files:
   - `chessValidator.js`
   - `index.js`
4. Install dependencies:
```bash
npm init -y
```

## Usage

1. Start the program:
```bash
node index.js
```

2. Enter a FEN string when prompted. For example, use the starting position:
```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

3. Available commands:
   - Enter moves in the format `e2e4`
   - Type `board` to display current position
   - Type `fen` to input a new position
   - Type `exit` to quit

## FEN Format Explanation

FEN strings consist of six fields, separated by spaces:
1. Piece placement
2. Active color (`w` or `b`)
3. Castling availability
4. En passant target square
5. Halfmove clock
6. Fullmove number

Example FEN fields explained:
```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
|                                        | | |  | | |
Piece placement -------------------------+ | |  | | |
Active color (white) ---------------------+ |  | | |
Castling availability ---------------------+  | | |
En passant target square -------------------+ | |
Halfmove clock -------------------------------+ |
Fullmove number -------------------------------+
```

## Piece Notation

- White pieces: `K`(King), `Q`(Queen), `R`(Rook), `B`(Bishop), `N`(Knight), `P`(Pawn)
- Black pieces: `k`(King), `q`(Queen), `r`(Rook), `b`(Bishop), `n`(Knight), `p`(Pawn)
- Empty squares: Numbers 1-8 representing consecutive empty squares

## Example Session

```
Enter FEN position (or 'exit' to quit):
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

Current position:
  a b c d e f g h
8 r n b q k b n r 8
7 p p p p p p p p 7
6 . . . . . . . . 6
5 . . . . . . . . 5
4 . . . . . . . . 4
3 . . . . . . . . 3
2 P P P P P P P P 2
1 R N B Q K B N R 1
  a b c d e f g h

Enter move (e.g., e2e4):
e2e4

Made move! New position:
  a b c d e f g h
8 r n b q k b n r 8
7 p p p p p p p p 7
6 . . . . . . . . 6
5 . . . . . . . . 5
4 . . . . P . . . 4
3 . . . . . . . . 3
2 P P P P . P P P 2
1 R N B Q K B N R 1
  a b c d e f g h
```

## Features In Detail

### Move Validation
- Basic piece movement rules
- Pawn promotion
- Castling (kingside and queenside)
- En passant captures
- Move counting
- Turn tracking

### Board Display
- ASCII representation of the chess board
- Current position display
- Move history tracking
- Clear piece representation

### Error Handling
- Invalid FEN detection
- Illegal move prevention
- Input validation
- Clear error messages

## Limitations

- Does not validate check or checkmate
- Basic move validation only
- No move suggestion or analysis
- No game save/load functionality
- No PGN support

## Contributing

Feel free to submit issues and enhancement requests.
gh 

## License

This project is licensed under the MIT License - see the LICENSE file for details.