"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getPlayerId, getPlayerName, setPlayerName } from "@/lib/player"
import { Trophy, X } from "lucide-react"

const CELL = 20
const SPEED_INITIAL = 120
const SPEED_MIN = 60

interface Point { x: number; y: number }

interface LeaderboardEntry {
  playerId: string
  name: string
  bestScore: number
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const touchStartRef = useRef<Point | null>(null)
  const gameRef = useRef<{
    snake: Point[]
    dir: Point
    nextDir: Point
    food: Point
    score: number
    highScore: number
    running: boolean
    speed: number
    timer: ReturnType<typeof setTimeout> | null
  }>({
    snake: [{ x: 10, y: 10 }],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 15, y: 10 },
    score: 0,
    highScore: 0,
    running: false,
    speed: SPEED_INITIAL,
    timer: null,
  })

  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)

  // Leaderboard state
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loadingBoard, setLoadingBoard] = useState(false)
  const [myRank, setMyRank] = useState<number | null>(null)
  const [showNamePrompt, setShowNamePrompt] = useState(false)
  const [nameInput, setNameInput] = useState("")
  const [nameError, setNameError] = useState("")
  const [pendingScore, setPendingScore] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const cols = 25
  const rows = 25
  const W = cols * CELL
  const H = rows * CELL

  const spawnFood = useCallback((snake: Point[]) => {
    let food: Point
    do {
      food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) }
    } while (snake.some((s) => s.x === food.x && s.y === food.y))
    return food
  }, [cols, rows])

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    const g = gameRef.current

    ctx.fillStyle = "#0a0a0a"
    ctx.fillRect(0, 0, W, H)

    ctx.strokeStyle = "rgba(255,255,255,0.03)"
    ctx.lineWidth = 1
    for (let x = 0; x <= W; x += CELL) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
    }
    for (let y = 0; y <= H; y += CELL) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
    }

    const fx = g.food.x * CELL + CELL / 2
    const fy = g.food.y * CELL + CELL / 2
    const glow = ctx.createRadialGradient(fx, fy, 2, fx, fy, CELL)
    glow.addColorStop(0, "rgba(239,68,68,0.6)")
    glow.addColorStop(1, "rgba(239,68,68,0)")
    ctx.fillStyle = glow
    ctx.fillRect(g.food.x * CELL - CELL, g.food.y * CELL - CELL, CELL * 3, CELL * 3)

    ctx.fillStyle = "#ef4444"
    ctx.beginPath()
    ctx.roundRect(g.food.x * CELL + 2, g.food.y * CELL + 2, CELL - 4, CELL - 4, 4)
    ctx.fill()

    g.snake.forEach((seg, i) => {
      const t = 1 - i / g.snake.length
      ctx.fillStyle = `hsl(145, 80%, ${25 + t * 35}%)`
      ctx.beginPath()
      ctx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, i === 0 ? 6 : 3)
      ctx.fill()
    })

    if (g.snake.length > 0) {
      const head = g.snake[0]
      ctx.fillStyle = "#fff"
      const ex = head.x * CELL + CELL / 2
      const ey = head.y * CELL + CELL / 2
      ctx.beginPath()
      ctx.arc(ex - 3, ey - 2, 2, 0, Math.PI * 2)
      ctx.arc(ex + 3, ey - 2, 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [W, H])

  const fetchLeaderboard = async () => {
    setLoadingBoard(true)
    try {
      const res = await fetch("/api/leaderboard?game=snake")
      const data = await res.json()
      setLeaderboard(data.scores || [])
      const pid = getPlayerId()
      const rank = data.scores.findIndex((s: LeaderboardEntry) => s.playerId === pid)
      setMyRank(rank === -1 ? null : rank + 1)
    } catch {
      console.error("Failed to fetch leaderboard")
    } finally {
      setLoadingBoard(false)
    }
  }

  const submitScore = async (name: string, finalScore: number) => {
    setSubmitting(true)
    try {
      const playerId = getPlayerId()
      await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, name, score: finalScore, game: "snake" }),
      })
      await fetchLeaderboard()
      setShowLeaderboard(true)
    } catch {
      console.error("Failed to submit score")
    } finally {
      setSubmitting(false)
    }
  }

  const handleGameOver = useCallback((finalScore: number) => {
    const name = getPlayerName()
    if (finalScore === 0) return // don't save 0 scores
    if (!name) {
      setPendingScore(finalScore)
      setShowNamePrompt(true)
    } else {
      submitScore(name, finalScore)
    }
  }, [])

  const handleNameSubmit = () => {
    if (!nameInput.trim()) { setNameError("Please enter a name."); return }
    if (nameInput.trim().length > 20) { setNameError("Max 20 characters."); return }
    setPlayerName(nameInput.trim())
    setShowNamePrompt(false)
    if (pendingScore !== null) submitScore(nameInput.trim(), pendingScore)
  }

  const tick = useCallback(() => {
    const g = gameRef.current
    if (!g.running) return

    g.dir = g.nextDir
    const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y }

    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
      g.running = false
      if (g.score > g.highScore) g.highScore = g.score
      setHighScore(g.highScore)
      setGameOver(true)
      handleGameOver(g.score)
      return
    }

    if (g.snake.some((s) => s.x === head.x && s.y === head.y)) {
      g.running = false
      if (g.score > g.highScore) g.highScore = g.score
      setHighScore(g.highScore)
      setGameOver(true)
      handleGameOver(g.score)
      return
    }

    g.snake.unshift(head)

    if (head.x === g.food.x && head.y === g.food.y) {
      g.score++
      setScore(g.score)
      g.food = spawnFood(g.snake)
      g.speed = Math.max(SPEED_MIN, g.speed - 2)
    } else {
      g.snake.pop()
    }

    draw()
    g.timer = setTimeout(tick, g.speed)
  }, [cols, rows, draw, spawnFood, handleGameOver])

  const startGame = useCallback(() => {
    const g = gameRef.current
    if (g.timer) clearTimeout(g.timer)
    g.snake = [{ x: 10, y: 10 }]
    g.dir = { x: 1, y: 0 }
    g.nextDir = { x: 1, y: 0 }
    g.food = spawnFood(g.snake)
    g.score = 0
    g.speed = SPEED_INITIAL
    g.running = true
    setScore(0)
    setGameOver(false)
    setStarted(true)
    draw()
    g.timer = setTimeout(tick, g.speed)
  }, [draw, tick, spawnFood])

  useEffect(() => {
    draw()
    const onKey = (e: KeyboardEvent) => {
      const g = gameRef.current
      const key = e.key.toLowerCase()
      if (["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d"].includes(key)) e.preventDefault()
      if (!g.running && (key === " " || key === "enter")) { startGame(); return }
      const dirs: Record<string, Point> = {
        arrowup: { x: 0, y: -1 }, w: { x: 0, y: -1 },
        arrowdown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
        arrowleft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
        arrowright: { x: 1, y: 0 }, d: { x: 1, y: 0 },
      }
      const nd = dirs[key]
      if (nd && !(nd.x === -g.dir.x && nd.y === -g.dir.y)) g.nextDir = nd
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      if (gameRef.current.timer) clearTimeout(gameRef.current.timer)
    }
  }, [draw, startGame])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    // Start game on first touch if not running
    if (!gameRef.current.running && !gameOver) {
      startGame()
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    const touchX = e.touches[0].clientX
    const touchY = e.touches[0].clientY
    const dx = touchX - touchStartRef.current.x
    const dy = touchY - touchStartRef.current.y
    
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
      const g = gameRef.current
      if (Math.abs(dx) > Math.abs(dy)) {
        const nd = dx > 0 ? {x: 1, y: 0} : {x: -1, y: 0}
        if (!(nd.x === -g.dir.x && nd.y === -g.dir.y)) g.nextDir = nd
      } else {
        const nd = dy > 0 ? {x: 0, y: 1} : {x: 0, y: -1}
        if (!(nd.x === -g.dir.x && nd.y === -g.dir.y)) g.nextDir = nd
      }
      touchStartRef.current = null
    }
  }

  const currentPlayerId = typeof window !== "undefined" ? getPlayerId() : ""

  return (
    <div className="flex flex-col items-center gap-4 select-none">

      {/* Score bar */}
      <div className="flex gap-4 flex-wrap justify-center text-sm font-semibold">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
          <span className="text-emerald-400 text-xs">SCORE</span>
          <span className="text-xl text-white">{score}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
          <span className="text-amber-400 text-xs">BEST</span>
          <span className="text-xl text-white">{highScore}</span>
        </div>
        <button
          onClick={() => { fetchLeaderboard(); setShowLeaderboard(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30 transition-all text-xs font-bold"
        >
          <Trophy className="w-3.5 h-3.5" /> LEADERBOARD
        </button>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl w-full max-w-[500px] aspect-square flex justify-center items-center touch-none">
        <canvas 
          ref={canvasRef} 
          width={W} 
          height={H} 
          className="block w-full h-auto aspect-square max-w-[500px]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        />

        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
            <p className="text-4xl mb-2">🐍</p>
            <p className="text-white text-lg font-bold mb-1">Snake</p>
            <p className="text-white/50 text-sm mb-4">Arrow keys, WASD, or Swipe</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startGame}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white font-semibold text-sm transition-colors">
              Start Game
            </motion.button>
          </div>
        )}

        {gameOver && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm">
            <p className="text-white text-xl font-bold mb-1">Game Over</p>
            <p className="text-white/60 text-sm mb-1">Score: {score}</p>
            {score > 0 && <p className="text-orange-400 text-xs mb-4">Score saved to leaderboard!</p>}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startGame}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white font-semibold text-sm transition-colors">
              Try Again
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Name Prompt Modal */}
      <AnimatePresence>
        {showNamePrompt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-900 border border-white/10 w-full max-w-sm rounded-3xl p-8 space-y-6 text-center shadow-2xl">
              <div className="space-y-2">
                <p className="text-3xl">🐍</p>
                <h3 className="text-xl font-bold text-white">Nice Score!</h3>
                <p className="text-white/40 text-sm">Enter your name to save to the leaderboard.</p>
              </div>
              <div className="space-y-3">
                <input autoFocus type="text" maxLength={20} value={nameInput}
                  onChange={(e) => { setNameInput(e.target.value); setNameError("") }}
                  onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-orange-500/50 text-white text-sm outline-none text-center" />
                {nameError && <p className="text-red-400 text-xs">{nameError}</p>}
                <button onClick={handleNameSubmit} disabled={submitting}
                  className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-colors disabled:opacity-60">
                  {submitting ? "Saving..." : "Save Score"}
                </button>
                <button onClick={() => setShowNamePrompt(false)}
                  className="w-full py-2 text-white/30 hover:text-white text-xs transition-colors">
                  Skip
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard Modal */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-900 border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-orange-500" />
                  <h3 className="text-xl font-bold text-white">Snake Leaderboard</h3>
                </div>
                <button onClick={() => setShowLeaderboard(false)} className="text-white/40 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
                {loadingBoard ? (
                  <div className="text-center py-8 text-white/30 text-sm">Loading...</div>
                ) : leaderboard.length === 0 ? (
                  <div className="text-center py-8 text-white/30 text-sm">No scores yet. Be the first!</div>
                ) : (
                  leaderboard.map((entry, i) => {
                    const isMe = entry.playerId === currentPlayerId
                    const medals = ["🥇", "🥈", "🥉"]
                    return (
                      <div key={entry.playerId}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                          isMe ? "bg-orange-600/10 border-orange-500/30" : "bg-white/[0.02] border-white/5"
                        }`}>
                        <div className="flex items-center gap-3">
                          <span className="text-lg w-6 text-center">{i < 3 ? medals[i] : `${i + 1}.`}</span>
                          <span className={`font-semibold text-sm ${isMe ? "text-orange-400" : "text-white"}`}>
                            {entry.name}
                            {isMe && <span className="ml-2 text-[10px] text-orange-500/70 font-normal">(you)</span>}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-white font-bold text-sm">{entry.bestScore}</span>
                          <span className="text-white/30 text-xs">pts</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {myRank && myRank > 10 && (
                <div className="px-6 pb-2 text-center text-white/30 text-xs">Your rank: #{myRank}</div>
              )}

              <div className="p-6 border-t border-white/5">
                <button onClick={() => setShowLeaderboard(false)}
                  className="w-full py-2.5 bg-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/15 transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}