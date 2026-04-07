"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"

const W = 500
const H = 500
const PADDLE_W = 10
const PADDLE_H = 80
const BALL_R = 8
const BALL_SPEED = 4.5
const AI_SPEED = 3.2
const PLAYER_SPEED = 6
const WIN_SCORE = 7

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const keysRef = useRef<Set<string>>(new Set())
  const touchStartRef = useRef<number | null>(null)
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

  const tick = useCallback(() => {
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
    if (g.ballY - BALL_R <= 0 || g.ballY + BALL_R >= H) {
      g.ballVY = -g.ballVY
      g.ballY = g.ballY - BALL_R <= 0 ? BALL_R : H - BALL_R
    }

    // Player paddle collision
    if (
      g.ballX - BALL_R <= 25 &&
      g.ballX - BALL_R >= 15 &&
      g.ballY >= g.playerY &&
      g.ballY <= g.playerY + PADDLE_H
    ) {
      const relY = (g.ballY - g.playerY - PADDLE_H / 2) / (PADDLE_H / 2)
      const speed = Math.sqrt(g.ballVX ** 2 + g.ballVY ** 2) * 1.05
      const angle = relY * (Math.PI / 4)
      g.ballVX = Math.abs(speed * Math.cos(angle))
      g.ballVY = speed * Math.sin(angle)
      g.ballX = 25 + BALL_R
    }

    // AI paddle collision
    if (
      g.ballX + BALL_R >= W - 25 &&
      g.ballX + BALL_R <= W - 15 &&
      g.ballY >= g.aiY &&
      g.ballY <= g.aiY + PADDLE_H
    ) {
      const relY = (g.ballY - g.aiY - PADDLE_H / 2) / (PADDLE_H / 2)
      const speed = Math.sqrt(g.ballVX ** 2 + g.ballVY ** 2) * 1.05
      const angle = relY * (Math.PI / 4)
      g.ballVX = -Math.abs(speed * Math.cos(angle))
      g.ballVY = speed * Math.sin(angle)
      g.ballX = W - 25 - BALL_R
    }

    // Score
    if (g.ballX < 0) {
      g.aiScore++
      setAiScore(g.aiScore)
      if (g.aiScore >= WIN_SCORE) {
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
      if (g.playerScore >= WIN_SCORE) {
        g.running = false
        setWinner("Player")
        draw()
        return
      }
      resetBall(-1)
    }

    draw()
    rafRef.current = requestAnimationFrame(tick)
  }, [draw, resetBall])

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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!gameRef.current.running && !winner) {
      startGame()
      return
    }
    touchStartRef.current = e.touches[0].clientY
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return
    const touchY = e.touches[0].clientY
    const dy = touchY - touchStartRef.current
    const g = gameRef.current
    g.playerY = Math.max(0, Math.min(H - PADDLE_H, g.playerY + dy * 1.5))
    touchStartRef.current = touchY
  }
  const handleTouchEnd = () => {
    touchStartRef.current = null
  }

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div className="flex gap-6 text-sm font-semibold">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30">
          <span className="text-blue-400 text-xs">YOU</span>
          <span className="text-xl text-white">{playerScore}</span>
        </div>
        <span className="flex items-center text-white/30 text-xs">First to {WIN_SCORE}</span>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30">
          <span className="text-red-400 text-xs">AI</span>
          <span className="text-xl text-white">{aiScore}</span>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl w-full max-w-[500px] aspect-square flex justify-center items-center touch-none">
        <canvas 
          ref={canvasRef} 
          width={W} 
          height={H} 
          className="block w-full h-auto aspect-square max-w-[500px]" 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

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
