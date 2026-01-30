"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"

const GAMES = [
  {
    id: "g1",
    title: "Zero Hour City",
    image: "/images/news/news1.png",
    logo: "/images/logos/burn-point-logo.png",
  },
  {
    id: "g2",
    title: "Burn Point",
    image: "/images/news/news2.png",
    logo: "/images/logos/burn-point-logo.png",
  },
  {
    id: "g3",
    title: "Sky Raiders",
    image: "/images/news/news3.png",
    logo: "/images/logos/burn-point-logo.png",
  },
  {
    id: "g4",
    title: "Action Game 1",
    image: "/images/news/news1.png",
    logo: "/images/logos/burn-point-logo.png",
  },
  {
    id: "g5",
    title: "Action Game 2",
    image: "/images/news/news2.png",
    logo: "/images/logos/burn-point-logo.png",
  },
  {
    id: "g6",
    title: "Action Game 3",
    image: "/images/news/news3.png",
    logo: "/images/logos/burn-point-logo.png",
  },
  {
    id: "g7",
    title: "Action Game 4",
    image: "/images/news/news1.png",
    logo: "/images/logos/burn-point-logo.png",
  },
  {
    id: "g8",
    title: "Action Game 5",
    image: "/images/news/news2.png",
    logo: "/images/logos/burn-point-logo.png",
  },
  {
    id: "g9",
    title: "Action Game 6",
    image: "/images/news/news3.png",
    logo: "/images/logos/burn-point-logo.png",
  },
  {
    id: "g10",
    title: "Action Cover",
    image: "/images/news/news1.png",
    logo: "/images/logos/burn-point-logo.png",
  },
]

export default function GamesPage() {
  const router = useRouter()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handleGameClick = (gameId: string) => {
    router.push(`/games/${gameId}`)
  }

  const handleGoBack = () => {
    router.push("/")
  }

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      {/* Header - Responsive spacing */}
      <header className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 bg-black border-b border-white/10 mt-20">
        <div className="mx-auto max-w-7xl flex items-center gap-3 sm:gap-4">
          <button
            onClick={handleGoBack}
            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors duration-300 shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-extrabold tracking-wide text-white truncate">
            Game Library
          </h1>
        </div>
      </header>

      {/* Games Grid - 2 columns on mobile, 3 on desktop */}
      <section className="w-full px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <div className="mx-auto w-full max-w-7xl">
          {/* 2 columns on mobile, 2-3 on tablet, 3+ on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {GAMES.map((game, idx) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                onMouseEnter={() => setHoveredId(game.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <button
                  onClick={() => handleGameClick(game.id)}
                  className="relative w-full aspect-square rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black transition-transform hover:scale-105 active:scale-95"
                >
                  {/* Game Image */}
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    className="object-cover w-full h-full"
                    draggable={false}
                  />

                  {/* Dark Overlay - More visible on mobile */}
                  <div className="absolute inset-0 bg-black/50 sm:bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />

                  {/* Top Section - Logo and Tagline */}
                  <div className="absolute top-0 inset-x-0 p-2 sm:p-3 md:p-4 lg:p-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="relative w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 flex-shrink-0">
                        <Image
                          src={game.logo}
                          alt="Game Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] sm:text-xs md:text-xs lg:text-sm text-white/70 font-medium truncate">
                          BURN POINT
                        </p>
                        <p className="text-[7px] sm:text-[9px] md:text-[10px] text-white/60 truncate">
                          Own the Drift
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section - Title and Logo */}
                  <div className="absolute bottom-0 inset-x-0 p-2 sm:p-3 md:p-4 lg:p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-14 lg:h-14 mb-1 sm:mb-2 md:mb-3 lg:mb-4 flex-shrink-0">
                          <Image
                            src={game.logo}
                            alt="Game Logo"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <p className="text-[7px] sm:text-[9px] md:text-xs lg:text-sm text-white/70 font-medium mb-0.5 sm:mb-1 truncate">
                          BURN POINT
                        </p>
                        <h3 className="text-xs sm:text-sm md:text-lg lg:text-2xl font-bold text-white tracking-wide line-clamp-2">
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
                      transition={{
                        duration: 0.6,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
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