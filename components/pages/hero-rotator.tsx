"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowUpRight, Play, Pause } from "lucide-react"
import { ProgressTimeline } from "@/components/progress-timeline"

interface GameCardProps {
  title: string
  subtitle: string
  image: string
  logo?: string
  showButtons?: boolean
  progress?: { active: number; total: number; segmentStates?: number[] }
  paused?: boolean
  onPauseToggle?: () => void
  accentColor?: string
}
const THEMES = [
  { accent: "#2B7BFF", fg: "#ffffff" }, // Theme for Slide 1
  { accent: "#FF9A3D", fg: "#111111" }, // Theme for Slide 2
  { accent: "#C9CED8", fg: "#111111" }, // Theme for Slide 3
];
function GameCard(props: GameCardProps) {
  const {
    title,
    subtitle,
    image,
    logo,
    showButtons = true,
    progress,
    paused,
    onPauseToggle,
    accentColor = "#2B7BFF",
  } = props

  const handleWatchTrailer = () => {
    window.open("https://youtube.com", "_blank")
  }

  const handleLearnMore = () => {
    window.open("https://redcube.com", "_blank")
  }

  const totalDots = Math.max(0, progress?.total ?? 0)

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-[400px] lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl group">
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          priority
          draggable={false}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />

      {/* Accent Glow */}
      <div
        className="absolute -top-1/2 -right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8">
        <div />

        <div className="space-y-4">
          {/* Logo and Title */}
          <div className="flex items-start gap-3 sm:gap-4">
            {logo && (
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0">
                <Image
                  src={logo}
                  alt={title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-white/70 font-semibold uppercase tracking-wide">
                {subtitle}
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight break-words">
                {title}
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          {showButtons && (
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWatchTrailer}
                className="flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full font-semibold text-white border-2 hover:bg-white/10 transition-all"
                style={{ borderColor: accentColor }}
              >
                Watch Trailer
                <Play className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLearnMore}
                className="flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full font-semibold text-white hover:bg-white/10 transition-all"
              >
                Learn More <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}

          {/* Timeline */}
          {showButtons && totalDots > 0 && (
            <ProgressTimeline
              total={totalDots}
              segmentStates={progress?.segmentStates}
              accentColor={accentColor}
            />
          )}
        </div>

        {/* Pause Button */}
        {showButtons && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onPauseToggle}
            className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/40 hover:border-white/80 flex items-center justify-center transition-all"
            style={{ borderColor: paused ? accentColor : undefined }}
          >
            {paused ? (
              <Play className="w-5 h-5 text-white fill-white" />
            ) : (
              <Pause className="w-5 h-5 text-white" />
            )}
          </motion.button>
        )}
      </div>
    </div>
  )
}

type Slide = {
  title: string
  subtitle: string
  image: string
  logo?: string
  focus: string;
}

type Theme = {
  accent: string
  fg: string
}
const SLIDES: Slide[] = [
  {
    title: "Own the Drift",
    subtitle: "BURN POINT",
    image: "/images/hero/hero-drift.png",
    logo: "/images/logos/burn-point-logo.png",
    // Center is usually best for cars
    focus: "object-center" 
  },
  {
    title: "Urban Warriors",
    subtitle: "TACTICAL ACTION",
    image: "/images/hero/hero3.png",
    logo: "/images/logos/burn-point-logo.png",
    // Focus higher so heads aren't cut off
    focus: "object-[center_20%]" 
  },
  {
    title: "Shadow Operations",
    subtitle: "STEALTH SHOOTER",
    image: "/images/games/sniper.jpeg",
    logo: "/images/logos/burn-point-logo.png",
    // Focus on the eye/scope area
    focus: "object-[center_30%]" 
  },
]

export function HeroRotator() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef(Date.now())

  const slide = SLIDES[active]
  const theme = THEMES[active] ?? THEMES[0]

  useEffect(() => {
    setProgress(0)
    startTimeRef.current = Date.now()
  }, [active])

  useEffect(() => {
    if (paused) return

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const newProgress = Math.min(elapsed / 10000, 1)
      setProgress(newProgress)

      if (newProgress >= 1) {
        setActive((prev) => (prev + 1) % SLIDES.length)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [paused, active])

  const handleLeftClick = () => {
    setActive((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }

  const handleRightClick = () => {
    setActive((prev) => (prev + 1) % SLIDES.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStartRef.current - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleRightClick()
      } else {
        handleLeftClick()
      }
    }
  }

  const getSegmentStates = () => {
    return SLIDES.map((_, idx) => {
      if (idx < active) return 1
      if (idx === active) return progress
      return 0
    })
  }

  return (
    <section className="w-full px-3 sm:px-4 md:px-6 bg-black">
      <div className="mx-auto w-full max-w-6xl">
        <div
          ref={containerRef}
          className="relative w-full touch-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <GameCard
            title={slide.title}
            subtitle={slide.subtitle}
            image={slide.image}
            logo={slide.logo}
            showButtons
            progress={{
              active,
              total: SLIDES.length,
              segmentStates: getSegmentStates(),
            }}
            paused={paused}
            onPauseToggle={() => setPaused((p) => !p)}
            accentColor={theme.accent}
          />

          <button
            onClick={handleLeftClick}
            className="absolute left-0 top-0 bottom-16 w-1/5 cursor-pointer hover:bg-white/5 transition-colors z-20"
            aria-label="Previous card"
            type="button"
          />

          <button
            onClick={handleRightClick}
            className="absolute right-0 top-0 bottom-16 w-1/5 cursor-pointer hover:bg-white/5 transition-colors z-20"
            aria-label="Next card"
            type="button"
          />
        </div>
      </div>
    </section>
  )
}