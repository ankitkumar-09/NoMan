"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

const GAMES = [
  {
    id: "g1",
    title: "Zero Hour City",
    image: "/images/news1.png",
    logo: "/images/burn-point-logo.png",
  },
  {
    id: "g2",
    title: "Burn Point",
    image: "/images/news2.png",
    logo: "/images/burn-point-logo.png",
  },
  {
    id: "g3",
    title: "Sky Raiders",
    image: "/images/news3.png",
    logo: "/images/burn-point-logo.png",
  },
  {
    id: "g4",
    title: "Action Game 1",
    image: "/images/news1.png",
    logo: "/images/burn-point-logo.png",
  },
]

export default function GamesPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handleGameClick = (gameId: string) => {
    // Handle game click - can navigate to game detail or launch game
    console.log(`Clicked game: ${gameId}`)
  }

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <header className="w-full px-4 py-6 md:py-8 bg-black border-b border-white/10">
        <div className="mx-auto max-w-7xl flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-white">
            Game Library
          </h1>
        </div>
      </header>

      {/* Games Grid */}
      <section className="w-full px-4 py-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {GAMES.map((game, idx) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                onMouseEnter={() => setHoveredId(game.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <button
                  onClick={() => handleGameClick(game.id)}
                  className="relative w-full aspect-square rounded-3xl overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black"
                >
                  {/* Game Image */}
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    className="object-cover w-full h-full"
                    draggable={false}
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />

                  {/* Top Section - Logo and Tagline */}
                  <div className="absolute top-0 inset-x-0 p-4 md:p-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                        <Image
                          src={game.logo}
                          alt="Game Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-white/70 font-medium">
                          BURN POINT
                        </p>
                        <p className="text-xs text-white/60">Own the Drift</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section - Title and Logo */}
                  <div className="absolute bottom-0 inset-x-0 p-4 md:p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="relative w-12 h-12 md:w-14 md:h-14 mb-4 flex-shrink-0">
                          <Image
                            src={game.logo}
                            alt="Game Logo"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <p className="text-xs md:text-sm text-white/70 font-medium mb-1">
                          BURN POINT
                        </p>
                        <h3 className="text-2xl md:text-3xl font-light text-white tracking-wide">
                          {game.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect - Subtle Shine */}
                  {hoveredId === game.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}