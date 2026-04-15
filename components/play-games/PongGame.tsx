"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"

const W = 500
const H = 500
const PADDLE_W = 10
const PADDLE_H = 80
const BALL_R = 8
const BALL_SPEED = 3.4
const MIN_BALL_SPEED = 3.2
const MAX_BALL_SPEED = 7.2
const WALL_REBOUND_BOOST = 0.995
const PADDLE_REBOUND_BOOST = 1
const WALL_HIT_SPEED_GAIN = 0
const PADDLE_HIT_SPEED_GAIN = 0
const WALL_PADDING = 6
const PADDLE_EDGE_BUFFER = 6
const AI_SPEED = 3.2
const PLAYER_SPEED = 6

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const keysRef = useRef<Set<string>>(new Set())
  const gameRef = useRef({
    playerY: H / 2 - PADDLE_H / 2,
    aiY: H / 2 - PADDLE_H / 2,
    ballX: W / 2,
    ballY: H / 2,
    ballVX: BALL_SPEED,
    ballVY: BALL_SPEED * 0.6,
    playerScore: 0,
    aiScore: 0,
    running: false,
    paused: false,
  })

  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [started, setStarted] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [targetScore, setTargetScore] = useState(7)

  const resetBall = useCallback((dir: number) => {
    const g = gameRef.current
    g.ballX = W / 2
    g.ballY = H / 2
    const angle = ((Math.random() * 60 - 30) * Math.PI) / 180
    g.ballVX = BALL_SPEED * dir * Math.cos(angle)
    g.ballVY = BALL_SPEED * Math.sin(angle)
  }, [])

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    const g = gameRef.current

    // Background
    ctx.fillStyle = "#0a0a0a"
    ctx.fillRect(0, 0, W, H)

    // Center line
    ctx.setLineDash([8, 8])
    ctx.strokeStyle = "rgba(255,255,255,0.1)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(W / 2, 0)
    ctx.lineTo(W / 2, H)
    ctx.stroke()
    ctx.setLineDash([])

    // Center circle
    ctx.strokeStyle = "rgba(255,255,255,0.06)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(W / 2, H / 2, 50, 0, Math.PI * 2)
    ctx.stroke()

    // Player paddle
    const pGrad = ctx.createLinearGradient(15, g.playerY, 15 + PADDLE_W, g.playerY)
    pGrad.addColorStop(0, "#3b82f6")
    pGrad.addColorStop(1, "#60a5fa")
    ctx.fillStyle = pGrad
    ctx.beginPath()
    ctx.roundRect(15, g.playerY, PADDLE_W, PADDLE_H, 5)
    ctx.fill()

    // Paddle glow
    ctx.shadowColor = "#3b82f6"
    ctx.shadowBlur = 15
    ctx.fillStyle = "rgba(59,130,246,0.3)"
    ctx.beginPath()
    ctx.roundRect(15, g.playerY, PADDLE_W, PADDLE_H, 5)
    ctx.fill()
    ctx.shadowBlur = 0

    // AI paddle
    const aGrad = ctx.createLinearGradient(W - 25, g.aiY, W - 25 + PADDLE_W, g.aiY)
    aGrad.addColorStop(0, "#ef4444")
    aGrad.addColorStop(1, "#f87171")
    ctx.fillStyle = aGrad
    ctx.beginPath()
    ctx.roundRect(W - 25, g.aiY, PADDLE_W, PADDLE_H, 5)
    ctx.fill()

    ctx.shadowColor = "#ef4444"
    ctx.shadowBlur = 15
    ctx.fillStyle = "rgba(239,68,68,0.3)"
    ctx.beginPath()
    ctx.roundRect(W - 25, g.aiY, PADDLE_W, PADDLE_H, 5)
    ctx.fill()
    ctx.shadowBlur = 0

    // Ball trail
    ctx.fillStyle = "rgba(255,255,255,0.08)"
    ctx.beginPath()
    ctx.arc(g.ballX - g.ballVX * 2, g.ballY - g.ballVY * 2, BALL_R * 0.7, 0, Math.PI * 2)
    ctx.fill()

    // Ball
    ctx.shadowColor = "#fff"
    ctx.shadowBlur = 20
    ctx.fillStyle = "#fff"
    ctx.beginPath()
    ctx.arc(g.ballX, g.ballY, BALL_R, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    // Scores
    ctx.fillStyle = "rgba(255,255,255,0.15)"
    ctx.font = "bold 56px 'Geist', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(String(g.playerScore), W / 4, 70)
    ctx.fillText(String(g.aiScore), (W * 3) / 4, 70)
  }, [])

  const tick = useCallback(function tickFrame() {
    const g = gameRef.current
    if (!g.running) return

    // Player input
    if (keysRef.current.has("arrowup") || keysRef.current.has("w")) {
      g.playerY = Math.max(0, g.playerY - PLAYER_SPEED)
    }
    if (keysRef.current.has("arrowdown") || keysRef.current.has("s")) {
      g.playerY = Math.min(H - PADDLE_H, g.playerY + PLAYER_SPEED)
    }

    // AI
    const aiCenter = g.aiY + PADDLE_H / 2
    if (aiCenter < g.ballY - 15) g.aiY += AI_SPEED
    if (aiCenter > g.ballY + 15) g.aiY -= AI_SPEED
    g.aiY = Math.max(0, Math.min(H - PADDLE_H, g.aiY))

    // Ball movement
    g.ballX += g.ballVX
    g.ballY += g.ballVY

    // Top/bottom walls
    if (g.ballY - BALL_R <= WALL_PADDING || g.ballY + BALL_R >= H - WALL_PADDING) {
      const hitTop = g.ballY - BALL_R <= WALL_PADDING
      const speed = Math.hypot(g.ballVX, g.ballVY)
      const boostedSpeed = Math.min(
        MAX_BALL_SPEED,
        Math.max(MIN_BALL_SPEED, speed * WALL_REBOUND_BOOST + WALL_HIT_SPEED_GAIN)
      )
      const horizontalRatio = Math.min(Math.max(Math.abs(g.ballVX) / Math.max(speed, 0.001), 0.32), 0.92)
      const verticalRatio = Math.sqrt(1 - horizontalRatio * horizontalRatio)

      g.ballVX = Math.sign(g.ballVX || 1) * boostedSpeed * horizontalRatio
      g.ballVY = (hitTop ? 1 : -1) * boostedSpeed * verticalRatio
      g.ballY = hitTop ? WALL_PADDING + BALL_R : H - WALL_PADDING - BALL_R
    }

    // Player paddle collision
    if (
      g.ballX - BALL_R <= 25 &&
      g.ballX + BALL_R >= 15 &&
      g.ballY + BALL_R >= g.playerY - PADDLE_EDGE_BUFFER &&
      g.ballY - BALL_R <= g.playerY + PADDLE_H + PADDLE_EDGE_BUFFER
    ) {
      const relYRaw = (g.ballY - g.playerY - PADDLE_H / 2) / (PADDLE_H / 2)
      const relY = Math.max(-1, Math.min(1, relYRaw))
      const speed = Math.min(
        MAX_BALL_SPEED,
        Math.max(MIN_BALL_SPEED, Math.sqrt(g.ballVX ** 2 + g.ballVY ** 2) * PADDLE_REBOUND_BOOST + PADDLE_HIT_SPEED_GAIN)
      )
      const angle = relY * (Math.PI / 4)
      g.ballVX = Math.abs(speed * Math.cos(angle))
      g.ballVY = speed * Math.sin(angle)
      g.ballX = 25 + BALL_R
    }

    // AI paddle collision
    if (
      g.ballX + BALL_R >= W - 25 &&
      g.ballX - BALL_R <= W - 15 &&
      g.ballY + BALL_R >= g.aiY - PADDLE_EDGE_BUFFER &&
      g.ballY - BALL_R <= g.aiY + PADDLE_H + PADDLE_EDGE_BUFFER
    ) {
      const relYRaw = (g.ballY - g.aiY - PADDLE_H / 2) / (PADDLE_H / 2)
      const relY = Math.max(-1, Math.min(1, relYRaw))
      const speed = Math.min(
        MAX_BALL_SPEED,
        Math.max(MIN_BALL_SPEED, Math.sqrt(g.ballVX ** 2 + g.ballVY ** 2) * PADDLE_REBOUND_BOOST + PADDLE_HIT_SPEED_GAIN)
      )
      const angle = relY * (Math.PI / 4)
      g.ballVX = -Math.abs(speed * Math.cos(angle))
      g.ballVY = speed * Math.sin(angle)
      g.ballX = W - 25 - BALL_R
    }

    // Score
    if (g.ballX < 0) {
      g.aiScore++
      setAiScore(g.aiScore)
      if (g.aiScore >= targetScore) {
        g.running = false
        setWinner("AI")
        draw()
        return
      }
      resetBall(1)
    }
    if (g.ballX > W) {
      g.playerScore++
      setPlayerScore(g.playerScore)
      if (g.playerScore >= targetScore) {
        g.running = false
        setWinner("Player")
        draw()
        return
      }
      resetBall(-1)
    }

    draw()
    rafRef.current = requestAnimationFrame(tickFrame)
  }, [draw, resetBall, targetScore])

  const startGame = useCallback(() => {
    const g = gameRef.current
    g.playerY = H / 2 - PADDLE_H / 2
    g.aiY = H / 2 - PADDLE_H / 2
    g.playerScore = 0
    g.aiScore = 0
    g.running = true
    setPlayerScore(0)
    setAiScore(0)
    setWinner(null)
    setStarted(true)
    resetBall(1)
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
  }, [tick, resetBall])

  useEffect(() => {
    draw()
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (["arrowup", "arrowdown", "w", "s"].includes(k)) e.preventDefault()
      keysRef.current.add(k)
      if (!gameRef.current.running && (k === " " || k === "enter")) startGame()
    }
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase())
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      cancelAnimationFrame(rafRef.current)
    }
  }, [draw, startGame])

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div className="flex gap-6 text-sm font-semibold">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30">
          <span className="text-blue-400 text-xs">YOU</span>
          <span className="text-xl text-white">{playerScore}</span>
        </div>
        <span className="flex items-center text-white/30 text-xs">First to {targetScore}</span>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30">
          <span className="text-red-400 text-xs">AI</span>
          <span className="text-xl text-white">{aiScore}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-white/70">
        <span className="uppercase tracking-widest text-white/40">Rounds</span>
        <select
          value={targetScore}
          onChange={(e) => setTargetScore(Number(e.target.value))}
          className="bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-white outline-none"
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={7}>7</option>
          <option value={9}>9</option>
        </select>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <canvas ref={canvasRef} width={W} height={H} className="block" />

        {!started && !winner && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <p className="text-4xl mb-2">🏓</p>
            <p className="text-white text-lg font-bold mb-1">Pong</p>
            <p className="text-white/50 text-sm mb-4">↑/↓ or W/S to move</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 rounded-full text-white font-semibold text-sm transition-colors"
            >
              Start Game
            </motion.button>
          </div>
        )}

        {winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm"
          >
            <p className="text-white/60 text-xs uppercase tracking-[0.2em] mb-1">Game Over</p>
            <p className="text-white text-xl font-bold mb-1">
              {winner === "Player" ? "🎉 You Win!" : "🤖 AI Wins!"}
            </p>
            <p className="text-white/60 text-sm mb-4">
              {playerScore} — {aiScore}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 rounded-full text-white font-semibold text-sm transition-colors"
            >
              Rematch
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
