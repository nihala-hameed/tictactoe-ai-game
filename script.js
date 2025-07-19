let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let playerScore = 0;
let aiScore = 0;
let gameActive = true;

const cells = document.querySelectorAll(".cell");
const winnerText = document.getElementById("winnerText");
const canvas = document.getElementById("winLine");
const ctx = canvas.getContext("2d");
canvas.width = 330;
canvas.height = 330;

function makeMove(index) {
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  updateBoard();

  const winner = checkWinner();
  if (winner) {
    announceWinner(winner.symbol);
    drawWinLine(winner.line);
    return;
  }

  if (!board.includes("")) {
    winnerText.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "O";
  setTimeout(aiMove, 500);
}

function aiMove() {
  if (!gameActive) return;

  let empty = board.map((v, i) => v === "" ? i : null).filter(i => i !== null);
  let move = empty[Math.floor(Math.random() * empty.length)];
  board[move] = "O";
  updateBoard();

  const winner = checkWinner();
  if (winner) {
    announceWinner(winner.symbol);
    drawWinLine(winner.line);
    return;
  }

  if (!board.includes("")) {
    winnerText.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
}

function updateBoard() {
  board.forEach((val, i) => {
    cells[i].textContent = val;
  });
}

function checkWinner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let combo of wins) {
    const [a,b,c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { symbol: board[a], line: combo };
    }
  }

  return null;
}

function announceWinner(symbol) {
  gameActive = false;
  winnerText.textContent = `${symbol} Wins!`;
  if (symbol === "X") {
    playerScore++;
    document.getElementById("playerScore").textContent = playerScore;
  } else {
    aiScore++;
    document.getElementById("aiScore").textContent = aiScore;
  }
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  winnerText.textContent = "";
  updateBoard();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawWinLine(indices) {
  const cellSize = 110; // 100px + 10px gap
  const offset = 50;

  const getXY = (index) => {
    return {
      x: (index % 3) * cellSize + offset,
      y: Math.floor(index / 3) * cellSize + offset
    };
  };

  const start = getXY(indices[0]);
  const end = getXY(indices[2]);

  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}