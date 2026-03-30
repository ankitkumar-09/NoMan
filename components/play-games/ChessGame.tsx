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
  const [validMoves, setValidMoves] = useState<[number, number][]>([])
  const [gameStatus, setGameStatus] = useState<null | "check" | "checkmate" | "stalemate">(null)

  const findKing = (color: Color, currentBoard: Board): [number, number] | null => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = currentBoard[r][c]
        if (p && p.type === "k" && p.color === color) return [r, c]
      }
    }
    return null
  }

  const isSquareAttacked = useCallback((r: number, c: number, attackerColor: Color, currentBoard: Board): boolean => {
    for (let sr = 0; sr < 8; sr++) {
      for (let sc = 0; sc < 8; sc++) {
        const p = currentBoard[sr][sc]
        if (p && p.color === attackerColor) {
          if (isValidMoveBasic(sr, sc, r, c, currentBoard)) return true
        }
      }
    }
    return false
  }, [])

  const isKingInCheck = (color: Color, currentBoard: Board): boolean => {
    const kingPos = findKing(color, currentBoard)
    if (!kingPos) return false
    return isSquareAttacked(kingPos[0], kingPos[1], color === "w" ? "b" : "w", currentBoard)
  }

  const isValidMoveBasic = (sr: number, sc: number, tr: number, tc: number, currentBoard: Board): boolean => {
    const piece = currentBoard[sr][sc]
    if (!piece) return false
    if (currentBoard[tr][tc]?.color === piece.color) return false

    const dr = tr - sr
    const dc = tc - sc
    const absDr = Math.abs(dr)
    const absDc = Math.abs(dc)

    switch (piece.type) {
      case "p": {
        const direction = piece.color === "w" ? -1 : 1
        const startRow = piece.color === "w" ? 6 : 1
        if (dc === 0 && dr === direction && !currentBoard[tr][tc]) return true
        if (dc === 0 && dr === 2 * direction && sr === startRow && !currentBoard[tr][tc] && !currentBoard[sr + direction][sc]) return true
        if (absDc === 1 && dr === direction && currentBoard[tr][tc] && currentBoard[tr][tc]?.color !== piece.color) return true
        return false
      }
      case "r": return (dr === 0 || dc === 0) && isPathClear(sr, sc, tr, tc, currentBoard)
      case "n": return (absDr === 2 && absDc === 1) || (absDr === 1 && absDc === 2)
      case "b": return absDr === absDc && isPathClear(sr, sc, tr, tc, currentBoard)
      case "q": return (dr === 0 || dc === 0 || absDr === absDc) && isPathClear(sr, sc, tr, tc, currentBoard)
      case "k": return absDr <= 1 && absDc <= 1
      default: return false
    }
  }

  const isPathClear = (sr: number, sc: number, tr: number, tc: number, currentBoard: Board): boolean => {
    const dr = Math.sign(tr - sr)
    const dc = Math.sign(tc - sc)
    let r = sr + dr
    let c = sc + dc
    while (r !== tr || c !== tc) {
      if (currentBoard[r][c]) return false
      r += dr
      c += dc
    }
    return true
  }

  const isMoveSafe = (sr: number, sc: number, tr: number, tc: number, currentBoard: Board): boolean => {
    if (!isValidMoveBasic(sr, sc, tr, tc, currentBoard)) return false
    const piece = currentBoard[sr][sc]!
    const tempBoard = currentBoard.map(row => [...row])
    tempBoard[tr][tc] = piece
    tempBoard[sr][sc] = null
    return !isKingInCheck(piece.color, tempBoard)
  }

  const getValidMovesForPiece = (r: number, c: number, currentBoard: Board): [number, number][] => {
    const moves: [number, number][] = []
    for (let tr = 0; tr < 8; tr++) {
      for (let tc = 0; tc < 8; tc++) {
        if (isMoveSafe(r, c, tr, tc, currentBoard)) moves.push([tr, tc])
      }
    }
    return moves
  }

  const getAllValidMoves = (color: Color, currentBoard: Board): [number, number, number, number][] => {
    const allMoves: [number, number, number, number][] = []
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = currentBoard[r][c]
        if (p && p.color === color) {
          const pieceMoves = getValidMovesForPiece(r, c, currentBoard)
          pieceMoves.forEach(([tr, tc]) => allMoves.push([r, c, tr, tc]))
        }
      }
    }
    return allMoves
  }

  const updateGameStatus = (currentTurn: Color, currentBoard: Board) => {
    const moves = getAllValidMoves(currentTurn, currentBoard)
    const inCheck = isKingInCheck(currentTurn, currentBoard)

    if (moves.length === 0) {
      setGameStatus(inCheck ? "checkmate" : "stalemate")
    } else if (inCheck) {
      setGameStatus("check")
    } else {
      setGameStatus(null)
    }
  }

  const handleSquareClick = (r: number, c: number) => {
    if (gameStatus === "checkmate" || gameStatus === "stalemate") return

    const piece = board[r][c]
    if (selected) {
      const [sr, sc] = selected
      if (sr === r && sc === c) {
        setSelected(null); setValidMoves([])
        return
      }
      if (piece && piece.color === turn) {
        setSelected([r, c]); setValidMoves(getValidMovesForPiece(r, c, board))
        return
      }

      if (isMoveSafe(sr, sc, r, c, board)) {
        const newBoard = board.map(row => [...row])
        const movingPiece = { ...newBoard[sr][sc]! }
        if (movingPiece.type === "p" && (r === 0 || r === 7)) movingPiece.type = "q"
        
        newBoard[r][c] = movingPiece
        newBoard[sr][sc] = null
        
        setBoard(newBoard)
        setSelected(null)
        setValidMoves([])
        const nextTurn = turn === "w" ? "b" : "w"
        setTurn(nextTurn)
        setHistory([...history, `${movingPiece.type.toUpperCase()}${String.fromCharCode(97+c)}${8-r}`])
        updateGameStatus(nextTurn, newBoard)

        if (nextTurn === "b") setTimeout(() => makeAIMove(newBoard), 600)
      }
    } else if (piece && piece.color === turn) {
      setSelected([r, c]); setValidMoves(getValidMovesForPiece(r, c, board))
    }
  }

  const makeAIMove = (currentBoard: Board) => {
    const allValidMoves = getAllValidMoves("b", currentBoard)
    if (allValidMoves.length > 0) {
      const captures = allValidMoves.filter(([sr, sc, tr, tc]) => currentBoard[tr][tc] !== null)
      const chosenMove = captures.length > 0 
        ? captures[Math.floor(Math.random() * captures.length)]
        : allValidMoves[Math.floor(Math.random() * allValidMoves.length)]

      const [sr, sc, tr, tc] = chosenMove
      const newBoard = currentBoard.map(row => [...row])
      const movingPiece = { ...newBoard[sr][sc]! }
      if (movingPiece.type === "p" && (tr === 0 || tr === 7)) movingPiece.type = "q"
      newBoard[tr][tc] = movingPiece
      newBoard[sr][sc] = null
      
      setBoard(newBoard)
      setTurn("w")
      setHistory(prev => [...prev, `${movingPiece.type.toUpperCase()}${String.fromCharCode(97+tc)}${8-tr}`])
      updateGameStatus("w", newBoard)
    } else {
      updateGameStatus("b", currentBoard)
    }
  }

  const resetGame = () => {
    setBoard(INITIAL_BOARD); setTurn("w"); setHistory([]); setSelected(null); setValidMoves([]); setGameStatus(null)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center p-4 relative">
      <AnimatePresence>
        {(gameStatus === "checkmate" || gameStatus === "stalemate") && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-2xl"
          >
            <div className="bg-black/80 border border-white/10 p-10 rounded-3xl text-center shadow-2xl max-w-sm w-full mx-4">
              <h2 className="text-4xl font-black italic text-white mb-2 tracking-tighter">
                {gameStatus === "checkmate" ? "CHECKMATE" : "STALEMATE"}
              </h2>
              <p className="text-white/50 text-sm mb-8 font-medium">
                {gameStatus === "checkmate" 
                  ? `${turn === "w" ? "BLACK" : "WHITE"} HAS CONQUERED THE BOARD`
                  : "THE BATTLE ENDS IN A DRAW"}
              </p>
              <button 
                onClick={resetGame}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black italic tracking-widest rounded-xl transition-all shadow-lg shadow-red-900/40"
              >
                REMATCH
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-2xl">
        <div className="grid grid-cols-8 border-2 border-white/20">
          {board.map((row, r) =>
            row.map((piece, c) => {
              const isDark = (r + c) % 2 === 1
              const isSelected = selected?.[0] === r && selected?.[1] === c
              const isValidTarget = validMoves.some(([vr, vc]) => vr === r && vc === c)
              const isKing = piece?.type === "k"
              const isCheck = isKing && gameStatus === "check" && piece.color === turn
              
              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleSquareClick(r, c)}
                  className={`
                    w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center text-3xl sm:text-4xl cursor-pointer transition-colors relative
                    ${isDark ? "bg-[#2c2c2c]" : "bg-[#404040]"}
                    ${isSelected ? "bg-red-500/20 shadow-[inset_0_0_15px_rgba(220,38,38,0.4)]" : ""}
                    ${isCheck ? "bg-red-600/40 animate-pulse shadow-[inset_0_0_20px_rgba(255,0,0,0.5)]" : ""}
                    hover:bg-white/10
                  `}
                >
                  {isValidTarget && (
                    <div className="absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500/30 blur-[1px] z-0" />
                  )}
                  {piece && (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`relative z-10 ${piece.color === "w" ? "text-white" : "text-black drop-shadow-[0_0_1px_rgba(255,255,255,0.7)]"}`}
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
          <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-[10px] opacity-50">Game Status</h3>
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
                <span className="text-white/40 text-[10px] uppercase font-black">Current Turn</span>
                <span className={`text-sm font-black italic ${turn === "w" ? "text-white" : "text-red-500"}`}>
                    {turn === "w" ? "WHITE PLAYER" : "BLACK AI"}
                </span>
            </div>
            {gameStatus === "check" && (
                <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-black uppercase tracking-tighter animate-bounce">CHECK</span>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetGame}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-[10px] uppercase font-black tracking-widest rounded-lg transition-all shadow-lg shadow-red-900/20"
          >
            Reset Match
          </motion.button>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex-1 max-h-64 overflow-hidden flex flex-col">
          <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-[10px] opacity-50">Move Log</h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-2 gap-y-2 text-white/50 text-[11px] font-mono italic">
                {history.map((move, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-red-500/40 font-black not-italic w-4">{Math.floor(i / 2) + 1}.</span>
                    <span className="text-white/80">{move}</span>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
