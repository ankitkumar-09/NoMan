"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const W = 920
const H = 500
const ROAD_MARGIN = 120
const ROAD_W = W - ROAD_MARGIN * 2
const LANE_COUNT = 4
const LANE_W = ROAD_W / LANE_COUNT
const PLAYER_W = 56
const PLAYER_H = 96
const BASE_SPEED = 3
const MAX_SPEED = 10.8
const SPEED_RAMP_PER_FRAME = 0.0021
const SPEED_SMOOTHING = 0.02
const LEADERBOARD_KEY = "bike-racing-leaderboard-v1"

interface TrafficBike {
  id: number
  lane: number
  x: number
  y: number
  w: number
  h: number
  kind: "bike" | "car" | "barrier" | "cone"
  speedFactor: number
  body: string
  accent: string
}

export default function BikeRacing() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const trafficIdRef = useRef(0)

  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState<number[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)

  const gameRef = useRef({
    lane: 1,
    targetLane: 1,
    bikeX: 0,
    traffic: [] as TrafficBike[],
    frame: 0,
    spawnCooldown: 48,
    running: false,
    score: 0,
    speed: BASE_SPEED,
  })

  const laneToX = useCallback((lane: number, width: number) => {
    return ROAD_MARGIN + lane * LANE_W + (LANE_W - width) / 2
  }, [])

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

  const finishRun = useCallback((finalScore: number) => {
    setGameOver(true)
    updateLeaderboard(finalScore)
  }, [updateLeaderboard])

  const drawBike = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, body: string, accent: string) => {
      const cx = x + w / 2
      const frontY = y + 13
      const rearY = y + h - 13
      const wheelR = Math.max(12, w * 0.26)
      const tireHalfW = wheelR * 0.62
      const tireHalfH = wheelR * 1.02

      // Ground shadow.
      ctx.fillStyle = "rgba(0,0,0,0.34)"
      ctx.beginPath()
      ctx.ellipse(cx, y + h + 7, w * 0.45, 7, 0, 0, Math.PI * 2)
      ctx.fill()

      // Front and rear tire groups.
      const drawWheel = (py: number) => {
        ctx.fillStyle = "#020617"
        ctx.beginPath()
        ctx.ellipse(cx, py, tireHalfW, tireHalfH, 0, 0, Math.PI * 2)
        ctx.fill()

        // Tire sidewall highlight for a more realistic profile.
        ctx.fillStyle = "rgba(148,163,184,0.2)"
        ctx.beginPath()
        ctx.ellipse(cx, py - tireHalfH * 0.35, tireHalfW * 0.75, tireHalfH * 0.32, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#64748b"
        ctx.beginPath()
        ctx.ellipse(cx, py, tireHalfW * 0.48, tireHalfH * 0.48, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = "rgba(226,232,240,0.6)"
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(cx - tireHalfW * 0.42, py)
        ctx.lineTo(cx + tireHalfW * 0.42, py)
        ctx.moveTo(cx, py - tireHalfH * 0.4)
        ctx.lineTo(cx, py + tireHalfH * 0.4)
        ctx.stroke()
      }

      drawWheel(frontY)
      drawWheel(rearY)

      // Fork and rear swing arm.
      ctx.strokeStyle = "#cbd5e1"
      ctx.lineWidth = 2.4
      ctx.beginPath()
      ctx.moveTo(cx - 4, y + 24)
      ctx.lineTo(cx - 2, frontY + 2)
      ctx.moveTo(cx + 4, y + 24)
      ctx.lineTo(cx + 2, frontY + 2)
      ctx.moveTo(cx - 4, y + h - 24)
      ctx.lineTo(cx - 2, rearY - 2)
      ctx.moveTo(cx + 4, y + h - 24)
      ctx.lineTo(cx + 2, rearY - 2)
      ctx.stroke()

      // Long handlebar at the front.
      const handleY = y + 20
      const halfHandle = Math.max(20, w * 0.45)
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 2.8
      ctx.beginPath()
      ctx.moveTo(cx - halfHandle, handleY)
      ctx.lineTo(cx + halfHandle, handleY)
      ctx.stroke()

      // Handlebar grips.
      ctx.strokeStyle = "#0f172a"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(cx - halfHandle - 4, handleY)
      ctx.lineTo(cx - halfHandle + 6, handleY)
      ctx.moveTo(cx + halfHandle - 6, handleY)
      ctx.lineTo(cx + halfHandle + 4, handleY)
      ctx.stroke()

      // Sport bike fairing shell.
      const bikeBody = ctx.createLinearGradient(x, y, x + w, y)
      bikeBody.addColorStop(0, body)
      bikeBody.addColorStop(1, accent)
      ctx.fillStyle = bikeBody
      ctx.beginPath()
      ctx.moveTo(cx - 8, y + 22)
      ctx.quadraticCurveTo(cx - 16, y + 34, cx - 13, y + h - 34)
      ctx.lineTo(cx - 8, y + h - 24)
      ctx.lineTo(cx + 8, y + h - 24)
      ctx.lineTo(cx + 13, y + h - 34)
      ctx.quadraticCurveTo(cx + 16, y + 34, cx + 8, y + 22)
      ctx.closePath()
      ctx.fill()

      // Tank and seat.
      ctx.fillStyle = "#111827"
      ctx.beginPath()
      ctx.roundRect(cx - 12, y + 34, 24, 24, 9)
      ctx.fill()
      ctx.beginPath()
      ctx.roundRect(cx - 9, y + h - 50, 18, 19, 6)
      ctx.fill()

      // Rider silhouette.
      ctx.fillStyle = "#1e293b"
      ctx.beginPath()
      ctx.ellipse(cx, y + 48, 9, 12, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#0f172a"
      ctx.beginPath()
      ctx.arc(cx, y + 39, 7.5, 0, Math.PI * 2)
      ctx.fill()

      // Windshield and lights.
      ctx.fillStyle = "rgba(186,230,253,0.78)"
      ctx.beginPath()
      ctx.roundRect(cx - 8, y + 25, 16, 11, 4)
      ctx.fill()

      ctx.fillStyle = "#fde68a"
      ctx.beginPath()
      ctx.arc(cx, frontY, 3.4, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#f87171"
      ctx.beginPath()
      ctx.arc(cx, rearY, 3.2, 0, Math.PI * 2)
      ctx.fill()

      // Highlight strip.
      ctx.fillStyle = "rgba(255,255,255,0.2)"
      ctx.beginPath()
      ctx.roundRect(cx - 7, y + 24, 14, 6, 3)
      ctx.fill()
    },
    []
  )

  const drawCar = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, body: string, accent: string) => {
    ctx.fillStyle = "rgba(0,0,0,0.34)"
    ctx.beginPath()
    ctx.ellipse(x + w / 2, y + h + 6, w * 0.45, 7, 0, 0, Math.PI * 2)
    ctx.fill()

    const grad = ctx.createLinearGradient(x, y, x + w, y)
    grad.addColorStop(0, body)
    grad.addColorStop(1, accent)
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, 10)
    ctx.fill()

    ctx.fillStyle = "rgba(255,255,255,0.16)"
    ctx.fillRect(x + 7, y + 8, w - 14, 7)

    ctx.fillStyle = "#0f172a"
    ctx.beginPath()
    ctx.roundRect(x + 8, y + 18, w - 16, 24, 6)
    ctx.fill()

    ctx.fillStyle = "#fef08a"
    ctx.beginPath()
    ctx.arc(x + 8, y + 6, 3.5, 0, Math.PI * 2)
    ctx.arc(x + w - 8, y + 6, 3.5, 0, Math.PI * 2)
    ctx.fill()
  }, [])

  const drawBarrier = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = "rgba(0,0,0,0.32)"
    ctx.fillRect(x + 2, y + h, w, 6)

    ctx.fillStyle = "#dc2626"
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, 4)
    ctx.fill()

    ctx.strokeStyle = "#facc15"
    ctx.lineWidth = 2
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    ctx.moveTo(x + 4, y + 10)
    ctx.lineTo(x + w - 4, y + 10)
    ctx.moveTo(x + 4, y + h - 10)
    ctx.lineTo(x + w - 4, y + h - 10)
    ctx.stroke()
    ctx.setLineDash([])
  }, [])

  const drawCone = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = "rgba(0,0,0,0.3)"
    ctx.beginPath()
    ctx.ellipse(x + w / 2, y + h + 4, w * 0.45, 4, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#f97316"
    ctx.beginPath()
    ctx.moveTo(x + w / 2, y)
    ctx.lineTo(x + w, y + h)
    ctx.lineTo(x, y + h)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = "#fde68a"
    ctx.fillRect(x + w / 2 - 3, y + 8, 6, 6)
    ctx.fillRect(x + w / 2 - 4, y + h - 12, 8, 5)
  }, [])

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    const g = gameRef.current

    const sky = ctx.createLinearGradient(0, 0, 0, H)
    sky.addColorStop(0, "#020617")
    sky.addColorStop(1, "#0f172a")
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, W, H)

    const roadGrad = ctx.createLinearGradient(0, 0, W, 0)
    roadGrad.addColorStop(0, "#0f172a")
    roadGrad.addColorStop(0.5, "#1f2937")
    roadGrad.addColorStop(1, "#0f172a")
    ctx.fillStyle = roadGrad
    ctx.fillRect(ROAD_MARGIN, 0, ROAD_W, H)

    ctx.fillStyle = "#334155"
    ctx.fillRect(ROAD_MARGIN - 8, 0, 8, H)
    ctx.fillRect(ROAD_MARGIN + ROAD_W, 0, 8, H)

    const laneOffset = (g.frame * g.speed * 1.9) % 64
    ctx.strokeStyle = "rgba(255,255,255,0.36)"
    ctx.lineWidth = 3
    ctx.setLineDash([26, 18])
    for (let i = 1; i < LANE_COUNT; i++) {
      ctx.beginPath()
      ctx.moveTo(ROAD_MARGIN + i * LANE_W, -64 + laneOffset)
      ctx.lineTo(ROAD_MARGIN + i * LANE_W, H)
      ctx.stroke()
    }
    ctx.setLineDash([])

    const playerY = H - PLAYER_H - 30
    drawBike(ctx, g.bikeX, playerY, PLAYER_W, PLAYER_H, "#f43f5e", "#fb7185")

    g.traffic.forEach((bike) => {
      if (bike.kind === "bike") {
        drawBike(ctx, bike.x, bike.y, bike.w, bike.h, bike.body, bike.accent)
        return
      }
      if (bike.kind === "car") {
        drawCar(ctx, bike.x, bike.y, bike.w, bike.h, bike.body, bike.accent)
        return
      }
      if (bike.kind === "barrier") {
        drawBarrier(ctx, bike.x, bike.y, bike.w, bike.h)
        return
      }
      if (bike.kind === "cone") {
        drawCone(ctx, bike.x, bike.y, bike.w, bike.h)
        return
      }
      drawBarrier(ctx, bike.x, bike.y, bike.w, bike.h)
    })
  }, [drawBarrier, drawBike, drawCar, drawCone])

  const tick = useCallback(function tickFrame() {
    const g = gameRef.current
    if (!g.running) return

    g.frame++
    const targetSpeed = Math.min(BASE_SPEED + g.frame * SPEED_RAMP_PER_FRAME, MAX_SPEED)
    g.speed += (targetSpeed - g.speed) * SPEED_SMOOTHING
    g.score += g.speed * 0.06
    setScore(Math.floor(g.score))

    const targetX = laneToX(g.targetLane, PLAYER_W)
    g.bikeX += (targetX - g.bikeX) * 0.24

    g.spawnCooldown--
    if (g.spawnCooldown <= 0) {
      const lane = Math.floor(Math.random() * LANE_COUNT)
      const roll = Math.random()
      const palette = [
        ["#3b82f6", "#93c5fd"],
        ["#22c55e", "#86efac"],
        ["#f59e0b", "#fcd34d"],
        ["#a855f7", "#c4b5fd"],
      ] as const
      const [body, accent] = palette[Math.floor(Math.random() * palette.length)]

      let kind: TrafficBike["kind"] = "bike"
      let w = 50 + Math.random() * 8
      let h = 86 + Math.random() * 12
      let speedFactor = 1

      if (roll < 0.22) {
        kind = "bike"
        w = 50 + Math.random() * 8
        h = 86 + Math.random() * 12
        speedFactor = 1.02
      } else if (roll < 0.4) {
        kind = "car"
        w = 56 + Math.random() * 10
        h = 96 + Math.random() * 14
        speedFactor = 0.96
      } else if (roll < 0.74) {
        kind = "barrier"
        w = 54
        h = 42
        speedFactor = 0.92
      } else {
        kind = "cone"
        w = 30
        h = 38
        speedFactor = 0.95
      }

      g.traffic.push({
        id: ++trafficIdRef.current,
        lane,
        x: laneToX(lane, w),
        y: -h - 18,
        w,
        h,
        kind,
        speedFactor,
        body,
        accent,
      })

      g.spawnCooldown = Math.max(24, 60 - g.speed * 1.4) + Math.floor(Math.random() * 20)
    }

    g.traffic.forEach((bike) => {
      bike.y += (g.speed + 0.6) * bike.speedFactor
    })
    g.traffic = g.traffic.filter((bike) => bike.y < H + 26)

    const playerY = H - PLAYER_H - 30
    const hit = g.traffic.some((bike) =>
      g.bikeX + 7 < bike.x + bike.w - 7 &&
      g.bikeX + PLAYER_W - 7 > bike.x + 7 &&
      playerY + 8 < bike.y + bike.h - 8 &&
      playerY + PLAYER_H - 8 > bike.y + 8
    )

    if (hit || g.bikeX < ROAD_MARGIN || g.bikeX + PLAYER_W > ROAD_MARGIN + ROAD_W) {
      g.running = false
      finishRun(Math.floor(g.score))
      return
    }

    draw()
    rafRef.current = requestAnimationFrame(tickFrame)
  }, [draw, finishRun, laneToX])

  const startGame = useCallback(() => {
    gameRef.current = {
      lane: 1,
      targetLane: 1,
      bikeX: laneToX(1, PLAYER_W),
      traffic: [],
      frame: 0,
      spawnCooldown: 34,
      running: true,
      score: 0,
      speed: BASE_SPEED,
    }
    setScore(0)
    setGameOver(false)
    setStarted(true)
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
  }, [laneToX, tick])

  const steer = useCallback((delta: number) => {
    const g = gameRef.current
    g.targetLane = Math.max(0, Math.min(LANE_COUNT - 1, g.targetLane + delta))
    g.lane = g.targetLane
  }, [])

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
      const k = e.key.toLowerCase()
      if (k === "arrowleft" || k === "a") {
        e.preventDefault()
        steer(-1)
        return
      }
      if (k === "arrowright" || k === "d") {
        e.preventDefault()
        steer(1)
        return
      }
      if (!gameRef.current.running && (k === " " || k === "enter")) {
        e.preventDefault()
        startGame()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => {
      window.removeEventListener("keydown", handleKey)
      cancelAnimationFrame(rafRef.current)
    }
  }, [draw, startGame, steer])

  return (
    <div className="flex flex-col items-center gap-5 select-none bg-black p-4 w-full h-full justify-center">
      <div className="flex gap-4">
        <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-center min-w-30">
          <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest block">Distance</span>
          <span className="text-2xl text-white font-black">{score}m</span>
        </div>
        <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-center min-w-30">
          <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest block">Record</span>
          <span className="text-2xl text-white font-black">{highScore}m</span>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border-4 border-white/10 shadow-[0_0_50px_rgba(236,72,153,0.15)] w-full max-w-5xl">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="bg-[#0c1220] block w-full h-auto touch-manipulation"
        />

        <AnimatePresence>
          {(!started || gameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="text-6xl mb-6">🏍️</div>
              <h2 className="text-4xl font-black text-white mb-2 italic tracking-tighter">
                {gameOver ? "RACE OVER" : "BIKE RACING"}
              </h2>
              <p className="text-white/60 text-sm mb-8 max-w-62.5">
                Steer through traffic. Use Left/Right Arrow, A/D, or touch controls.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="px-10 py-4 bg-pink-600 hover:bg-pink-500 text-white font-black rounded-full text-lg shadow-[0_10px_30px_rgba(236,72,153,0.4)] transition-all italic tracking-tight"
              >
                {gameOver ? "RACE AGAIN" : "START RACE"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3 justify-center">
          <button
            onPointerDown={(e) => {
              e.preventDefault()
              steer(-1)
            }}
            className="w-14 h-14 bg-white/10 rounded-lg flex items-center justify-center text-xl text-white font-bold active:scale-95 transition-transform"
          >
            ←
          </button>
          <button
            onPointerDown={(e) => {
              e.preventDefault()
              steer(1)
            }}
            className="w-14 h-14 bg-white/10 rounded-lg flex items-center justify-center text-xl text-white font-bold active:scale-95 transition-transform"
          >
            →
          </button>
          <span className="text-sm text-white/60 uppercase font-bold tracking-widest">Steer</span>
        </div>

        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-2">Leaderboard</p>
          <div className="space-y-1.5 text-sm">
            {(leaderboard.length ? leaderboard : [0, 0, 0]).slice(0, 3).map((entry, idx) => (
              <div key={`${entry}-${idx}`} className="flex items-center justify-between text-white/80">
                <span className="text-white/50">#{idx + 1}</span>
                <span className="font-black">{entry}m</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
