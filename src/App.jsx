import { useState } from 'react'
import './App.css'

function checkWinner(board) {
  const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  for (const [a, b, c] of winningPatterns) {
    if (
      board[a] !== '' &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a]
    }
  }

  return null
}

function getEmptyCells(board) {
  return board
    .map((cell, index) => (cell === '' ? index : null))
    .filter((index) => index !== null)
}

function minimax(board, isMaximizing) {
  const winner = checkWinner(board)

  // AI wins
  if (winner === 'O') {
    return 10
  }

  // Player wins
  if (winner === 'X') {
    return -10
  }

  // Draw
  if (getEmptyCells(board).length === 0) {
    return 0
  }

  const emptyCells = getEmptyCells(board)

  if (isMaximizing) {
    let bestScore = -Infinity

    for (const index of emptyCells) {
      board[index] = 'O'

      const score = minimax(board, false)

      board[index] = ''

      bestScore = Math.max(bestScore, score)
    }

    return bestScore
  } else {
    let bestScore = Infinity

    for (const index of emptyCells) {
      board[index] = 'X'

      const score = minimax(board, true)

      board[index] = ''

      bestScore = Math.min(bestScore, score)
    }

    return bestScore
  }
}

function App() {
  const [board, setBoard] = useState([
    '', '', '',
    '', '', '',
    '', '', ''
  ])

  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState(null)

  const handleClick = (index) => {
    if (board[index] !== '' || gameOver) {
      return
    }

    // -------------------
    // PLAYER MOVE - X
    // -------------------

    const playerBoard = [...board]
    playerBoard[index] = 'X'

    // Check if player won
    if (checkWinner(playerBoard) === 'X') {
      setBoard(playerBoard)
      setWinner('You Win! 🎉')
      setGameOver(true)
      return
    }

    // Check draw after player's move
    let emptyCells = getEmptyCells(playerBoard)

    if (emptyCells.length === 0) {
      setBoard(playerBoard)
      setWinner("It's a Draw! 🤝")
      setGameOver(true)
      return
    }

    // -------------------
    // AI MOVE - O
    // -------------------

  const aiBoard = [...playerBoard]

let bestScore = -Infinity
let bestMove = null

for (const cell of emptyCells) {
  aiBoard[cell] = 'O'

  const score = minimax(aiBoard, false)

  aiBoard[cell] = ''

  if (score > bestScore) {
    bestScore = score
    bestMove = cell
  }
}

aiBoard[bestMove] = 'O'

    // Check if AI won
    if (checkWinner(aiBoard) === 'O') {
      setBoard(aiBoard)
      setWinner('AI Wins! 🤖')
      setGameOver(true)
      return
    }

    // Check draw after AI's move
    emptyCells = getEmptyCells(aiBoard)

    if (emptyCells.length === 0) {
      setBoard(aiBoard)
      setWinner("It's a Draw! 🤝")
      setGameOver(true)
      return
    }

    setBoard(aiBoard)
  }

  const restartGame = () => {
    setBoard([
      '', '', '',
      '', '', '',
      '', '', ''
    ])

    setWinner(null)
    setGameOver(false)
  }

  return (
    <div className="game">

      <h1>Tic-Tac-Toe AI</h1>

      <p className="status">
        {winner || 'Your Turn - You are X'}
      </p>

      <div className="board">
        {board.map((cell, index) => (
          <button
            key={index}
            className="cell"
            onClick={() => handleClick(index)}
          >
            {cell}
          </button>
        ))}
      </div>

      {gameOver && (
        <button
          className="restart"
          onClick={restartGame}
        >
          🔄 Restart Game
        </button>
      )}

    </div>
  )
}

export default App
