"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Player = "X" | "O" | null

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function checkWinner(board: Player[]): { winner: Player; line: number[] } | null {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combo }
    }
  }
  return null
}

function minimax(board: Player[], isMax: boolean): number {
  const result = checkWinner(board)
  if (result?.winner === "O") return 10
  if (result?.winner === "X") return -10
  if (board.every((c) => c !== null)) return 0

  if (isMax) {
    let best = -Infinity
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O"
        best = Math.max(best, minimax(board, false))
        board[i] = null
      }
    }
    return best
  } else {
    let best = Infinity
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "X"
        best = Math.min(best, minimax(board, true))
        board[i] = null
      }
    }
    return best
  }
}

function getBestMove(board: Player[]): number {
  let bestVal = -Infinity
  let bestMove = -1
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O"
      const val = minimax(board, false)
      board[i] = null
      if (val > bestVal) {
        bestVal = val
        bestMove = i
      }
    }
  }
  return bestMove
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
  const [scores, setScores] = useState({ player: 0, ai: 0, draws: 0 })
  const [gameOver, setGameOver] = useState(false)
  const [winLine, setWinLine] = useState<number[]>([])
  const [statusMsg, setStatusMsg] = useState("Your turn — you're X")

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null))
    setGameOver(false)
    setWinLine([])
    setStatusMsg("Your turn — you're X")
  }, [])

  const handleClick = useCallback(
    (idx: number) => {
      if (board[idx] || gameOver) return

      const newBoard = [...board]
      newBoard[idx] = "X"

      const playerResult = checkWinner(newBoard)
      if (playerResult) {
        setBoard(newBoard)
        setWinLine(playerResult.line)
        setScores((s) => ({ ...s, player: s.player + 1 }))
        setStatusMsg("🎉 You win!")
        setGameOver(true)
        return
      }

      if (newBoard.every((c) => c !== null)) {
        setBoard(newBoard)
        setScores((s) => ({ ...s, draws: s.draws + 1 }))
        setStatusMsg("🤝 It's a draw!")
        setGameOver(true)
        return
      }

      // AI move
      const aiMove = getBestMove([...newBoard])
      if (aiMove >= 0) newBoard[aiMove] = "O"

      const aiResult = checkWinner(newBoard)
      if (aiResult) {
        setBoard(newBoard)
        setWinLine(aiResult.line)
        setScores((s) => ({ ...s, ai: s.ai + 1 }))
        setStatusMsg("🤖 AI wins!")
        setGameOver(true)
        return
      }

      if (newBoard.every((c) => c !== null)) {
        setBoard(newBoard)
        setScores((s) => ({ ...s, draws: s.draws + 1 }))
        setStatusMsg("🤝 It's a draw!")
        setGameOver(true)
        return
      }

      setBoard(newBoard)
      setStatusMsg("Your turn — you're X")
    },
    [board, gameOver]
  )

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {/* Scoreboard */}
      <div className="flex gap-6 text-sm font-semibold">
        <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
          <span className="text-emerald-400 text-xs">YOU (X)</span>
          <span className="text-2xl text-white">{scores.player}</span>
        </div>
        <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <span className="text-white/50 text-xs">DRAWS</span>
          <span className="text-2xl text-white">{scores.draws}</span>
        </div>
        <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30">
          <span className="text-red-400 text-xs">AI (O)</span>
          <span className="text-2xl text-white">{scores.ai}</span>
        </div>
      </div>

      {/* Status */}
      <p className="text-white/80 text-sm font-medium tracking-wide">{statusMsg}</p>

      {/* Board */}
      <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
        {board.map((cell, i) => (
          <motion.button
            key={i}
            whileHover={!cell && !gameOver ? { scale: 1.08 } : {}}
            whileTap={!cell && !gameOver ? { scale: 0.95 } : {}}
            onClick={() => handleClick(i)}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl text-3xl sm:text-4xl font-black flex items-center justify-center transition-all duration-200
              ${winLine.includes(i) ? "bg-emerald-500/30 ring-2 ring-emerald-400/60" : "bg-white/5 hover:bg-white/10"}
              ${!cell && !gameOver ? "cursor-pointer" : "cursor-default"}
            `}
          >
            <AnimatePresence mode="wait">
              {cell && (
                <motion.span
                  key={cell}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cell === "X" ? "text-violet-400" : "text-red-400"}
                >
                  {cell}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Reset */}
      {gameOver && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={resetGame}
          className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-full text-white font-semibold text-sm tracking-wide transition-colors"
        >
          Play Again
        </motion.button>
      )}
    </div>
  )
}
