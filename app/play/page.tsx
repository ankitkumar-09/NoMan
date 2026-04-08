"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/layout/navbar"

import { PLAY_GAMES, CATEGORIES } from "@/lib/data/play-games-data"
import Link from "next/link"
import { ArrowRight, Gamepad2, Rocket, Trophy, Puzzle, Sword } from "lucide-react"

const CATEGORY_ICONS: Record<string, any> = {
  arcade: <Rocket className="w-4 h-4" />,
  racing: <Gamepad2 className="w-4 h-4" />,
  puzzle: <Puzzle className="w-4 h-4" />,
  strategy: <Sword className="w-4 h-4" />,
  all: <Trophy className="w-4 h-4" />,
}

export default function PlayPage() {
  const [filter, setFilter] = useState("all")

  const filteredGames = PLAY_GAMES.filter(
    (g) => filter === "all" || g.category === filter
  )

  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white  tracking-tighter mb-4">
              NOMAN <span className="text-red-600">ARCADE</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              Experience the best lightweight browser games. No downloads, no lag, pure entertainment.
            </p>
          </motion.div>

          {/* Category Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-12"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300
                  ${filter === cat.key 
                    ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]" 
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5"}
                `}
              >
                {CATEGORY_ICONS[cat.key]}
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game, idx) => (
              <motion.div
                key={game.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link href={`/play/${game.slug}`} className="group block h-full">
                  <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 h-full transition-all duration-500 hover:bg-white/[0.08] hover:border-red-600/30 overflow-hidden group">
                    {/* Hover Glow */}
                    <div 
                      className="absolute -top-24 -right-24 w-48 h-48 blur-[80px] rounded-full transition-all duration-700 opacity-0 group-hover:opacity-100"
                      style={{ backgroundColor: `${game.color}40` }}
                    />
                    
                    <div className="relative z-10">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                        style={{ backgroundColor: `${game.color}15`, border: `1px solid ${game.color}30` }}
                      >
                        {game.icon}
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{game.category}</span>
                      </div>

                      <h3 className="text-xl font-black text-white mb-3 group-hover:text-red-500 transition-colors">{game.title}</h3>
                      <p className="text-white/50 text-sm leading-relaxed mb-8 line-clamp-2">{game.description}</p>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-widest group-hover:text-white/60 transition-colors">
                          {game.controls.split(' ')[0]} to Play
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white transition-all duration-500 group-hover:bg-red-600 group-hover:translate-x-2">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Line Border */}
                    <div className="absolute bottom-0 left-0 h-[2px] bg-red-600 transition-all duration-700 w-0 group-hover:w-full" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>


    </main>
  )
}
