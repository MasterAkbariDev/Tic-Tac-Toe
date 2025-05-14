🕹️ Tic Tac Toe Game
A dynamic and flexible Tic Tac Toe game supporting any board size (NxN), Player vs Player (PvP) and Player vs Computer (AI) modes, complete with live score tracking and game result detection.

🚀 Features
✅ Supports custom board sizes (e.g., 3x3, 4x4, etc.)

🧠 Play against another player or the computer

📊 Live score tracking for:

Player 1

Player 2 or Computer

Draws

🎯 Highlights the winning combination

📢 Displays game status: win, draw, or ongoing

📁 Project Structure
text
Copy
Edit
/
├── index.html # HTML with scoreboard and game container
├── style.css # Styling for board, scoreboard, and animations
├── script.js # Main game logic, events, rendering
└── utils.js # Includes checkState(), generateWiningCombination(), etc.
🧠 Core Logic (checkState())
The checkState() function:

Checks for winning combinations after each move.

Determines the winner by evaluating if all values in a win combo are either "X" or "O".

Increments the score for the winning side.

Updates scoreboard text content accordingly.

Detects draw situations.

Shows messages via showGameStatus() and highlights winning cells using drawWinningLine().

🛠️ How to Use
Clone or download this repository.

Open index.html in a browser.

Click on a cell to make a move.

Play alternately as:

Player 1 (X) and Player 2 (O) in PvP mode.

Player (X) and Computer (O) in PvC mode.

View live scores in the scoreboard above the game board.

🧩 Example DOM Elements
Ensure these elements exist in your HTML for score tracking:

html
Copy
Edit

<div id="player-1">Player 1 Score: 0</div>
<div id="player-2">Player 2 Score: 0</div> <!-- or "Computer Score: 0" -->
<div id="draw">0</div>
📌 Notes
The game assumes each cell object has a .value and .index property.

The board is a 2D array: board[row][col].

Scores are extracted using regex to ensure accurate parsing.
