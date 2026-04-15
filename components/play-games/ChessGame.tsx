"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

type PieceType = "p" | "r" | "n" | "b" | "q" | "k"
type Color = "w" | "b"
type Difficulty = "easy" | "medium" | "hard"
type GameStatus = null | "check" | "checkmate" | "stalemate"

interface Piece {
  type: PieceType
  color: Color
}

type Board = (Piece | null)[][]

interface Move {
  sr: number
  sc: number
  tr: number
  tc: number
  promotion?: PieceType
}

const PROMOTION_OPTIONS: PieceType[] = ["q", "r", "b", "n"]
const PIECE_VALUE: Record<PieceType, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 100,
}

const PIECE_IMAGES: Record<string, string> = {
  wb: "♗", wk: "♔", wn: "♘", wp: "♙", wq: "♕", wr: "♖",
  bb: "♝", bk: "♚", bn: "♞", bp: "♟", bq: "♛", br: "♜",
}

const createInitialBoard = (): Board => [
  [
    { type: "r", color: "b" }, { type: "n", color: "b" }, { type: "b", color: "b" }, { type: "q", color: "b" },
    { type: "k", color: "b" }, { type: "b", color: "b" }, { type: "n", color: "b" }, { type: "r", color: "b" },
  ],
  Array.from({ length: 8 }, () => ({ type: "p" as PieceType, color: "b" as Color })),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array.from({ length: 8 }, () => ({ type: "p" as PieceType, color: "w" as Color })),
  [
    { type: "r", color: "w" }, { type: "n", color: "w" }, { type: "b", color: "w" }, { type: "q", color: "w" },
    { type: "k", color: "w" }, { type: "b", color: "w" }, { type: "n", color: "w" }, { type: "r", color: "w" },
  ],
]

const cloneBoard = (currentBoard: Board): Board => currentBoard.map((row) => row.map((cell) => (cell ? { ...cell } : null)))

export default function ChessGame() {
  const [board, setBoard] = useState<Board>(() => createInitialBoard())
  const [selected, setSelected] = useState<[number, number] | null>(null)
  const [turn, setTurn] = useState<Color>("w")
  const [history, setHistory] = useState<string[]>([])
  const [validMoves, setValidMoves] = useState<[number, number][]>([])
  const [gameStatus, setGameStatus] = useState<GameStatus>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [resultMessage, setResultMessage] = useState<string | null>(null)
  const [pendingPromotion, setPendingPromotion] = useState<Move | null>(null)

  const alertShownRef = useRef(false)
  const aiTimerRef = useRef<number | null>(null)

  const findKing = (color: Color, currentBoard: Board): [number, number] | null => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = currentBoard[r][c]
        if (p && p.type === "k" && p.color === color) return [r, c]
      }
    }
    return null
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

  const isValidMoveBasic = useCallback((sr: number, sc: number, tr: number, tc: number, currentBoard: Board): boolean => {
    const piece = currentBoard[sr][sc]
    if (!piece) return false
    if (sr === tr && sc === tc) return false
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
  }, [])

  const isSquareAttacked = useCallback((r: number, c: number, attackerColor: Color, currentBoard: Board): boolean => {
    for (let sr = 0; sr < 8; sr++) {
      for (let sc = 0; sc < 8; sc++) {
        const p = currentBoard[sr][sc]
        if (p && p.color === attackerColor && isValidMoveBasic(sr, sc, r, c, currentBoard)) {
          return true
        }
      }
    }
    return false
  }, [isValidMoveBasic])

  const isKingInCheck = useCallback((color: Color, currentBoard: Board): boolean => {
    const kingPos = findKing(color, currentBoard)
    if (!kingPos) return false
    return isSquareAttacked(kingPos[0], kingPos[1], color === "w" ? "b" : "w", currentBoard)
  }, [isSquareAttacked])

  const applyMoveToBoard = useCallback((currentBoard: Board, move: Move): Board => {
    const newBoard = cloneBoard(currentBoard)
    const movingPiece = newBoard[move.sr][move.sc]
    if (!movingPiece) return newBoard

    const pieceToPlace: Piece = { ...movingPiece }
    if (pieceToPlace.type === "p" && (move.tr === 0 || move.tr === 7)) {
      pieceToPlace.type = move.promotion ?? "q"
    }

    newBoard[move.tr][move.tc] = pieceToPlace
    newBoard[move.sr][move.sc] = null
    return newBoard
  }, [])

  const isMoveSafe = useCallback((sr: number, sc: number, tr: number, tc: number, currentBoard: Board): boolean => {
    if (!isValidMoveBasic(sr, sc, tr, tc, currentBoard)) return false
    const movingPiece = currentBoard[sr][sc]
    if (!movingPiece) return false
    const tempBoard = applyMoveToBoard(currentBoard, { sr, sc, tr, tc })
    return !isKingInCheck(movingPiece.color, tempBoard)
  }, [applyMoveToBoard, isKingInCheck, isValidMoveBasic])

  const getValidMovesForPiece = useCallback((r: number, c: number, currentBoard: Board): [number, number][] => {
    const moves: [number, number][] = []
    for (let tr = 0; tr < 8; tr++) {
      for (let tc = 0; tc < 8; tc++) {
        if (isMoveSafe(r, c, tr, tc, currentBoard)) moves.push([tr, tc])
      }
    }
    return moves
  }, [isMoveSafe])

  const getAllValidMoves = useCallback((color: Color, currentBoard: Board): Move[] => {
    const allMoves: Move[] = []
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = currentBoard[r][c]
        if (p && p.color === color) {
          const pieceMoves = getValidMovesForPiece(r, c, currentBoard)
          pieceMoves.forEach(([tr, tc]) => allMoves.push({ sr: r, sc: c, tr, tc }))
        }
      }
    }
    return allMoves
  }, [getValidMovesForPiece])

  const evaluateGameStatus = useCallback((currentTurn: Color, currentBoard: Board): GameStatus => {
    const moves = getAllValidMoves(currentTurn, currentBoard)
    const inCheck = isKingInCheck(currentTurn, currentBoard)
    if (moves.length === 0) return inCheck ? "checkmate" : "stalemate"
    return inCheck ? "check" : null
  }, [getAllValidMoves, isKingInCheck])

  const evaluateBoard = useCallback((currentBoard: Board): number => {
    let score = 0
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = currentBoard[r][c]
        if (!piece) continue
        const value = PIECE_VALUE[piece.type]
        score += piece.color === "b" ? value : -value
      }
    }
    return score
  }, [])

  const minimax = useCallback((currentBoard: Board, sideToMove: Color, depth: number, alpha: number, beta: number): number => {
    const status = evaluateGameStatus(sideToMove, currentBoard)
    if (depth === 0 || status === "checkmate" || status === "stalemate") {
      if (status === "checkmate") {
        return sideToMove === "b" ? -9999 : 9999
      }
      if (status === "stalemate") return 0
      return evaluateBoard(currentBoard)
    }

    const moves = getAllValidMoves(sideToMove, currentBoard)
    if (moves.length === 0) return evaluateBoard(currentBoard)

    if (sideToMove === "b") {
      let best = -Infinity
      for (const move of moves) {
        const score = minimax(applyMoveToBoard(currentBoard, move), "w", depth - 1, alpha, beta)
        best = Math.max(best, score)
        alpha = Math.max(alpha, best)
        if (beta <= alpha) break
      }
      return best
    }

    let best = Infinity
    for (const move of moves) {
      const score = minimax(applyMoveToBoard(currentBoard, move), "b", depth - 1, alpha, beta)
      best = Math.min(best, score)
      beta = Math.min(beta, best)
      if (beta <= alpha) break
    }
    return best
  }, [applyMoveToBoard, evaluateBoard, evaluateGameStatus, getAllValidMoves])

  const chooseAIMove = useCallback((currentBoard: Board): Move | null => {
    const moves = getAllValidMoves("b", currentBoard)
    if (moves.length === 0) return null

    if (difficulty === "easy") {
      return moves[Math.floor(Math.random() * moves.length)]
    }

    if (difficulty === "medium") {
      const scoredMoves = moves.map((move) => {
        const target = currentBoard[move.tr][move.tc]
        const captureValue = target ? PIECE_VALUE[target.type] * 4 : 0
        const nextBoard = applyMoveToBoard(currentBoard, move)
        const pressureBonus = isKingInCheck("w", nextBoard) ? 1.5 : 0
        return { move, score: captureValue + pressureBonus + Math.random() * 0.2 }
      })
      scoredMoves.sort((a, b) => b.score - a.score)
      return scoredMoves[0].move
    }

    let bestMove = moves[0]
    let bestScore = -Infinity
    for (const move of moves) {
      const nextBoard = applyMoveToBoard(currentBoard, move)
      const score = minimax(nextBoard, "w", 2, -Infinity, Infinity)
      if (score > bestScore) {
        bestScore = score
        bestMove = move
      }
    }
    return bestMove
  }, [applyMoveToBoard, difficulty, getAllValidMoves, isKingInCheck, minimax])

  const toMoveLabel = (pieceType: PieceType) => pieceType.toUpperCase()

  const makeAIMove = useCallback((currentBoard: Board) => {
    const move = chooseAIMove(currentBoard)
    if (!move) {
      setGameStatus(evaluateGameStatus("b", currentBoard))
      return
    }

    const movingPiece = currentBoard[move.sr][move.sc]
    if (!movingPiece) return

    const newBoard = applyMoveToBoard(currentBoard, move)
    const notation = `${toMoveLabel(movingPiece.type)}${String.fromCharCode(97 + move.tc)}${8 - move.tr}`

    setBoard(newBoard)
    setTurn("w")
    setHistory((prev) => [...prev, notation])
    setGameStatus(evaluateGameStatus("w", newBoard))
  }, [applyMoveToBoard, chooseAIMove, evaluateGameStatus])

  const scheduleAIMove = useCallback((currentBoard: Board) => {
    if (aiTimerRef.current) {
      window.clearTimeout(aiTimerRef.current)
    }
    aiTimerRef.current = window.setTimeout(() => {
      makeAIMove(currentBoard)
    }, 420)
  }, [makeAIMove])

  const performMove = useCallback((move: Move, currentBoard: Board, currentTurn: Color) => {
    const movingPiece = currentBoard[move.sr][move.sc]
    if (!movingPiece) return

    const newBoard = applyMoveToBoard(currentBoard, move)
    const promotedTo = movingPiece.type === "p" && (move.tr === 0 || move.tr === 7) ? move.promotion : undefined
    const notation = `${toMoveLabel(movingPiece.type)}${String.fromCharCode(97 + move.tc)}${8 - move.tr}${promotedTo ? `=${promotedTo.toUpperCase()}` : ""}`
    const nextTurn: Color = currentTurn === "w" ? "b" : "w"
    const nextStatus = evaluateGameStatus(nextTurn, newBoard)

    setBoard(newBoard)
    setTurn(nextTurn)
    setHistory((prev) => [...prev, notation])
    setSelected(null)
    setValidMoves([])
    setGameStatus(nextStatus)

    if (nextTurn === "b" && (nextStatus === null || nextStatus === "check")) {
      scheduleAIMove(newBoard)
    }
  }, [applyMoveToBoard, evaluateGameStatus, scheduleAIMove])

  const handleSquareClick = (r: number, c: number) => {
    if (gameStatus === "checkmate" || gameStatus === "stalemate" || pendingPromotion || turn !== "w") return

    const piece = board[r][c]
    if (selected) {
      const [sr, sc] = selected
      if (sr === r && sc === c) {
        setSelected(null)
        setValidMoves([])
        return
      }
      if (piece && piece.color === turn) {
        setSelected([r, c])
        setValidMoves(getValidMovesForPiece(r, c, board))
        return
      }

      if (isMoveSafe(sr, sc, r, c, board)) {
        const movingPiece = board[sr][sc]
        if (movingPiece?.type === "p" && r === 0) {
          setPendingPromotion({ sr, sc, tr: r, tc: c })
          setSelected(null)
          setValidMoves([])
          return
        }
        performMove({ sr, sc, tr: r, tc: c }, board, turn)
      }
      return
    }

    if (piece && piece.color === turn) {
      setSelected([r, c])
      setValidMoves(getValidMovesForPiece(r, c, board))
    }
  }

  const handlePromotionChoice = (pieceType: PieceType) => {
    if (!pendingPromotion) return
    performMove({ ...pendingPromotion, promotion: pieceType }, board, "w")
    setPendingPromotion(null)
  }

  const resetGame = () => {
    if (aiTimerRef.current) {
      window.clearTimeout(aiTimerRef.current)
      aiTimerRef.current = null
    }
    setBoard(createInitialBoard())
    setTurn("w")
    setHistory([])
    setSelected(null)
    setValidMoves([])
    setGameStatus(null)
    setResultMessage(null)
    setPendingPromotion(null)
    alertShownRef.current = false
  }

  useEffect(() => {
    if (gameStatus === "checkmate") {
      const playerWon = turn === "b"
      const message = playerWon ? "Checkmate! System is checkmated. You win." : "Checkmate! You are checkmated. System wins."
      setResultMessage(message)
      if (!alertShownRef.current) {
        alertShownRef.current = true
        window.alert(message)
      }
      return
    }

    if (gameStatus === "stalemate") {
      const message = "Game Over: Stalemate."
      setResultMessage(message)
      if (!alertShownRef.current) {
        alertShownRef.current = true
        window.alert(message)
      }
      return
    }

    if (gameStatus !== "check") {
      setResultMessage(null)
    }
  }, [gameStatus, turn])

  useEffect(() => {
    return () => {
      if (aiTimerRef.current) {
        window.clearTimeout(aiTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center p-4 relative">
      <AnimatePresence>
        {pendingPromotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-2xl"
          >
            <div className="bg-black/85 border border-white/10 p-6 rounded-2xl text-center w-[320px] max-w-[90%]">
              <h3 className="text-white text-xl font-black tracking-wide mb-2">PROMOTE PAWN</h3>
              <p className="text-white/50 text-sm mb-5">Choose any piece for promotion.</p>
              <div className="grid grid-cols-4 gap-3">
                {PROMOTION_OPTIONS.map((piece) => (
                  <button
                    key={piece}
                    onClick={() => handlePromotionChoice(piece)}
                    className="h-14 rounded-xl border border-white/10 bg-white/5 text-3xl text-white hover:bg-white/10 transition-colors"
                  >
                    {PIECE_IMAGES[`w${piece}`]}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(gameStatus === "checkmate" || gameStatus === "stalemate") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md rounded-2xl"
          >
            <div className="bg-black/80 border border-white/10 p-10 rounded-3xl text-center shadow-2xl max-w-sm w-full mx-4">
              <h2 className="text-4xl font-black italic text-white mb-2 tracking-tighter">GAME OVER</h2>
              <p className="text-red-400 text-lg font-black mb-1">{gameStatus === "checkmate" ? "CHECKMATE" : "STALEMATE"}</p>
              <p className="text-white/60 text-sm mb-8 font-medium">{resultMessage}</p>
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
        <div className="mb-3 text-[10px] uppercase tracking-widest text-white/40 font-black">White At Bottom (Board Fixed)</div>
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
                  className={[
                    "w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center text-3xl sm:text-4xl transition-colors relative",
                    turn === "w" && !pendingPromotion ? "cursor-pointer" : "cursor-not-allowed",
                    isDark ? "bg-[#2f3a53]" : "bg-[#9aa6bb]",
                    isSelected ? "bg-red-500/20 shadow-[inset_0_0_15px_rgba(220,38,38,0.4)]" : "",
                    isCheck ? "bg-red-600/40 animate-pulse shadow-[inset_0_0_20px_rgba(255,0,0,0.5)]" : "",
                    "hover:bg-white/10",
                  ].join(" ")}
                >
                  {isValidTarget && <div className="absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500/35 blur-[1px] z-0" />}
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

      <div className="w-full lg:w-72 flex flex-col gap-4">
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <h3 className="text-white font-bold mb-3 uppercase tracking-widest text-[10px] opacity-50">Game Status</h3>
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

          <div className="mb-4">
            <label className="text-white/40 text-[10px] uppercase font-black block mb-2">AI Level</label>
            <div className="grid grid-cols-3 gap-2">
              {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`py-2 text-[10px] uppercase font-black tracking-widest rounded-md border transition-colors ${
                    difficulty === level
                      ? "bg-red-600/30 border-red-500/60 text-red-300"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
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
          <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-[10px] opacity-50">Match History</h3>
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
