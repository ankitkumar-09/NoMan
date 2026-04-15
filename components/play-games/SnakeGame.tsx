"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"

const CELL = 20
const SPEED_INITIAL = 120
const SPEED_MIN = 60

interface Point { x: number; y: number }

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
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

    // Background
    ctx.fillStyle = "#0a0a0a"
    ctx.fillRect(0, 0, W, H)

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.03)"
    ctx.lineWidth = 1
    for (let x = 0; x <= W; x += CELL) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
    }
    for (let y = 0; y <= H; y += CELL) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
    }

    // Food glow
    const fx = g.food.x * CELL + CELL / 2
    const fy = g.food.y * CELL + CELL / 2
    const glow = ctx.createRadialGradient(fx, fy, 2, fx, fy, CELL)
    glow.addColorStop(0, "rgba(239,68,68,0.6)")
    glow.addColorStop(1, "rgba(239,68,68,0)")
    ctx.fillStyle = glow
    ctx.fillRect(g.food.x * CELL - CELL, g.food.y * CELL - CELL, CELL * 3, CELL * 3)

    // Food
    ctx.fillStyle = "#ef4444"
    ctx.beginPath()
    ctx.roundRect(g.food.x * CELL + 2, g.food.y * CELL + 2, CELL - 4, CELL - 4, 4)
    ctx.fill()

    // Snake
    g.snake.forEach((seg, i) => {
      const t = 1 - i / g.snake.length
      ctx.fillStyle = `hsl(145, 80%, ${25 + t * 35}%)`
      ctx.beginPath()
      ctx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, i === 0 ? 6 : 3)
      ctx.fill()
    })

    // Snake eyes (head)
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
  }, [W, H, cols, rows])

  const tick = useCallback(function tickFrame() {
    const g = gameRef.current
    if (!g.running) return

    g.dir = g.nextDir
    const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y }

    // Wall collision
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
      g.running = false
      if (g.score > g.highScore) g.highScore = g.score
      setHighScore(g.highScore)
      setGameOver(true)
      return
    }

    // Self collision
    if (g.snake.some((s) => s.x === head.x && s.y === head.y)) {
      g.running = false
      if (g.score > g.highScore) g.highScore = g.score
      setHighScore(g.highScore)
      setGameOver(true)
      return
    }

    g.snake.unshift(head)

    // Eat food
    if (head.x === g.food.x && head.y === g.food.y) {
      g.score++
      setScore(g.score)
      g.food = spawnFood(g.snake)
      g.speed = Math.max(SPEED_MIN, g.speed - 2)
    } else {
      g.snake.pop()
    }

    draw()
    g.timer = setTimeout(tickFrame, g.speed)
  }, [cols, rows, draw, spawnFood])

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
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) {
        e.preventDefault()
      }
      if (!g.running && (key === " " || key === "enter")) {
        startGame()
        return
      }
      const dirs: Record<string, Point> = {
        arrowup: { x: 0, y: -1 }, w: { x: 0, y: -1 },
        arrowdown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
        arrowleft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
        arrowright: { x: 1, y: 0 }, d: { x: 1, y: 0 },
      }
      const nd = dirs[key]
      if (nd && !(nd.x === -g.dir.x && nd.y === -g.dir.y)) {
        g.nextDir = nd
      }
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      if (gameRef.current.timer) clearTimeout(gameRef.current.timer)
    }
  }, [draw, startGame])

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Score bar */}
      <div className="flex gap-6 text-sm font-semibold">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
          <span className="text-emerald-400 text-xs">SCORE</span>
          <span className="text-xl text-white">{score}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
          <span className="text-amber-400 text-xs">BEST</span>
          <span className="text-xl text-white">{highScore}</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <canvas ref={canvasRef} width={W} height={H} className="block" />

        {/* Overlays */}
        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
            <p className="text-4xl mb-2">🐍</p>
            <p className="text-white text-lg font-bold mb-1">Snake</p>
            <p className="text-white/50 text-sm mb-4">Arrow keys or WASD</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white font-semibold text-sm transition-colors"
            >
              Start Game
            </motion.button>
          </div>
        )}

        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm"
          >
            <p className="text-white text-xl font-bold mb-1">Game Over</p>
            <p className="text-white/60 text-sm mb-4">Score: {score}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white font-semibold text-sm transition-colors"
            >
              Try Again
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
