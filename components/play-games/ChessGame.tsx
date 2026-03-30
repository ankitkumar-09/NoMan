"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Simplified Chess Logic for Demo
// Real chess engines are huge, so we implement a playable visual version with basic move logic
type PieceType = "p" | "r" | "n" | "b" | "q" | "k"
type Color = "w" | "b"

interface Piece {
  type: PieceType
  color: Color
}

type Board = (Piece | null)[][]

const INITIAL_BOARD: Board = [
  [
    { type: "r", color: "b" }, { type: "n", color: "b" }, { type: "b", color: "b" }, { type: "q", color: "b" },
    { type: "k", color: "b" }, { type: "b", color: "b" }, { type: "n", color: "b" }, { type: "r", color: "b" },
  ],
  Array(8).fill(null).map(() => ({ type: "p", color: "b" })),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null).map(() => ({ type: "p", color: "w" })),
  [
    { type: "r", color: "w" }, { type: "n", color: "w" }, { type: "b", color: "w" }, { type: "q", color: "w" },
    { type: "k", color: "w" }, { type: "b", color: "w" }, { type: "n", color: "w" }, { type: "r", color: "w" },
  ],
]

const PIECE_IMAGES: Record<string, string> = {
  wb: "♗", wk: "♔", wn: "♘", wp: "♙", wq: "♕", wr: "♖",
  bb: "♝", bk: "♚", bn: "♞", bp: "♟", bq: "♛", br: "♜",
}

export default function ChessGame() {
  const [board, setBoard] = useState<Board>(INITIAL_BOARD)
  const [selected, setSelected] = useState<[number, number] | null>(null)
  const [turn, setTurn] = useState<Color>("w")
  const [history, setHistory] = useState<string[]>([])

  const handleSquareClick = (r: number, c: number) => {
    const piece = board[r][c]

    if (selected) {
      const [sr, sc] = selected
      
      // If clicking self, deselect
      if (sr === r && sc === c) {
        setSelected(null)
        return
      }

      // If clicking another piece of same color, change selection
      if (piece && piece.color === turn) {
        setSelected([r, c])
        return
      }

      // Basic move logic (very simplified for interactive demo)
      const newBoard = board.map(row => [...row])
      const movingPiece = newBoard[sr][sc]
      newBoard[r][c] = movingPiece
      newBoard[sr][sc] = null
      
      setBoard(newBoard)
      setSelected(null)
      setTurn(turn === "w" ? "b" : "w")
      setHistory([...history, `${movingPiece?.type.toUpperCase()}${String.fromCharCode(97+c)}${8-r}`])

      // Trigger AI move if it's black's turn
      if (turn === "w") {
        setTimeout(() => makeAIMove(newBoard), 500)
      }
    } else if (piece && piece.color === turn) {
      setSelected([r, c])
    }
  }

  const makeAIMove = (currentBoard: Board) => {
    // Super simple random AI move for the interactiveness
    const possibleMoves: [number, number, number, number][] = []
    
    currentBoard.forEach((row, r) => {
      row.forEach((p, c) => {
        if (p && p.color === "b") {
          // Check some random target squares
          for(let i=0; i<10; i++) {
              const tr = Math.floor(Math.random() * 8)
              const tc = Math.floor(Math.random() * 8)
              if (!currentBoard[tr][tc] || currentBoard[tr][tc]?.color === "w") {
                  possibleMoves.push([r, c, tr, tc])
              }
          }
        }
      })
    })

    if (possibleMoves.length > 0) {
      const [sr, sc, tr, tc] = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
      const newBoard = currentBoard.map(row => [...row])
      newBoard[tr][tc] = newBoard[sr][sc]
      newBoard[sr][sc] = null
      setBoard(newBoard)
      setTurn("w")
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center p-4">
      <div className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-2xl">
        <div className="grid grid-cols-8 border-2 border-white/20">
          {board.map((row, r) =>
            row.map((piece, c) => {
              const isDark = (r + c) % 2 === 1
              const isSelected = selected?.[0] === r && selected?.[1] === c
              
              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleSquareClick(r, c)}
                  className={`
                    w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center text-3xl sm:text-4xl cursor-pointer transition-colors
                    ${isDark ? "bg-[#2c2c2c]" : "bg-[#404040]"}
                    ${isSelected ? "ring-4 ring-inset ring-red-500/50 bg-red-900/20" : ""}
                    hover:bg-white/10
                  `}
                >
                  {piece && (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={piece.color === "w" ? "text-white drop-shadow-md" : "text-black drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]"}
                    >
                      {PIECE_IMAGES[`${piece.color}${piece.type}`]}
                    </motion.span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className="w-full lg:w-64 flex flex-col gap-4">
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-xs opacity-50">Game Info</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm">Turn</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${turn === "w" ? "bg-white text-black" : "bg-red-600 text-white"}`}>
              {turn === "w" ? "WHITE" : "BLACK (AI)"}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {setBoard(INITIAL_BOARD); setTurn("w"); setHistory([])}}
            className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-colors mt-2"
          >
            Reset Board
          </motion.button>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex-1 max-h-48 overflow-y-auto">
          <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-xs opacity-50">Move History</h3>
          <div className="grid grid-cols-2 gap-x-4 text-white/60 text-xs font-mono">
            {history.map((move, i) => (
              <div key={i} className="mb-1">
                <span className="opacity-30 mr-2">{Math.floor(i / 2) + 1}.</span>
                {move}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
