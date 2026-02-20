"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowUpRight, Grid, ShieldCheck } from "lucide-react"

const GAMES = [
  { id: "g1", title: "Zero Hour City", image: "/images/news/news1.png", tag: "Action" },
  { id: "g2", title: "Burn Point", image: "/images/news/news2.png", tag: "Racing" },
  { id: "g3", title: "Sky Raiders", image: "/images/news/news3.png", tag: "Sci-Fi" },
  { id: "g4", title: "Action Game 1", image: "/images/news/news1.png", tag: "Battle" },
  { id: "g5", title: "Racing Game", image: "/images/news/news2.png", tag: "Sim" },
]

export function GameLibrary() {
  const marqueeGames = [...GAMES, ...GAMES, ...GAMES]
  const orangeColor = "#FF9A3D"

  return (
    <section className="w-full px-3 sm:px-4 md:px-6 py-8 md:py-12 bg-black">
      <div className="mx-auto w-full max-w-6xl">
        {/* Main Container: Fixed heights for mobile vs desktop */}
        <div className="relative w-full h-[550px] sm:h-[600px] md:h-[450px] lg:h-[500px] rounded-3xl overflow-hidden bg-[#080808] border border-white/10 shadow-2xl">
          
          <div className="absolute inset-0 flex flex-col md:flex-row">
            
            {/* LEFT/TOP SIDE: Content */}
            <div className="relative z-40 w-full md:w-1/2 h-full flex flex-col justify-center p-6 sm:p-10 md:p-12 lg:p-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="space-y-2">
                  <div 
                    className="flex items-center gap-2 font-bold text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: orangeColor }}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    Elite Access
                  </div>
                  <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[0.9]">
                    GAME <br /> <span className="text-white/40">VAULT</span>
                  </h2>
                </div>

                <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-xs border-l-2 pl-4" style={{ borderColor: orangeColor }}>
                  Explore every Noman Production title. From Burn Point VI to legendary classics.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 sm:px-8 py-3 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all shadow-lg"
                  >
                    Explore
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    className="p-3 border-2 border-white/10 text-white rounded-full transition-all"
                  >
                    <Grid className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* RIGHT/BOTTOM SIDE: Marquee */}
            {/* On mobile, it sits at the bottom. On desktop, it skews and sits on the right */}
            <div className="relative w-full md:w-1/2 h-full overflow-hidden flex justify-center items-center gap-4 sm:gap-8 md:skew-x-[-12deg] md:translate-x-12 px-4 pb-8 md:pb-0">
              
              <motion.div 
                className="flex flex-col gap-4 sm:gap-6"
                animate={{ y: [0, -1000] }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              >
                {marqueeGames.map((game, idx) => (
                  <UniqueCard key={`col1-${idx}`} game={game} orangeColor={orangeColor} />
                ))}
              </motion.div>

              <motion.div 
                className="flex flex-col gap-4 sm:gap-6 md:-translate-y-24"
                animate={{ y: [-1000, 0] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              >
                {marqueeGames.map((game, idx) => (
                  <UniqueCard key={`col2-${idx}`} game={game} orangeColor={orangeColor} />
                ))}
              </motion.div>
            </div>
          </div>

          {/* Vignette: Adjusted to work for both mobile (bottom-up) and desktop (left-right) */}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none z-20" />
          
          {/* Orange Accent Glow */}
          <div
            className="absolute -bottom-1/4 -left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20 pointer-events-none"
            style={{ backgroundColor: orangeColor }}
          />
        </div>
      </div>
    </section>
  )
}

function UniqueCard({ game, orangeColor }: { game: typeof GAMES[0], orangeColor: string }) {
  return (
    <motion.div 
      className="group relative w-28 h-40 sm:w-40 sm:h-56 md:w-48 md:h-64 bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 md:group-hover:skew-x-[12deg] hover:scale-105 hover:z-50"
      style={{ '--hover-orange': orangeColor } as any}
    >
      <Image
        src={game.image}
        alt={game.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        draggable={false}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
      
      {/* Interaction Orange Line */}
      <div 
        className="absolute inset-y-0 left-0 w-1 transition-all duration-500 group-hover:w-full group-hover:opacity-10 backdrop-blur-[1px]"
        style={{ backgroundColor: orangeColor }}
      />
      
      <div className="absolute bottom-3 left-3 right-3 z-10">
        <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: orangeColor }}>
          {game.tag}
        </p>
        <h3 className="text-white font-bold text-[10px] sm:text-xs uppercase leading-tight">
          {game.title}
        </h3>
      </div>
    </motion.div>
  )
}