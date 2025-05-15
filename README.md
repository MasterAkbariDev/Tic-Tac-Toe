Tic-Tac-Toe
A dynamic and interactive Tic-Tac-Toe game built with JavaScript, featuring both Player vs Player (PvP) and Player vs Computer (PvC) modes. The project demonstrates algorithmic proficiency through the implementation of the Minimax algorithm and a memory-based decision-making system for the computer player.
Features

Customizable Board Size: Play on any NxN board (N > 2) for increased flexibility and challenge.
Game Modes:
PvP Mode: Compete against another player.
PvC Mode: Challenge an AI opponent with two difficulty levels:
Hard Mode: Uses the Minimax algorithm to ensure optimal moves, making the computer unbeatable.
Normal Mode: Employs a heuristic approach enhanced with memory-based decision-making, leveraging past game statistics for smarter moves.

Memory-Based AI: In normal mode, the computer learns from previous games stored in localStorage, prioritizing moves that historically led to wins or subreddit draws.
Interactive UI:
Visual feedback with animated X and O symbols.
Draws a winning line to highlight the victorious combination.
Displays real-time scores for players, computer, and draws.

Game History: Saves up to 100 recent games in localStorage for move analysis and AI improvement.
Responsive Design: Grid-based layout adapts to different board sizes.
Restart and Reset: Easily restart a game or start a new one with different settings.

Technologies Used

JavaScript: Core logic for game mechanics and AI.
HTML/CSS: Responsive UI with dynamic grid layout.
LocalStorage: Persistent storage for game history and move statistics.

Installation

Clone the Repository:git clone https://github.com/MasterAkbariDev/Tic-Tac-Toe.git

Navigate to the Project Directory:cd tic-tac-toe

Serve the Application:
Use a local server (e.g., with VS Code's Live Server extension) or open index.html in a browser.
Alternatively, install a simple HTTP server:npm install -g http-server
http-server

Access the game at http://localhost:8080.

Usage

Start the Game:
Enter a board size (N > 2) in the input field.
Check "Player First" to decide who starts (player or computer).
Check "PvP" for Player vs Player mode or leave unchecked for Player vs Computer.
Click "Start" to begin.

Play:
Click on cells to place your move ('X' or 'O').
In PvC mode, the computer responds automatically.
Toggle "Hard Mode" for Minimax-based AI or use normal mode for memory-based AI.

View Results:
Scores update in real-time for wins and draws.
A winning line highlights the victorious combination.

Restart:
Click "Restart" to reset the board and start a new game.

Project Structure

index.html: Main HTML file for the game UI.
styles.css: CSS for styling the board and UI elements.
decision-making.js: Core game logic, including Minimax, memory-based AI, and game state management.
TicTacToe.js: UI interaction and game flow management.

Algorithmic Highlights

Minimax Algorithm: Ensures the computer is unbeatable in hard mode by evaluating all possible game outcomes.
Memory-Based Decision-Making: In normal mode, the AI uses statistics from past games to prioritize moves with higher win/draw probabilities, demonstrating adaptive learning.
Efficient Board Management: Supports NxN boards with dynamic generation of winning combinations.

Limitations

The Minimax algorithm in hard mode may slow down for very large boards (e.g., N > 5) due to the lack of Alpha-Beta Pruning.
Normal mode AI relies on sufficient game history for optimal performance.

Future Improvements

Implement Alpha-Beta Pruning to optimize Minimax for larger boards.
Add unit tests using Jest to ensure code reliability.
Enhance UI with animations and sound effects.
Support multiplayer over a network using WebSockets.