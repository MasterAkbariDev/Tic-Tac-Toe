// Array to store the current game's moves (index and player)
let currentMoves = [];

// Flag to indicate if the player is blocked from making a move
export let isPlayerBlocked = false;

// Object to store move statistics for memory-based decision-making
let moveStats = JSON.parse(localStorage.getItem('moveStats') || '{}');

/**
 * Generates a new game board of size n x n.
 * @param {number} n - The size of the board.
 * @returns {Array} - A 2D array representing the board.
 */
export function generateTable(n) {
    isPlayerBlocked = false;
    currentMoves = [];
    return Array.from({ length: n }, (_, row) =>
        Array.from({ length: n }, (_, col) => ({
            index: row * n + col,
            value: null,
        }))
    );
}

/**
 * Generates all possible winning combinations for an n x n board.
 * @param {number} n - The size of the board.
 * @returns {Array} - An array of winning combinations.
 */
export function generateWiningCombination(n) {
    const combos = [];

    // Add horizontal winning combinations (rows)
    for (let r = 0; r < n; r++) {
        combos.push([...Array(n)].map((_, c) => r * n + c));
    }

    // Add vertical winning combinations (columns)
    for (let c = 0; c < n; c++) {
        combos.push([...Array(n)].map((_, r) => r * n + c));
    }

    // Add diagonal winning combinations
    combos.push([...Array(n)].map((_, i) => i * n + i)); // Top-left to bottom-right
    combos.push([...Array(n)].map((_, i) => i * n + (n - 1 - i))); // Top-right to bottom-left

    return combos;
}

/**
 * Flattens the 2D board into a 1D array of cell values.
 * @param {Array} board - The 2D board array.
 * @returns {Array} - A 1D array of cell values.
 */
function flattenBoard(board) {
    return board.flat().map(cell => cell.value);
}

/**
 * Converts the board state to a unique string key for move statistics.
 * @param {Array} board - The current board state.
 * @returns {string} - A unique key representing the board state.
 */
function boardToKey(board) {
    return flattenBoard(board).map(v => v || ' ').join('');
}

/**
 * Checks the current state of the game and updates scores if there's a winner or a draw.
 * @param {Array} board - The current board state.
 * @param {number} n - The size of the board.
 * @param {boolean} isPvP - Whether the game is Player vs Player.
 * @returns {boolean} - True if the game is finished, false otherwise.
 */
export function checkState(board, n, isPvP = false) {
    const combos = generateWiningCombination(n);
    let isGameFinished = false;
    const player1Scores = document.getElementById('player-1');
    const player2Scores = document.getElementById('player-2');
    const drawScores = document.getElementById('draw');

    // Check each winning combination
    for (const combo of combos) {
        const cells = combo.map(idx => board[Math.floor(idx / n)][idx % n]);
        const values = cells.map(cell => cell.value);

        // If a winning combination is found
        if (values.every(v => v === "X") || values.every(v => v === "O")) {
            let winner = null;
            if (isPvP) {
                winner = values[0] === "X" ? "Player 1" : 'Player 2';
                if (winner === "Player 1") {
                    player1Scores.textContent = `Player 1 Score: ${(Number(player1Scores.textContent.split(':')[1]) || 0) + 1}`;
                } else {
                    player2Scores.textContent = `Player 2 Score: ${(Number(player2Scores.textContent.split(':')[1]) || 0) + 1}`;
                }
            } else {
                winner = values[0] === "X" ? "Player" : "Computer";
                if (winner === "Player") {
                    player1Scores.textContent = `Player Score: ${(Number(player1Scores.textContent.split(':')[1]) || 0) + 1}`;
                } else {
                    player2Scores.textContent = `Computer Score: ${(Number(player2Scores.textContent.split(':')[1]) || 0) + 1}`;
                }
            }

            showGameStatus(`${winner} wins!`);
            drawWinningLine(cells[0].index, cells[cells.length - 1].index, n);
            isGameFinished = true;

            // Save the game history for learning
            saveGameHistory(currentMoves, winner);
        }
    }

    if (isGameFinished) return true;

    // Check for a draw
    const isDraw = board.every(row => row.every(cell => cell.value !== null));
    if (isDraw) {
        showGameStatus("Draw!");
        drawScores.textContent = `Draw Score: ${(Number(drawScores.textContent.split(':')[1]) || 0) + 1}`;

        // Save the draw result
        saveGameHistory(currentMoves, "Draw");
        return true;
    }

    return false;
}

/**
 * Draws the winning line on the board.
 * @param {number} startIdx - The starting index of the winning line.
 * @param {number} endIdx - The ending index of the winning line.
 * @param {number} n - The size of the board.
 */
function drawWinningLine(startIdx, endIdx, n) {
    const board = document.getElementById("board");
    const cells = board.querySelectorAll(".cell");

    const start = cells[startIdx].getBoundingClientRect();
    const end = cells[endIdx].getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();

    const x1 = start.left + start.width / 2 - boardRect.left;
    const y1 = start.top + start.height / 2 - boardRect.top;
    const x2 = end.left + end.width / 2 - boardRect.left;
    const y2 = end.top + end.height / 2 - boardRect.top;

    const line = document.createElement("div");
    Object.assign(line.style, {
        position: "absolute",
        left: `${x1}px`,
        top: `${y1}px`,
        width: `${Math.hypot(x2 - x1, y2 - y1)}px`,
        height: "4px",
        backgroundColor: "red",
        transform: `rotate(${Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI}deg)`,
        transformOrigin: "left center",
        zIndex: 10,
        pointerEvents: "none"
    });
    line.classList.add("win-line");
    board.appendChild(line);
}

/**
 * Places a move on the board and updates the UI.
 * @param {number} index - The index of the cell to place the move.
 * @param {string} value - The value to place ('X' or 'O').
 * @param {Array} board - The current board state.
 */
export function placeMove(index, value, board) {
    drawXOrO(index, value);
    const cell = board.flat().find(c => c.index === index);
    if (cell) cell.value = value;

    // Record the move in the current game history
    currentMoves.push({ index, player: value });

    isPlayerBlocked = value === 'X';
}

/**
 * Draws an X or O in the specified cell.
 * @param {number} index - The index of the cell.
 * @param {string} value - The value to draw ('X' or 'O').
 */
function drawXOrO(index, value) {
    const cell = document.getElementById(`cell-${index}`);
    if (!cell || cell.querySelector("svg")) return;

    cell.classList.add("disabled");
    cell.innerHTML = value === "X"
        ? `<svg viewBox="0 0 100 100" class="draw-x">
                <line x1="10" y1="10" x2="90" y2="90" />
                <line x1="90" y1="10" x2="10" y2="90" />
            </svg>`
        : `<svg viewBox="0 0 100 100" class="draw-o">
                <circle cx="50" cy="50" r="38" />
            </svg>`;
}

/**
 * Displays the game status message.
 * @param {string} message - The message to display.
 */
function showGameStatus(message) {
    const gameInfo = document.getElementById("game-info");
    const status = document.getElementById("status");
    status.innerText = message;
    gameInfo.classList.remove("hidden");
}

/**
 * Minimax algorithm to find the best move for the computer in hard mode.
 * @param {Array} boardArr - The flattened board array.
 * @param {number} n - The size of the board.
 * @param {boolean} isMaximizing - Whether it's the maximizing player's turn.
 * @param {Array} winningCombos - The winning combinations.
 * @returns {Object} - The best score and move.
 */
function minimax(boardArr, n, isMaximizing, winningCombos) {
    const HUMAN = 'X';
    const COMPUTER = 'O';
    if (checkWinnerArr(boardArr, COMPUTER, winningCombos)) return { score: 10 };
    if (checkWinnerArr(boardArr, HUMAN, winningCombos)) return { score: -10 };
    if (boardArr.every(v => v !== null)) return { score: 0 };

    if (isMaximizing) {
        let bestScore = -Infinity;
        let bestMove = null;

        for (let i = 0; i < boardArr.length; i++) {
            if (boardArr[i] === null) {
                boardArr[i] = COMPUTER;
                const result = minimax(boardArr, n, false, winningCombos);
                boardArr[i] = null;

                if (result.score > bestScore) {
                    bestScore = result.score;
                    bestMove = i;
                }
            }
        }
        return { score: bestScore, move: bestMove };
    } else {
        let bestScore = Infinity;
        let bestMove = null;

        for (let i = 0; i < boardArr.length; i++) {
            if (boardArr[i] === null) {
                boardArr[i] = HUMAN;
                const result = minimax(boardArr, n, true, winningCombos);
                boardArr[i] = null;

                if (result.score < bestScore) {
                    bestScore = result.score;
                    bestMove = i;
                }
            }
        }
        return { score: bestScore, move: bestMove };
    }
}

/**
 * Checks if a player has won based on the board array.
 * @param {Array} boardArr - The flattened board array.
 * @param {string} player - The player to check ('X' or 'O').
 * @param {Array} winningCombos - The winning combinations.
 * @returns {boolean} - True if the player has won, false otherwise.
 */
function checkWinnerArr(boardArr, player, winningCombos) {
    return winningCombos.some(combo => combo.every(idx => boardArr[idx] === player));
}

/**
 * Finds the best move for the computer, using memory-based logic in normal mode.
 * @param {Array} board - The current board state.
 * @param {Array} winningCombos - The winning combinations.
 * @param {number} n - The size of the board.
 * @returns {number|null} - The index of the best move or null if no moves are available.
 */
export function findComputerMove(board, winningCombos, n) {
    const hardMode = document.getElementById("hard-mode-toggle")?.checked ?? false;
    const flatBoard = flattenBoard(board);

    if (hardMode) {
        // Use minimax algorithm for hard mode
        const result = minimax(flatBoard, n, true, winningCombos);
        return result.move;
    }

    // Normal mode with memory-based decision-making
    const cellMap = {};
    const emptyCells = [];

    // Map cells and identify empty ones
    for (const row of board) {
        for (const cell of row) {
            cellMap[cell.index] = cell;
            if (cell.value === null) {
                emptyCells.push({ index: cell.index, score: 0 });
            }
        }
    }

    if (!emptyCells.length) return null;

    // Check for immediate win or block opportunities
    let winMove = null;
    let blockMove = null;

    for (const combo of winningCombos) {
        const cells = combo.map(i => cellMap[i]);
        const values = cells.map(c => c.value);

        const OCount = values.filter(v => v === "O").length;
        const XCount = values.filter(v => v === "X").length;
        const empty = cells.find(c => c.value === null);

        if (OCount === n - 1 && empty) winMove = empty.index;
        if (XCount === n - 1 && empty) blockMove = empty.index;
    }

    if (winMove !== null) return winMove;
    if (blockMove !== null) return blockMove;

    // Use memory-based decision-making if stats are available
    const key = boardToKey(board);
    if (moveStats[key] && Object.keys(moveStats[key]).length > 0) {
        let bestMove = null;
        let bestScore = -1;
        for (const [action, stats] of Object.entries(moveStats[key])) {
            const score = (stats.wins + 0.5 * stats.draws) / stats.total;
            if (score > bestScore && flatBoard[action] === null) {
                bestScore = score;
                bestMove = parseInt(action);
            }
        }
        if (bestMove !== null) return bestMove;
    }

    // Fallback to original scoring logic if no stats or no valid move from stats
    if (emptyCells.every(c => c.score <= 0)) {
        for (const combo of winningCombos) {
            for (const cell of emptyCells) {
                if (combo.includes(cell.index)) cell.score++;
            }
        }
    }

    return emptyCells.sort((a, b) => b.score - a.score)[0]?.index ?? null;
}

/**
 * Restarts the game by hiding the game info and resetting flags.
 */
export function restartGame() {
    document.getElementById("game-info").classList.add('hidden');
    isPlayerBlocked = false;
    currentMoves = [];
}

/**
 * Saves the game history to localStorage and updates move statistics.
 * @param {Array} moves - The moves made in the game.
 * @param {string} result - The result of the game ('Player', 'Computer', 'Draw', etc.).
 */
function saveGameHistory(moves, result) {
    const history = JSON.parse(localStorage.getItem("gameHistory") || "[]");

    // Keep only the last 100 games for optimization
    if (history.length >= 100) {
        history.shift();
    }

    history.push({ moves, result });
    localStorage.setItem("gameHistory", JSON.stringify(history));

    // Update move statistics for computer moves
    let boardState = Array(moves.length > 0 ? Math.max(...moves.map(m => m.index)) + 1 : 9).fill(null);
    for (const move of moves) {
        if (move.player === 'O') { // Computer's move
            const key = boardToKey(boardState.map(v => ({ value: v })));
            const action = move.index;
            if (!moveStats[key]) moveStats[key] = {};
            if (!moveStats[key][action]) moveStats[key][action] = { wins: 0, draws: 0, total: 0 };
            if (result === 'Computer') moveStats[key][action].wins++;
            else if (result === 'Draw') moveStats[key][action].draws++;
            moveStats[key][action].total++;
        }
        boardState[move.index] = move.player;
    }
    localStorage.setItem('moveStats', JSON.stringify(moveStats));
}

/**
 * Loads the game history from localStorage.
 * @returns {Array} - The game history.
 */
function loadGameHistory() {
    return JSON.parse(localStorage.getItem("gameHistory") || "[]");
}