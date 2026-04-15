"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const W = 440
const H = 640
const ROAD_MARGIN = 28
const LANE_COUNT = 3
const ROAD_W = W - ROAD_MARGIN * 2
const LANE_W = ROAD_W / LANE_COUNT
const CAR_W = 52
const CAR_H = 96
const BASE_TRAFFIC_SPEED = 3.2
const MAX_TRAFFIC_SPEED = 8.6
const SPEED_WARMUP_FRAMES = 3600
const SPEED_SMOOTHING = 0.008
const LEADERBOARD_KEY = "car-racing-leaderboard-v1"
const LANE_INSET = 24

interface Obstacle {
  id: number
  x: number
  y: number
  type: number
  w: number
  h: number
}

export default function CarRacing() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const obstacleIdRef = useRef(0)

  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState<number[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const [lane, setLane] = useState(1)

  const gameRef = useRef({
    lane: 1,
    targetLane: 1,
    playerX: ROAD_MARGIN + LANE_W + (LANE_W - CAR_W) / 2,
    obstacles: [] as Obstacle[],
    frame: 0,
    spawnCooldown: 48,
    running: false,
    score: 0,
    speed: BASE_TRAFFIC_SPEED,
  })

  const laneToX = useCallback(
    (laneIndex: number, width = CAR_W) => ROAD_MARGIN + laneIndex * LANE_W + LANE_INSET + (LANE_W - LANE_INSET * 2 - width) / 2,
    []
  )

  const persistLeaderboard = (scores: number[]) => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(scores))
  }

  const updateLeaderboard = useCallback((newScore: number) => {
    setLeaderboard((prev) => {
      const next = [...prev, newScore].sort((a, b) => b - a).slice(0, 5)
      persistLeaderboard(next)
      setHighScore(next[0] ?? 0)
      return next
    })
  }, [])

  const moveLane = useCallback((delta: number) => {
    const g = gameRef.current
    g.targetLane = Math.max(0, Math.min(LANE_COUNT - 1, g.targetLane + delta))
    g.lane = g.targetLane
    setLane(g.targetLane)
  }, [])

  const spawnObstacle = useCallback((): Obstacle => {
    const laneIndex = Math.floor(Math.random() * LANE_COUNT)
    const w = 46 + Math.random() * 10
    const h = 82 + Math.random() * 22
    return {
      id: ++obstacleIdRef.current,
      x: laneToX(laneIndex, w),
      y: -h - 20,
      type: Math.floor(Math.random() * 4),
      w,
      h,
    }
  }, [laneToX])

  const drawCar = (ctx: CanvasRenderingContext2D, x: number, y: number, body: string, accent: string, width = CAR_W, height = CAR_H) => {
    ctx.fillStyle = "rgba(0,0,0,0.38)"
    ctx.beginPath()
    ctx.roundRect(x + 4, y + 5, width, height, 12)
    ctx.fill()

    const bodyGrad = ctx.createLinearGradient(x, y, x + width, y)
    bodyGrad.addColorStop(0, body)
    bodyGrad.addColorStop(1, accent)
    ctx.fillStyle = bodyGrad
    ctx.beginPath()
    ctx.roundRect(x, y, width, height, 12)
    ctx.fill()

    // Gloss strip for a more realistic paint reflection.
    ctx.fillStyle = "rgba(255,255,255,0.2)"
    ctx.beginPath()
    ctx.roundRect(x + 6, y + 8, width - 14, 7, 4)
    ctx.fill()

    ctx.fillStyle = "#0f172a"
    ctx.beginPath()
    ctx.roundRect(x + 8, y + 16, width - 16, 26, 8)
    ctx.fill()

    ctx.fillStyle = "#1e293b"
    ctx.beginPath()
    ctx.roundRect(x + 10, y + 48, width - 20, 22, 7)
    ctx.fill()

    ctx.fillStyle = "#fef08a"
    ctx.beginPath()
    ctx.arc(x + 10, y + 6, 4.5, 0, Math.PI * 2)
    ctx.arc(x + width - 10, y + 6, 4.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#fca5a5"
    ctx.beginPath()
    ctx.arc(x + 10, y + height - 6, 4, 0, Math.PI * 2)
    ctx.arc(x + width - 10, y + height - 6, 4, 0, Math.PI * 2)
    ctx.fill()

    // Side markers / mirrors.
    ctx.fillStyle = "#1f2937"
    ctx.fillRect(x - 1, y + 26, 2, 8)
    ctx.fillRect(x + width - 1, y + 26, 2, 8)
  }

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    const g = gameRef.current

    // Base background
    ctx.fillStyle = "#05070c"
    ctx.fillRect(0, 0, W, H)

    // Road
    const roadGrad = ctx.createLinearGradient(0, 0, W, 0)
    roadGrad.addColorStop(0, "#111827")
    roadGrad.addColorStop(0.5, "#1f2937")
    roadGrad.addColorStop(1, "#111827")
    ctx.fillStyle = roadGrad
    ctx.fillRect(ROAD_MARGIN, 0, ROAD_W, H)

    // Side rails
    ctx.fillStyle = "#334155"
    ctx.fillRect(ROAD_MARGIN - 7, 0, 7, H)
    ctx.fillRect(ROAD_MARGIN + ROAD_W, 0, 7, H)

    // Road Lines
    ctx.strokeStyle = "rgba(255,255,255,0.35)"
    ctx.setLineDash([20, 20])
    ctx.lineWidth = 4

    const offset = (g.frame * g.speed) % 40
    ctx.beginPath()
    ctx.moveTo(ROAD_MARGIN + LANE_W, -40 + offset)
    ctx.lineTo(ROAD_MARGIN + LANE_W, H)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(ROAD_MARGIN + LANE_W * 2, -40 + offset)
    ctx.lineTo(ROAD_MARGIN + LANE_W * 2, H)
    ctx.stroke()
    ctx.setLineDash([])

    // Player Car
    const playerX = g.playerX
    const playerY = H - CAR_H - 20
    drawCar(ctx, playerX, playerY, "#dc2626", "#fb7185", CAR_W, CAR_H)

    // Obstacles
    const palette = [
      ["#3b82f6", "#93c5fd"],
      ["#22c55e", "#86efac"],
      ["#a855f7", "#c4b5fd"],
      ["#f59e0b", "#fcd34d"],
    ] as const

    g.obstacles.forEach((o) => {
      const [base, accent] = palette[o.type % palette.length]
      drawCar(ctx, o.x, o.y, base, accent, o.w, o.h)
    })
  }, [])

  const tick = useCallback(function tickFrame() {
    const g = gameRef.current
    if (!g.running) return

    g.frame++
    const progress = Math.min(1, g.frame / SPEED_WARMUP_FRAMES)
    const easedProgress = progress * progress * (3 - 2 * progress)
    const targetSpeed = BASE_TRAFFIC_SPEED + (MAX_TRAFFIC_SPEED - BASE_TRAFFIC_SPEED) * easedProgress
    g.speed += (targetSpeed - g.speed) * SPEED_SMOOTHING
    g.score += 0.075 * g.speed
    setScore(Math.floor(g.score))

    // Smooth lane transition with visible spacing between lanes.
    const targetX = laneToX(g.targetLane, CAR_W)
    g.playerX += (targetX - g.playerX) * 0.22

    // Spawn obstacles
    g.spawnCooldown--
    if (g.spawnCooldown <= 0) {
      g.obstacles.push(spawnObstacle())
      g.spawnCooldown = Math.max(34, 68 - g.speed * 1.05) + Math.floor(Math.random() * 22)
    }

    // Move obstacles
    g.obstacles.forEach((o) => {
      o.y += g.speed
    })
    g.obstacles = g.obstacles.filter((o) => o.y < H + 40)

    // Collision Detection
    const playerX = g.playerX
    const playerY = H - CAR_H - 20

    const hit = g.obstacles.some((o) =>
      playerX + 6 < o.x + o.w - 6 &&
      playerX + CAR_W - 6 > o.x + 6 &&
      playerY + 6 < o.y + o.h - 4 &&
      playerY + CAR_H - 6 > o.y + 6
    )

    if (hit) {
      g.running = false
      setGameOver(true)
      updateLeaderboard(Math.floor(g.score))
      return
    }

    draw()
    rafRef.current = requestAnimationFrame(tickFrame)
  }, [draw, laneToX, spawnObstacle, updateLeaderboard])

  const startGame = useCallback(() => {
    gameRef.current = {
      lane: 1,
      targetLane: 1,
      playerX: laneToX(1, CAR_W),
      obstacles: [],
      frame: 0,
      spawnCooldown: 34,
      running: true,
      score: 0,
      speed: BASE_TRAFFIC_SPEED,
    }
    setLane(1)
    setScore(0)
    setGameOver(false)
    setStarted(true)
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
  }, [laneToX, tick])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(LEADERBOARD_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as number[]
          if (Array.isArray(parsed)) {
            const cleaned = parsed.filter((n) => Number.isFinite(n)).map((n) => Math.floor(n)).slice(0, 5)
            setLeaderboard(cleaned)
            setHighScore(cleaned[0] ?? 0)
          }
        } catch {
          setLeaderboard([])
        }
      }
    }

    draw()
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        e.preventDefault()
        moveLane(-1)
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        e.preventDefault()
        moveLane(1)
      }
      if (!gameRef.current.running && (e.key === " " || e.key === "Enter")) {
        startGame()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => {
      window.removeEventListener("keydown", handleKey)
      cancelAnimationFrame(rafRef.current)
    }
  }, [draw, moveLane, startGame])

  return (
    <div className="flex flex-col items-center gap-5 select-none bg-black p-4 w-full">
      <div className="flex gap-6 mb-2">
        <div className="text-center px-4 py-2 bg-white/5 rounded-xl border border-white/10 min-w-32">
          <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Score</p>
          <p className="text-2xl text-white font-black">{score}</p>
        </div>
        <div className="text-center px-4 py-2 bg-white/5 rounded-xl border border-white/10 min-w-32">
          <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Best</p>
          <p className="text-2xl text-white font-black">{highScore}</p>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border-4 border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)] w-full max-w-135">
        <canvas ref={canvasRef} width={W} height={H} className="bg-[#1a1a1a] block w-full h-auto" />

        <AnimatePresence>
          {(!started || gameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-center items-center justify-center p-8 text-center flex-col"
            >
              <h2 className="text-4xl font-black text-white mb-4 italic tracking-tighter">
                {gameOver ? "CRASHED!" : "READY TO RACE?"}
              </h2>
              <p className="text-white/60 text-sm mb-8 max-w-50">
                Dodge traffic at high speed. Use Left/Right Arrow, A/D, or touch controls.
              </p>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#ef4444" }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="px-10 py-4 bg-white text-black font-black rounded-full text-lg shadow-[0_10px_30px_rgba(239,68,68,0.4)] transition-colors italic tracking-tight"
              >
                {gameOver ? "RESTART RACE" : "START ENGINE"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-135 mt-1">
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center gap-2">
          <button
            onPointerDown={(e) => {
              e.preventDefault()
              moveLane(-1)
            }}
            className="w-12 h-12 bg-white/10 rounded flex items-center justify-center text-xl text-white active:scale-95 transition-transform"
          >
            ←
          </button>
          <button
            onPointerDown={(e) => {
              e.preventDefault()
              moveLane(1)
            }}
            className="w-12 h-12 bg-white/10 rounded flex items-center justify-center text-xl text-white active:scale-95 transition-transform"
          >
            →
          </button>
          <span className="text-xs text-white/40 ml-2 uppercase font-bold tracking-widest">Steer</span>
        </div>

        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-2">Leaderboard</p>
          <div className="space-y-1 text-sm">
            {(leaderboard.length ? leaderboard : [0, 0, 0]).slice(0, 3).map((entry, idx) => (
              <div key={`${entry}-${idx}`} className="flex items-center justify-between text-white/80">
                <span className="text-white/50">#{idx + 1}</span>
                <span className="font-black">{entry}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
