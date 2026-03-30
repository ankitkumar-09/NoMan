"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const W = 400
const H = 600
const CAR_W = 40
const CAR_H = 80
const LANE_W = W / 3
const TRAFFIC_SPEED = 5
const SPAWN_RATE = 60 // frames

interface Obstacle {
  id: number
  x: number
  y: number
  type: number
}

export default function CarRacing() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const [lane, setLane] = useState(1) // 0, 1, 2
  
  const gameRef = useRef({
    lane: 1,
    obstacles: [] as Obstacle[],
    frame: 0,
    running: false,
    score: 0,
    speed: TRAFFIC_SPEED
  })

  const startGame = useCallback(() => {
    gameRef.current = {
      lane: 1,
      obstacles: [],
      frame: 0,
      running: true,
      score: 0,
      speed: TRAFFIC_SPEED
    }
    setLane(1)
    setScore(0)
    setGameOver(false)
    setStarted(true)
    requestAnimationFrame(tick)
  }, [])

  const tick = useCallback(() => {
    const g = gameRef.current
    if (!g.running) return

    g.frame++
    g.score += 0.1
    setScore(Math.floor(g.score))
    
    // Increase speed over time
    if (g.frame % 500 === 0) g.speed += 0.5

    // Spawn obstacles
    if (g.frame % SPAWN_RATE === 0) {
      const l = Math.floor(Math.random() * 3)
      g.obstacles.push({
        id: Date.now(),
        x: l * LANE_W + (LANE_W - CAR_W) / 2,
        y: -CAR_H,
        type: Math.floor(Math.random() * 3)
      })
    }

    // Move obstacles
    g.obstacles.forEach(o => o.y += g.speed)
    g.obstacles = g.obstacles.filter(o => o.y < H)

    // Collision Detection
    const playerX = g.lane * LANE_W + (LANE_W - CAR_W) / 2
    const playerY = H - CAR_H - 20
    
    const hit = g.obstacles.some(o => 
      playerX < o.x + CAR_W &&
      playerX + CAR_W > o.x &&
      playerY < o.y + CAR_H &&
      playerY + CAR_H > o.y
    )

    if (hit) {
      g.running = false
      setGameOver(true)
      if (Math.floor(g.score) > highScore) setHighScore(Math.floor(g.score))
      return
    }

    draw()
    requestAnimationFrame(tick)
  }, [highScore])

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    const g = gameRef.current

    // Road
    ctx.fillStyle = "#1a1a1a"
    ctx.fillRect(0, 0, W, H)

    // Road Lines
    ctx.strokeStyle = "rgba(255,255,255,0.3)"
    ctx.setLineDash([20, 20])
    ctx.lineWidth = 4
    
    const offset = (g.frame * g.speed) % 40
    ctx.beginPath()
    ctx.moveTo(LANE_W, -40 + offset)
    ctx.lineTo(LANE_W, H)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(LANE_W * 2, -40 + offset)
    ctx.lineTo(LANE_W * 2, H)
    ctx.stroke()
    ctx.setLineDash([])

    // Player Car
    const playerX = g.lane * LANE_W + (LANE_W - CAR_W) / 2
    const playerY = H - CAR_H - 20
    
    // Draw Car Shadow
    ctx.fillStyle = "rgba(0,0,0,0.4)"
    ctx.beginPath()
    ctx.roundRect(playerX + 5, playerY + 5, CAR_W, CAR_H, 10)
    ctx.fill()

    // Car Body
    ctx.fillStyle = "#ef4444"
    ctx.beginPath()
    ctx.roundRect(playerX, playerY, CAR_W, CAR_H, 10)
    ctx.fill()
    
    // Windows
    ctx.fillStyle = "#1e293b"
    ctx.fillRect(playerX + 5, playerY + 15, CAR_W - 10, 20)
    ctx.fillRect(playerX + 5, playerY + 45, CAR_W - 10, 15)

    // Headlights
    ctx.fillStyle = "#facc15"
    ctx.beginPath()
    ctx.arc(playerX + 10, playerY + 5, 5, 0, Math.PI * 2)
    ctx.arc(playerX + CAR_W - 10, playerY + 5, 5, 0, Math.PI * 2)
    ctx.fill()

    // Obstacles
    g.obstacles.forEach(o => {
      ctx.fillStyle = ["#3b82f6", "#a855f7", "#10b981"][o.type]
      ctx.beginPath()
      ctx.roundRect(o.x, o.y, CAR_W, CAR_H, 10)
      ctx.fill()
      
      ctx.fillStyle = "rgba(255,255,255,0.1)"
      ctx.fillRect(o.x + 5, o.y + CAR_H - 20, CAR_W - 10, 10)
    })
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        gameRef.current.lane = Math.max(0, gameRef.current.lane - 1)
        setLane(gameRef.current.lane)
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        gameRef.current.lane = Math.min(2, gameRef.current.lane + 1)
        setLane(gameRef.current.lane)
      }
      if (!gameRef.current.running && (e.key === " " || e.key === "Enter")) {
        startGame()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [startGame])

  return (
    <div className="flex flex-col items-center gap-6 select-none bg-black p-4">
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

      <div className="relative rounded-2xl overflow-hidden border-4 border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
        <canvas ref={canvasRef} width={W} height={H} className="bg-[#1a1a1a] block" />
        
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
              <p className="text-white/60 text-sm mb-8 max-w-[200px]">
                Dodge traffic at high speed. Use Left/Right Arrow or A/D to steer.
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

      <div className="flex gap-4 mt-2">
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
          <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-xl text-white">←</div>
          <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-xl text-white">→</div>
          <span className="text-xs text-white/40 ml-2 uppercase font-bold tracking-widest">To Move</span>
        </div>
      </div>
    </div>
  )
}
