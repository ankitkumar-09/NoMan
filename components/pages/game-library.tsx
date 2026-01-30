"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

const GAMES = [
  {
    id: "g1",
    title: "Zero Hour City",
    image: "/images/news1.png",
  },
  {
    id: "g2",
    title: "Burn Point",
    image: "/images/news2.png",
  },
  {
    id: "g3",
    title: "Sky Raiders",
    image: "/images/news3.png",
  },
  {
    id: "g4",
    title: "Action Game 1",
    image: "/images/news1.png",
  },
  {
    id: "g5",
    title: "Racing Game",
    image: "/images/news2.png",
  },
]

export function GameLibrary() {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [marqueeGames, setMarqueeGames] = useState<typeof GAMES>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Create seamless loop by tripling the array
    setMarqueeGames([...GAMES, ...GAMES, ...GAMES])

    // Check if mobile for animation duration
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleViewMore = () => {
    window.location.href = "/games"
  }

  // Adjust animation duration based on screen size
  const animationDuration = isMobile ? 30 : 40

  return (
    <section className="w-full px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 bg-black">
      <div className="mx-auto w-full max-w-md sm:max-w-2xl md:max-w-5xl lg:max-w-7xl">
        
        {/* First Marquee - Left Direction */}
        <div className="relative w-full mb-4 sm:mb-6 md:mb-8 overflow-hidden rounded-xl sm:rounded-2xl bg-black">
          <div
            ref={marqueeRef}
            className="relative h-40 sm:h-56 md:h-64 lg:h-80 overflow-hidden"
          >
            <motion.div
              className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6"
              animate={{ x: [0, -800] }}
              transition={{
                duration: animationDuration,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {marqueeGames.map((game, idx) => (
                <button
                  key={`left-${game.id}-${idx}`}
                  onClick={handleViewMore}
                  className="relative flex-shrink-0 w-32 h-40 sm:w-44 sm:h-56 md:w-56 md:h-64 lg:w-72 lg:h-80 rounded-lg sm:rounded-xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform"
                  type="button"
                >
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    className="object-cover w-full h-full"
                    draggable={false}
                  />
                  
                  {/* Subtle overlay for depth */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                </button>
              ))}
            </motion.div>
          </div>

          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 lg:w-20 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 lg:w-20 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
        </div>

        {/* Second Marquee - Right Direction with Content */}
        <div className="relative w-full mb-6 sm:mb-8 md:mb-10 overflow-hidden rounded-xl sm:rounded-2xl bg-black">
          
          {/* Floating Content Overlay */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center pl-3 sm:pl-6 md:pl-8 pointer-events-none">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-wide text-white mb-2 sm:mb-3 md:mb-4 lg:mb-6 max-w-sm md:max-w-lg font-bold"
            >
              Game Library
            </motion.h2>

            {/* Description */}
         <motion.p
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
  className="text-xs sm:text-sm md:text-base lg:text-lg text-white leading-relaxed mb-3 sm:mb-4 md:mb-6 lg:mb-8 max-w-xs sm:max-w-sm md:max-w-xl font-light"
>
  Your ultimate Burn Point Library, featuring every Noman Production game – from the highly anticipated Burn Point VI to legendary favorites.
</motion.p>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              onClick={handleViewMore}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-2.5 md:py-3 lg:py-4 bg-white text-black rounded-full font-extrabold text-xs sm:text-sm md:text-base hover:bg-white/90 transition-all duration-300 active:scale-95 cursor-pointer pointer-events-auto w-fit"
            >
              View More
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </motion.button>
          </div>

          {/* Background Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70
 to-transparent pointer-events-none z-10" />
          
          <div className="relative h-40 sm:h-56 md:h-64 lg:h-80 overflow-hidden">
            <motion.div
              className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6"
              animate={{ x: [-800, 0] }}
              transition={{
                duration: animationDuration,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {marqueeGames.map((game, idx) => (
                <button
                  key={`right-${game.id}-${idx}`}
                  onClick={handleViewMore}
                  className="relative flex-shrink-0 w-32 h-40 sm:w-44 sm:h-56 md:w-56 md:h-64 lg:w-72 lg:h-80 rounded-lg sm:rounded-xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform"
                  type="button"
                >
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    className="object-cover w-full h-full"
                    draggable={false}
                  />
                  
                  {/* Subtle overlay for depth */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                </button>
              ))}
            </motion.div>
          </div>

          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 lg:w-20 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 lg:w-20 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />

        </div>
      </div>
    </section>
  )
}