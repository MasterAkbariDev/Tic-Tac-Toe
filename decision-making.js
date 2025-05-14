export let isPlayerBlocked = false;

export function generateTable(n) {
    return Array.from({ length: n }, (_, row) =>
        Array.from({ length: n }, (_, col) => ({
            index: row * n + col,
            value: null,
        }))
    );
}

export function generateWiningCombination(n) {
    const combos = [];

    for (let r = 0; r < n; r++) {
        combos.push([...Array(n)].map((_, c) => r * n + c));
    }

    for (let c = 0; c < n; c++) {
        combos.push([...Array(n)].map((_, r) => r * n + c));
    }

    combos.push([...Array(n)].map((_, i) => i * n + i));
    combos.push([...Array(n)].map((_, i) => i * n + (n - 1 - i)));

    return combos;
}

export function checkState(board, n, isPvP = false) {
    const combos = generateWiningCombination(n);
    let isGameFinished = false;
    const player1Scores = document.getElementById('player-1');
    const player2Scores = document.getElementById('player-2');
    const drawScores = document.getElementById('draw');

    for (const combo of combos) {
        const cells = combo.map(idx => board[Math.floor(idx / n)][idx % n]);
        const values = cells.map(cell => cell.value);

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
        }
    }

    if (isGameFinished) return true;

    const isDraw = board.every(row => row.every(cell => cell.value !== null));
    if (isDraw) {
        showGameStatus("Draw!");
        drawScores.textContent = `Draw Score: ${(Number(drawScores.textContent.split(':')[1]) || 0) + 1}`;;
        return true;
    }

    return false;
}


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

export function placeMove(index, value, board) {
    drawXOrO(index, value);
    const cell = board.flat().find(c => c.index === index);
    if (cell) cell.value = value;
    isPlayerBlocked = value === 'X';
}

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

function showGameStatus(message) {
    const gameInfo = document.getElementById("game-info");
    const status = document.getElementById("status");
    status.innerText = message;
    gameInfo.classList.remove("hidden");
}

export function findComputerMove(board, winningCombos, n) {
    const cellMap = {};
    const emptyCells = [];

    for (const row of board) {
        for (const cell of row) {
            cellMap[cell.index] = cell;
            if (cell.value === null) {
                emptyCells.push({ index: cell.index, score: 0 });
            }
        }
    }

    if (!emptyCells.length) return null;

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

    for (const combo of winningCombos) {
        for (const cell of emptyCells) {
            if (combo.includes(cell.index)) cell.score++;
        }
    }

    return emptyCells.sort((a, b) => b.score - a.score)[0]?.index ?? null;
}

export function restartGame() {
    document.getElementById("game-info").classList.add('hidden');
    isPlayerBlocked = false;
}
