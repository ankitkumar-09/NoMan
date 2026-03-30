"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"

const W = 320
const H = 500
const BIRD_X = 80
const BIRD_R = 14
const GRAVITY = 0.45
const FLAP = -7.5
const PIPE_W = 52
const GAP = 130
const PIPE_SPEED = 2.5

interface Pipe { x: number; top: number }

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const gameRef = useRef({
    birdY: H / 2,
    vel: 0,
    pipes: [] as Pipe[],
    score: 0,
    highScore: 0,
    running: false,
    frame: 0,
  })

  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    const g = gameRef.current

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H)
    sky.addColorStop(0, "#0c1220")
    sky.addColorStop(0.7, "#1a1a3e")
    sky.addColorStop(1, "#0f2027")
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, W, H)

    // Stars
    ctx.fillStyle = "rgba(255,255,255,0.15)"
    for (let i = 0; i < 30; i++) {
      const sx = (i * 137 + g.frame * 0.1) % W
      const sy = (i * 97) % (H * 0.6)
      ctx.beginPath()
      ctx.arc(sx, sy, 1, 0, Math.PI * 2)
      ctx.fill()
    }

    // Ground
    ctx.fillStyle = "#1a2a1a"
    ctx.fillRect(0, H - 40, W, 40)
    ctx.fillStyle = "#2d4a2d"
    ctx.fillRect(0, H - 40, W, 3)

    // Pipes
    g.pipes.forEach((pipe) => {
      // Top pipe
      const topGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_W, 0)
      topGrad.addColorStop(0, "#1a6b3a")
      topGrad.addColorStop(0.5, "#22c55e")
      topGrad.addColorStop(1, "#1a6b3a")
      ctx.fillStyle = topGrad
      ctx.fillRect(pipe.x, 0, PIPE_W, pipe.top)
      // Cap
      ctx.fillStyle = "#15803d"
      ctx.fillRect(pipe.x - 3, pipe.top - 20, PIPE_W + 6, 20)

      // Bottom pipe
      const botTop = pipe.top + GAP
      ctx.fillStyle = topGrad
      ctx.fillRect(pipe.x, botTop, PIPE_W, H - 40 - botTop)
      ctx.fillStyle = "#15803d"
      ctx.fillRect(pipe.x - 3, botTop, PIPE_W + 6, 20)
    })

    // Bird body
    const angle = Math.min(Math.max(g.vel * 3, -30), 60)
    ctx.save()
    ctx.translate(BIRD_X, g.birdY)
    ctx.rotate((angle * Math.PI) / 180)

    // Body glow
    const bGlow = ctx.createRadialGradient(0, 0, 2, 0, 0, BIRD_R + 6)
    bGlow.addColorStop(0, "rgba(250,204,21,0.3)")
    bGlow.addColorStop(1, "rgba(250,204,21,0)")
    ctx.fillStyle = bGlow
    ctx.beginPath()
    ctx.arc(0, 0, BIRD_R + 6, 0, Math.PI * 2)
    ctx.fill()

    // Body
    ctx.fillStyle = "#facc15"
    ctx.beginPath()
    ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2)
    ctx.fill()

    // Wing
    const wingY = Math.sin(g.frame * 0.3) * 4
    ctx.fillStyle = "#f59e0b"
    ctx.beginPath()
    ctx.ellipse(-4, wingY, 10, 6, -0.3, 0, Math.PI * 2)
    ctx.fill()

    // Eye
    ctx.fillStyle = "#fff"
    ctx.beginPath()
    ctx.arc(6, -4, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.arc(7, -4, 2.5, 0, Math.PI * 2)
    ctx.fill()

    // Beak
    ctx.fillStyle = "#f97316"
    ctx.beginPath()
    ctx.moveTo(12, -2)
    ctx.lineTo(20, 2)
    ctx.lineTo(12, 5)
    ctx.closePath()
    ctx.fill()

    ctx.restore()

    // Score on canvas
    ctx.fillStyle = "rgba(255,255,255,0.9)"
    ctx.font = "bold 28px 'Geist', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(String(g.score), W / 2, 50)
  }, [])

  const tick = useCallback(() => {
    const g = gameRef.current
    if (!g.running) return

    g.frame++
    g.vel += GRAVITY
    g.birdY += g.vel

    // Spawn pipes
    if (g.frame % 90 === 0) {
      const top = 50 + Math.random() * (H - 40 - GAP - 100)
      g.pipes.push({ x: W, top })
    }

    // Move pipes
    g.pipes.forEach((p) => (p.x -= PIPE_SPEED))

    // Score
    g.pipes.forEach((p) => {
      if (Math.floor(p.x + PIPE_SPEED) > BIRD_X - BIRD_R && Math.floor(p.x) <= BIRD_X - BIRD_R) {
        g.score++
        setScore(g.score)
      }
    })

    // Remove offscreen
    g.pipes = g.pipes.filter((p) => p.x + PIPE_W > -10)

    // Collision
    const hitGround = g.birdY + BIRD_R > H - 40
    const hitCeiling = g.birdY - BIRD_R < 0
    const hitPipe = g.pipes.some(
      (p) =>
        BIRD_X + BIRD_R > p.x &&
        BIRD_X - BIRD_R < p.x + PIPE_W &&
        (g.birdY - BIRD_R < p.top || g.birdY + BIRD_R > p.top + GAP)
    )

    if (hitGround || hitCeiling || hitPipe) {
      g.running = false
      if (g.score > g.highScore) g.highScore = g.score
      setHighScore(g.highScore)
      setGameOver(true)
      draw()
      return
    }

    draw()
    rafRef.current = requestAnimationFrame(tick)
  }, [draw])

  const flap = useCallback(() => {
    const g = gameRef.current
    if (!g.running) return
    g.vel = FLAP
  }, [])

  const startGame = useCallback(() => {
    const g = gameRef.current
    g.birdY = H / 2
    g.vel = 0
    g.pipes = []
    g.score = 0
    g.frame = 0
    g.running = true
    setScore(0)
    setGameOver(false)
    setStarted(true)
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  useEffect(() => {
    draw()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault()
        if (gameRef.current.running) {
          flap()
        } else {
          startGame()
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      cancelAnimationFrame(rafRef.current)
    }
  }, [draw, flap, startGame])

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div className="flex gap-4 text-sm font-semibold">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
          <span className="text-amber-400 text-xs">SCORE</span>
          <span className="text-xl text-white">{score}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/20 border border-orange-500/30">
          <span className="text-orange-400 text-xs">BEST</span>
          <span className="text-xl text-white">{highScore}</span>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block cursor-pointer"
          onClick={() => (gameRef.current.running ? flap() : startGame())}
        />

        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <p className="text-4xl mb-2">🐦</p>
            <p className="text-white text-lg font-bold mb-1">Flappy Bird</p>
            <p className="text-white/50 text-sm mb-4">Space / Click to flap</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 rounded-full text-white font-semibold text-sm transition-colors"
            >
              Start Game
            </motion.button>
          </div>
        )}

        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <p className="text-white text-xl font-bold mb-1">Game Over</p>
            <p className="text-white/60 text-sm mb-4">Score: {score}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 rounded-full text-white font-semibold text-sm transition-colors"
            >
              Try Again
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
