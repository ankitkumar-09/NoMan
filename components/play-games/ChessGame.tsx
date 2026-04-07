"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Chess, Move } from "chess.js"
import { Chessboard } from "react-chessboard"

export default function ChessGame() {
  const gameRef = useRef(new Chess())
  const [fen, setFen] = useState(gameRef.current.fen())
  const [history, setHistory] = useState<string[]>([])
  
  // States for tapping to move
  const [moveFrom, setMoveFrom] = useState<string | null>(null)
  const [optionSquares, setOptionSquares] = useState<Record<string, any>>({})
  
  // Game Mode
  const [gameMode, setGameMode] = useState<"ai" | "local">("ai")
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">("white")
  
  // Make sure we only render board on client to avoid hydration mismatch
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const makeRandomMove = () => {
    const g = gameRef.current
    if (g.isGameOver() || g.isDraw()) return

    const possibleMoves = g.moves()
    if (possibleMoves.length === 0) return

    const randomIndex = Math.floor(Math.random() * possibleMoves.length)
    const moveStr = possibleMoves[randomIndex]
    
    try {
      g.move(moveStr)
      setFen(g.fen())
      setHistory((prev) => [...prev, moveStr])
    } catch (e) {
      // failed move
    }
  }

  function getMoveOptions(square: string) {
    const moves = gameRef.current.moves({
      square: square as import("chess.js").Square,
      verbose: true,
    }) as Move[];

    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: Record<string, any> = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background: gameRef.current.get(move.to as any) && gameRef.current.get(move.to as any)?.color !== gameRef.current.get(square as any)?.color
          ? "radial-gradient(circle, rgba(220,38,38,.5) 85%, transparent 85%)" // Capture target (red glow)
          : "radial-gradient(circle, rgba(0,0,0,.4) 25%, transparent 25%)", // Empty target (dark dot)
        borderRadius: "50%",
      };
    });
    newSquares[square] = {
      background: "rgba(255, 255, 255, 0.25)", // Highlight selected square
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick({ square }: any) {
    if (!square) return;
    
    // If no piece is currently selected:
    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    // Try making the move
    const g = gameRef.current;
    let moveDetail: Move | null = null;
    
    try {
      moveDetail = g.move({
        from: moveFrom,
        to: square,
        promotion: "q"
      });
    } catch {
      moveDetail = null;
    }

    // If it's an invalid move, the user might be clicking a different piece they own
    if (moveDetail === null) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      else {
        setMoveFrom(null);
        setOptionSquares({});
      }
      return;
    }

    // Valid move was made via clicking!
    setFen(g.fen());
    setHistory((prev) => [...prev, moveDetail!.san]);
    setMoveFrom(null);
    setOptionSquares({});
    
    if (gameMode === "ai") {
      setTimeout(makeRandomMove, 300);
    } else {
      setBoardOrientation(g.turn() === "w" ? "white" : "black");
    }
  }

  function onDrop({ sourceSquare, targetSquare }: any) {
    const g = gameRef.current
    let moveResult: Move | null = null
    
    try {
      moveResult = g.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q"
      })
    } catch {
      return false // illegal move
    }

    if (moveResult === null) return false

    setFen(g.fen())
    setHistory((prev) => [...prev, moveResult!.san])
    setMoveFrom(null)
    setOptionSquares({})
    
    // Delay for visual effect then make AI move
    if (gameMode === "ai") {
      setTimeout(makeRandomMove, 300)
    } else {
      setBoardOrientation(g.turn() === "w" ? "white" : "black")
    }
    return true
  }

  const resetGame = () => {
    gameRef.current.reset()
    setFen(gameRef.current.fen())
    setHistory([])
    setMoveFrom(null)
    setOptionSquares({})
    setBoardOrientation("white")
  }

  if (!mounted) return <div className="min-h-[500px] flex items-center justify-center text-white">Loading Chess Engine...</div>

  const g = gameRef.current

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center p-4 w-full">
      <div className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-2xl w-full max-w-[550px] aspect-square flex items-center justify-center">
        <Chessboard 
          options={{
            position: fen,
            boardOrientation: boardOrientation,
            onPieceDrop: onDrop,
            onSquareClick: onSquareClick,
            onPieceClick: (args: any) => {
              if (args.square) onSquareClick({ square: args.square })
            },
            squareStyles: optionSquares,
            darkSquareStyle: { backgroundColor: '#2d3748' },
            lightSquareStyle: { backgroundColor: '#a0aec0' },
            animationDurationInMs: 200
          }}
        />
      </div>

      <div className="w-full lg:w-72 flex flex-col gap-4">
        <div className="bg-white/5 p-5 rounded-xl border border-white/10 shadow-lg">
          <div className="flex bg-black/40 rounded-lg p-1 mb-4">
            <button 
              onClick={() => { setGameMode("ai"); resetGame(); }}
              className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${gameMode === "ai" ? "bg-white text-black shadow-sm" : "text-white/50 hover:bg-white/10"}`}
            >
              Vs AI
            </button>
            <button 
              onClick={() => { setGameMode("local"); resetGame(); }}
              className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${gameMode === "local" ? "bg-white text-black shadow-sm" : "text-white/50 hover:bg-white/10"}`}
            >
              Local 1v1
            </button>
          </div>
          
          <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs opacity-50 border-b border-white/10 pb-2">Game Status</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm font-semibold">State</span>
                <span className={`px-2 py-0.5 rounded text-xs font-black uppercase ${g.isGameOver() ? "bg-red-600/20 text-red-400" : "bg-emerald-600/20 text-emerald-400"}`}>
                  {g.isGameOver() ? "Game Over" : "Active"}
                </span>
            </div>
            
            {g.isCheck() && !g.isCheckmate() && (
              <div className="text-orange-500 font-bold text-xs uppercase text-right tracking-widest mt-[-4px]">
                Check!
              </div>
            )}
            
            {g.isCheckmate() && (
              <div className="text-red-500 font-bold text-xs uppercase text-right tracking-widest mt-[-4px]">
                Checkmate
              </div>
            )}

            <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm font-semibold">Turn</span>
                <span className={`px-2 py-0.5 rounded text-xs font-black uppercase ${g.turn() === "w" ? "bg-white text-black" : "bg-neutral-800 border border-neutral-600 text-white"}`}>
                  {g.turn() === "w" ? "White" : "Black"}
                  {gameMode === "ai" && (g.turn() === "b" ? " (AI)" : " (You)")}
                </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetGame}
            className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-bold uppercase tracking-wider rounded-lg transition-colors mt-6 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
          >
            Resign & Reset
          </motion.button>
        </div>

        <div className="bg-white/5 p-5 rounded-xl border border-white/10 shadow-lg flex-1 min-h-[250px] max-h-[350px] flex flex-col">
          <h3 className="text-white font-bold mb-3 uppercase tracking-widest text-xs opacity-50 border-b border-white/10 pb-2">Match History</h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {history.length === 0 ? (
              <p className="text-white/30 text-xs italic text-center mt-4">No moves played yet.</p>
            ) : (
              <div className="flex flex-col gap-1 text-sm font-mono">
                {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => (
                  <div key={i} className="flex bg-black/20 rounded px-2 py-1">
                    <div className="w-8 text-white/30 font-bold">{i + 1}.</div>
                    <div className="flex-1 text-white/80">{history[i * 2]}</div>
                    <div className="flex-1 text-white/80">{history[i * 2 + 1] || ""}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
