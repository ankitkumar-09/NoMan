"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { BackToTop } from "@/components/ui/back-to-top"
import { GAMES_DATA } from "@/lib/data/game-data"

export default function GamesPage() {
  const router = useRouter()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const games = Object.values(GAMES_DATA)

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <header className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 bg-black border-b border-white/10 mt-20">
        <div className="mx-auto max-w-7xl flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => router.push("/")}
            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-extrabold tracking-wide text-white truncate">
            Game Library
          </h1>
        </div>
      </header>

      <section className="w-full px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {games.map((game, idx) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onMouseEnter={() => setHoveredId(game.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <button
                  onClick={() => router.push(`/games/${game.id}`)}
                  className="relative w-full aspect-square rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer focus:outline-none transition-transform hover:scale-105"
                >
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    className="object-cover"
                    draggable={false}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />

                  {/* Logo - Top Left */}
                  {game.logo && (
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 lg:top-6 lg:left-6">
                      <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14">
                        <Image
                          src={game.logo}
                          alt="Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {/* Bottom Content */}
                  <div className="absolute bottom-0 inset-x-0 p-2 sm:p-3 md:p-4 lg:p-6 bg-gradient-to-t from-black/80 to-transparent text-left">
                    <p className="text-[7px] sm:text-[9px] md:text-xs lg:text-sm text-white/70 font-medium mb-0.5 sm:mb-1 uppercase tracking-wider">
                      {game.subtitle}
                    </p>
                    <h3 className="text-xs sm:text-sm md:text-lg lg:text-2xl font-bold text-white tracking-wide truncate">
                      {game.title}
                    </h3>
                  </div>

                  {/* Shine Effect on Hover */}
                  {hoveredId === game.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BackToTop />
    </main>
  )
}