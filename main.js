import {
    checkState,
    findComputerMove,
    generateTable,
    generateWiningCombination,
    placeMove,
    isPlayerBlocked,
    restartGame
} from "./decision-making.js";

// Game state variables
let table = []; // Array representing the game board
let winningCombos = []; // Array of winning combinations
let n = 3; // Default board size (3x3)
let isPvP = false; // Flag for Player vs Player mode
let isPlayerFirst = true; // Flag to determine if the player starts first
let isPlayerOneTurn = true; // Flag to track turn in PvP mode

// DOM elements for the game UI
const board = document.getElementById("board"); // Container for the game board
const gameInfo = document.getElementById("game-info"); // Container for game status messages
const input = document.getElementById("n"); // Input field for board size
const startButton = document.getElementById("start"); // Button to start the game
const errorMessage = document.getElementById("error"); // Error message for invalid input
const resetButton = document.getElementById("restart"); // Button to reset the game
const playerFirstCheckbox = document.getElementById("playerFirst"); // Checkbox to select if player starts
const pvpCheckbox = document.getElementById("pvp"); // Checkbox to select PvP mode
const player1Score = document.getElementById('player-1'); // Display for Player 1 or Player score
const player2Score = document.getElementById('player-2'); // Display for Player 2 or Computer score
const drawScore = document.getElementById('draw'); // Display for draw score

// Event listener for the start button
startButton.onclick = () => {
    n = parseInt(input.value, 10); // Get board size from input
    isPlayerFirst = playerFirstCheckbox.checked; // Check if player starts first
    isPvP = pvpCheckbox.checked; // Check if PvP mode is selected
    isPlayerOneTurn = true; // Reset to Player 1's turn

    // Clear score displays
    player1Score.innerHTML = '';
    player2Score.innerHTML = '';
    drawScore.innerHTML = '';

    // Validate board size
    if (n > 2) {
        document.querySelector(".game").classList.remove("hidden"); // Show game board
        errorMessage.classList.add("hidden"); // Hide error message
        startGame(); // Start the game
    } else {
        errorMessage.classList.remove("hidden"); // Show error message for invalid n
    }
};

// Event listener for the reset button
resetButton.onclick = () => {
    restartGame(); // Reset game logic
    startGame(); // Reinitialize game board
};

/**
 * Initializes a new game by setting up the board and UI.
 */
function startGame() {
    table = generateTable(n); // Generate new board of size n x n
    winningCombos = generateWiningCombination(n); // Generate winning combinations

    gameInfo.classList.add("hidden"); // Hide game info (e.g., winner or draw message)
    board.innerHTML = ""; // Clear the board
    board.style.gridTemplateColumns = `repeat(${n}, 80px)`; // Set grid columns based on board size

    // Create and append cells to the board
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
            const cell = createCell(i, j); // Create cell for the given row and column
            board.appendChild(cell); // Add cell to the board
        }
    }

    // If the computer starts first, make its move after a delay
    if (!isPlayerFirst && !isPvP) {
        setTimeout(computerTurn, 500);
    }
}

/**
 * Creates a clickable cell for the game board.
 * @param {number} row - The row index of the cell.
 * @param {number} col - The column index of the cell.
 * @returns {HTMLElement} - The created cell element.
 */
function createCell(row, col) {
    const cell = document.createElement("button"); // Create a button element
    cell.classList.add("cell"); // Add cell styling
    cell.dataset.row = row; // Store row index
    cell.dataset.col = col; // Store column index
    cell.id = `cell-${row * n + col}`; // Set unique ID for the cell
    cell.onclick = () => handleMove(row, col); // Attach click handler
    return cell;
}

/**
 * Handles a player's move on the board.
 * @param {number} row - The row index of the clicked cell.
 * @param {number} col - The column index of the clicked cell.
 */
function handleMove(row, col) {
    // Prevent move if player is blocked (in PvC) or cell is already filled (in PvP)
    if ((isPlayerBlocked && !isPvP) || (isPvP && table[row][col].value !== null)) return;

    const index = row * n + col; // Calculate cell index
    placeMove(index, isPlayerOneTurn ? 'X' : 'O', table); // Place move ('X' or 'O')

    const isFinished = checkState(table, n, isPvP); // Check if the game is finished

    // If game isn't finished and in PvC mode, trigger computer's turn
    if (!isFinished && !isPvP) {
        setTimeout(computerTurn, 500);
    }

    // In PvP mode, switch turns
    if (isPvP) {
        isPlayerOneTurn = !isPlayerOneTurn;
    }
}

/**
 * Executes the computer's turn in PvC mode.
 */
function computerTurn() {
    const bestMove = findComputerMove(table, winningCombos, n); // Find the best move for the computer

    // If a valid move exists and the game isn't finished, place the move
    if (bestMove !== null && !checkState(table, n)) {
        placeMove(bestMove, 'O', table); // Place computer's move
        checkState(table, n); // Check game state after move
    }
}