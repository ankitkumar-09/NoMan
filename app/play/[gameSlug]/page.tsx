"use client"

import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { PLAY_GAMES } from "@/lib/data/play-games-data"
import { ArrowLeft, Maximize2, RotateCcw, Info } from "lucide-react"
import dynamic from "next/dynamic"
import { useState, useMemo } from "react"

// Lazy load game components
const TicTacToe = dynamic(() => import("@/components/play-games/TicTacToe"), { ssr: false })
const SnakeGame = dynamic(() => import("@/components/play-games/SnakeGame"), { ssr: false })
const FlappyBird = dynamic(() => import("@/components/play-games/FlappyBird"), { ssr: false })
const ChessGame = dynamic(() => import("@/components/play-games/ChessGame"), { ssr: false })
const CarRacing = dynamic(() => import("@/components/play-games/CarRacing"), { ssr: false })
const BikeRacing = dynamic(() => import("@/components/play-games/BikeRacing"), { ssr: false })
const MemoryMatch = dynamic(() => import("@/components/play-games/MemoryMatch"), { ssr: false })
const PongGame = dynamic(() => import("@/components/play-games/PongGame"), { ssr: false })

const GAME_COMPONENTS: Record<string, any> = {
  "tic-tac-toe": TicTacToe,
  "snake": SnakeGame,
  "flappy-bird": FlappyBird,
  "chess": ChessGame,
  "car-racing": CarRacing,
  "bike-racing": BikeRacing,
  "memory-match": MemoryMatch,
  "pong": PongGame,
}

export default function GameDetailPage() {
  const { gameSlug } = useParams()
  const router = useRouter()
  const [showInfo, setShowInfo] = useState(true)
  const [gameKey, setGameKey] = useState(0) // Used for resetting the game component

  const game = useMemo(() => 
    PLAY_GAMES.find((g) => g.slug === gameSlug),
    [gameSlug]
  )

  const GameComponent = game ? GAME_COMPONENTS[game.slug] : null

  if (!game) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">GAME NOT FOUND</h1>
          <button onClick={() => router.push("/play")} className="text-red-500 hover:underline">Back to Arcade</button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black flex flex-col">
      <Navbar />

      <div className="flex-1 pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push("/play")}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                   <h1 className="text-3xl font-black text-white italic truncate">{game.title}</h1>
                   <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-black uppercase text-white/50 tracking-widest">{game.category}</span>
                </div>
                <p className="text-white/40 text-sm font-medium italic">{game.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
               <button 
                onClick={() => setGameKey(prev => prev + 1)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
               >
                 <RotateCcw className="w-4 h-4" /> Reset
               </button>
               <button 
                onClick={() => setShowInfo(!showInfo)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-black uppercase tracking-widest transition-all ${showInfo ? 'bg-red-600/20 border-red-600/50 text-red-400' : 'bg-white/5 border-white/10 text-white/70'}`}
               >
                 <Info className="w-4 h-4" /> Info
               </button>
               <button 
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors"
                title="Fullscreen Toggle (Demo only)"
               >
                 <Maximize2 className="w-5 h-5" />
               </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Game Canvas Container */}
            <div className="flex-1 relative bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden min-h-[500px] flex items-center justify-center">
               <div key={gameKey} className="w-full h-full flex items-center justify-center p-4">
                  {GameComponent ? <GameComponent /> : <div className="text-white">Loading Game...</div>}
               </div>

               {/* Overlay Info */}
               <AnimatePresence>
                 {showInfo && (
                   <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute top-6 right-6 w-64 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 z-20 shadow-2xl"
                   >
                     <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Controls</h4>
                        <button onClick={() => setShowInfo(false)} className="text-white/30 hover:text-white transition-colors">×</button>
                     </div>
                     <p className="text-white/60 text-sm italic mb-6">
                        {game.controls}
                     </p>
                     <div className="pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                           <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Multiplayer Ready</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                           <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Low Latency</span>
                        </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
