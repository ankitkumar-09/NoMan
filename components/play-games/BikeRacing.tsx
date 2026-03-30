"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const W = 800
const H = 400
const BIKE_W = 60
const BIKE_H = 40
const GRAVITY = 0.6
const JUMP_FORCE = -12
const OBSTACLE_SPEED = 6
const SCORE_MUL = 0.1

interface Obstacle {
  id: number
  x: number
  y: number
  w: number
  h: number
}

export default function BikeRacing() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  
  const gameRef = useRef({
    bikeY: H - BIKE_H - 10,
    bikeVY: 0,
    isJumping: false,
    obstacles: [] as Obstacle[],
    frame: 0,
    running: false,
    score: 0,
    speed: OBSTACLE_SPEED
  })

  const startGame = useCallback(() => {
    gameRef.current = {
      bikeY: H - BIKE_H - 10,
      bikeVY: 0,
      isJumping: false,
      obstacles: [],
      frame: 0,
      running: true,
      score: 0,
      speed: OBSTACLE_SPEED
    }
    setScore(0)
    setGameOver(false)
    setStarted(true)
    requestAnimationFrame(tick)
  }, [])

  const tick = useCallback(() => {
    const g = gameRef.current
    if (!g.running) return

    g.frame++
    g.score += SCORE_MUL
    setScore(Math.floor(g.score))
    
    // Physics
    g.bikeVY += GRAVITY
    g.bikeY += g.bikeVY
    
    // Ground collision
    if (g.bikeY > H - BIKE_H - 10) {
      g.bikeY = H - BIKE_H - 10
      g.bikeVY = 0
      g.isJumping = false
    }

    // Increase speed
    if (g.frame % 300 === 0) g.speed += 0.5

    // Spawn obstacles
    if (g.frame % 100 === 0) {
      const h = 30 + Math.random() * 40
      g.obstacles.push({
        id: Date.now(),
        x: W,
        y: H - h - 10,
        w: 30,
        h: h
      })
    }

    // Move obstacles
    g.obstacles.forEach(o => o.x -= g.speed)
    g.obstacles = g.obstacles.filter(o => o.x > -100)

    // Collision Detection
    const bikeX = 100
    const bikeY = g.bikeY
    
    const hit = g.obstacles.some(o => 
      bikeX < o.x + o.w &&
      bikeX + BIKE_W > o.x &&
      bikeY < o.y + o.h &&
      bikeY + BIKE_H > o.y
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

    // Background
    ctx.fillStyle = "#0c1220"
    ctx.fillRect(0, 0, W, H)

    // Ground
    ctx.fillStyle = "#1e293b"
    ctx.fillRect(0, H - 10, W, 10)

    // Horizon line
    ctx.strokeStyle = "rgba(255,255,255,0.05)"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, H - 100)
    ctx.lineTo(W, H - 100)
    ctx.stroke()

    // Bike (Player)
    const bikeX = 100
    const bikeY = g.bikeY
    
    // Bike Body
    ctx.fillStyle = "#ec4899"
    ctx.beginPath()
    ctx.roundRect(bikeX, bikeY, BIKE_W, BIKE_H, 5)
    ctx.fill()
    
    // Wheels
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.arc(bikeX + 10, bikeY + BIKE_H, 8, 0, Math.PI * 2)
    ctx.arc(bikeX + BIKE_W - 10, bikeY + BIKE_H, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2
    ctx.stroke()

    // Obstacles
    g.obstacles.forEach(o => {
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.roundRect(o.x, o.y, o.w, o.h, 4)
      ctx.fill()
      
      // Caution stripes
      ctx.strokeStyle = "#facc15"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(o.x, o.y + 10)
      ctx.lineTo(o.x + o.w, o.y + 10)
      ctx.stroke()
      ctx.setLineDash([])
    })
  }, [])

  const jump = useCallback(() => {
    const g = gameRef.current
    if (!g.isJumping && g.running) {
      g.bikeVY = JUMP_FORCE
      g.isJumping = true
    }
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
        e.preventDefault()
        if (!gameRef.current.running) {
          startGame()
        } else {
          jump()
        }
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [startGame, jump])

  return (
    <div className="flex flex-col items-center gap-6 select-none bg-black p-4 w-full h-full justify-center">
      <div className="flex gap-4">
        <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-center min-w-[120px]">
          <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest block">Distance</span>
          <span className="text-2xl text-white font-black">{score}m</span>
        </div>
        <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-center min-w-[120px]">
          <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest block">Record</span>
          <span className="text-2xl text-white font-black">{highScore}m</span>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border-4 border-white/10 shadow-[0_0_50px_rgba(236,72,153,0.15)] max-w-full">
        <canvas ref={canvasRef} width={W} height={H} className="bg-[#0c1220] block max-w-full h-auto" onClick={jump} />
        
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
                {gameOver ? "CRASH!" : "ULTIMATE RIDE"}
              </h2>
              <p className="text-white/60 text-sm mb-8 max-w-[250px]">
                Jump over obstacles to survive. Press Space or Up Arrow to jump.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="px-10 py-4 bg-pink-600 hover:bg-pink-500 text-white font-black rounded-full text-lg shadow-[0_10px_30px_rgba(236,72,153,0.4)] transition-all italic tracking-tight"
              >
                {gameOver ? "TRY AGAIN" : "START RIDING"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
        <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center text-xl text-white font-bold">SPACE</div>
        <span className="text-sm text-white/60 uppercase font-bold tracking-widest">or Click to Jump</span>
      </div>
    </div>
  )
}
