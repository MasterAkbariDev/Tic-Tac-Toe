# Tic-Tac-Toe

A browser-based Tic-Tac-Toe game with adjustable board size, local two-player play, and a computer opponent.

## Features

- Play against another person or the computer.
- Choose an `N × N` board with `N > 2`.
- Use normal or minimax-based hard mode against the computer.
- View scores and a line marking the winning combination.
- Store game history and move statistics in browser local storage.

## Run locally

Requires Git and a modern browser. Serve the repository with a local HTTP server because the JavaScript uses ES modules.

```bash
git clone https://github.com/MasterAkbariDev/Tic-Tac-Toe.git
cd Tic-Tac-Toe
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Alternatively, use another static-file server.

## How to play

1. Choose a board size and whether the player moves first.
2. Select **Player vs Player** for a local two-player game; leave it unchecked to play the computer.
3. Select **Hard Mode** to use minimax, then press **Start**.
4. Click an empty cell to play. Use **Restart** after a game to play again.

## Implementation

| File | Responsibility |
| --- | --- |
| `index.html` | Page structure and game controls |
| `custom.css` | Board and interface styling |
| `main.js` | User interaction and game flow |
| `decision-making.js` | Board rules, scoring, move history, and computer decisions |

The hard-mode search explores possible moves; larger boards can become slow as the search space grows. History is stored only in the current browser and can be removed through its site-data settings.
