import {
    checkState,
    findComputerMove,
    generateTable,
    generateWiningCombination,
    placeMove,
    isPlayerBlocked,
    restartGame
} from "./decision-making.js";

let table = [];
let winningCombos = [];
let n = 3;
let isPvP = false;
let isPlayerFirst = true;
let isPlayerOneTurn = true;

const board = document.getElementById("board");
const gameInfo = document.getElementById("game-info");
const input = document.getElementById("n");
const startButton = document.getElementById("start");
const errorMessage = document.getElementById("error");
const resetButton = document.getElementById("restart");
const playerFirstCheckbox = document.getElementById("playerFirst");
const pvpCheckbox = document.getElementById("pvp");
const player1Score = document.getElementById('player-1')
const player2Score = document.getElementById('player-2')
const drawScore = document.getElementById('draw')

startButton.onclick = () => {
    n = parseInt(input.value, 10);
    isPlayerFirst = playerFirstCheckbox.checked;
    isPvP = pvpCheckbox.checked;

    player1Score.innerHTML = ''
    player2Score.innerHTML = ''
    drawScore.innerHTML = ''

    if (n > 2) {
        document.querySelector(".game").classList.remove("hidden");
        errorMessage.classList.add("hidden");
        startGame();
    } else {
        errorMessage.classList.remove("hidden");
    }
};

resetButton.onclick = () => {
    restartGame();
    startGame();
};

function startGame() {
    table = generateTable(n);
    winningCombos = generateWiningCombination(n);

    gameInfo.classList.add("hidden");
    board.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(${n}, 80px)`;

    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
            const cell = createCell(i, j);
            board.appendChild(cell);
        }
    }


    if (!isPlayerFirst) {
        if (!isPvP) setTimeout(computerTurn, 500);
    }
}

function createCell(row, col) {
    const cell = document.createElement("button");
    cell.classList.add("cell");
    cell.dataset.row = row;
    cell.dataset.col = col;
    cell.id = `cell-${row * n + col}`;
    cell.onclick = () => handleMove(row, col);
    return cell;
}

function handleMove(row, col) {
    if ((isPlayerBlocked && !isPvP) || isPvP && table[row][col].value !== null) return;

    const index = row * n + col;
    placeMove(index, isPlayerOneTurn ? 'X' : 'O', table);

    const isFinished = checkState(table, n, isPvP)

    if (!isFinished && !isPvP) {
        setTimeout(computerTurn, 500);
    }

    if (isPvP) {
        isPlayerOneTurn = !isPlayerOneTurn;
    }
}

function computerTurn() {
    const bestMove = findComputerMove(table, winningCombos, n);

    if (bestMove !== null && !checkState(table, n)) {
        placeMove(bestMove, 'O', table);
        checkState(table, n);
    }
}
