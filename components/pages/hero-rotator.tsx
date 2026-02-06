"use client"

import React from "react"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowUpRight, Play as LucidePlay } from "lucide-react"
import { ProgressTimeline } from "@/components/progress-timeline"

interface GameCardProps {
  title: string
  subtitle: string
  image: string
  logo?: string
  showButtons?: boolean
  focusPoint?: string
  progress?: { active: number; total: number; segmentStates?: number[] }
  paused?: boolean
  onPauseToggle?: () => void
  accentColor?: string
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="6.5" y="5.5" width="4.6" height="13" rx="0.6" fill="currentColor" />
      <rect x="12.9" y="5.5" width="4.6" height="13" rx="0.6" fill="currentColor" />
    </svg>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M9 7.2v9.6c0 .7.8 1.1 1.4.7l8-4.8c.6-.4.6-1.3 0-1.7l-8-4.8c-.6-.4-1.4 0-1.4.7z" fill="currentColor" />
    </svg>
  )
}

function GameCard(props: GameCardProps) {
  const {
    title,
    subtitle,
    image,
    logo,
    showButtons = true,
    focusPoint = "center 30%",
    progress,
    paused,
    onPauseToggle,
    accentColor = "#2B7BFF",
  } = props

  const handleWatchTrailer = () => {
    window.open("https://youtube.com", "_blank", "noopener,noreferrer")
  }

  const handleLearnMore = () => {
    window.open("https://redcube.com", "_blank", "noopener,noreferrer")
  }

  const totalDots = Math.max(0, progress?.total ?? 0)

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-[400px] lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl group">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
          className="transition-transform duration-500 group-hover:scale-105"
          style={{ objectFit: "cover", objectPosition: focusPoint }}
          priority
          draggable={false}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />

      <div
        className="absolute -top-1/2 -right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8">
        <div />

        <div className="space-y-4">
          <div className="flex items-start gap-3 sm:gap-4">
            {logo && (
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0">
                <Image
                  src={logo || "/placeholder.svg"}
                  alt={title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
                  draggable={false}
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

          {showButtons && (
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWatchTrailer}
                type="button"
                className="flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full font-semibold text-white border-2 hover:bg-white/10 transition-all"
                style={{ borderColor: accentColor }}
              >
                Watch Trailer
                <LucidePlay className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLearnMore}
                type="button"
                className="flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full font-semibold text-white hover:bg-white/10 transition-all"
              >
                Learn More <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}

          {/* FIX: Progress timeline and play/pause button in a single row */}
          {showButtons && totalDots > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <ProgressTimeline
                  total={totalDots}
                  segmentStates={progress?.segmentStates}
                  accentColor={accentColor}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPauseToggle}
                type="button"
                aria-label={paused ? "Resume" : "Pause"}
                aria-pressed={!!paused}
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-full flex-shrink-0
                           grid place-items-center
                           border-2 border-white/55 hover:border-white/90
                           bg-black/40 backdrop-blur-md
                           shadow-lg"
                style={{ borderColor: paused ? accentColor : undefined }}
              >
                <span className="text-white">
                  {paused ? (
                    <PlayIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <PauseIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  )}
                </span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

type Slide = {
  title: string
  subtitle: string
  image: string
  logo?: string
  focusPoint?: string
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
    focusPoint: "center",
  },
  {
    title: "Urban Warriors",
    subtitle: "TACTICAL ACTION",
    image: "/images/hero/hero3.png",
    logo: "/images/logos/burn-point-logo.png",
    focusPoint: "center 35%",
  },
  {
    title: "Shadow Operations",
    subtitle: "STEALTH SHOOTER",
    image: "/images/games/sniper.png",
    logo: "/images/logos/burn-point-logo.png",
    focusPoint: "center 20%",
  },
]

const THEMES: Theme[] = [
  { accent: "#2B7BFF", fg: "#ffffff" },
  { accent: "#FF9A3D", fg: "#111111" },
  { accent: "#C9CED8", fg: "#111111" },
]

export function HeroRotator() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)

  const touchStartRef = useRef(0)
  const startTimeRef = useRef<number>(Date.now())
  const carriedElapsedRef = useRef<number>(0)

  const DURATION_MS = 10000

  const slide = SLIDES[active]
  const theme = THEMES[active] ?? THEMES[0]

  useEffect(() => {
    setProgress(0)
    carriedElapsedRef.current = 0
    startTimeRef.current = Date.now()
  }, [active])

  useEffect(() => {
    if (paused) return

    startTimeRef.current = Date.now() - carriedElapsedRef.current

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const newProgress = Math.min(elapsed / DURATION_MS, 1)
      setProgress(newProgress)

      if (newProgress >= 1) {
        setActive((prev) => (prev + 1) % SLIDES.length)
      }
    }, 50)

    return () => window.clearInterval(interval)
  }, [paused])

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
      if (diff > 0) handleRightClick()
      else handleLeftClick()
    }
  }

  const getSegmentStates = () => {
    return SLIDES.map((_, idx) => {
      if (idx < active) return 1
      if (idx === active) return progress
      return 0
    })
  }

  const togglePause = () => {
    setPaused((p) => {
      const next = !p
      if (next) {
        carriedElapsedRef.current = Date.now() - startTimeRef.current
      }
      return next
    })
  }

  return (
    <section className="w-full px-3 sm:px-4 md:px-6 bg-black">
      <div className="mx-auto w-full max-w-6xl">
        <div
          className="relative w-full touch-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <GameCard
            title={slide.title}
            subtitle={slide.subtitle}
            image={slide.image}
            logo={slide.logo}
            focusPoint={slide.focusPoint}
            showButtons
            progress={{
              active,
              total: SLIDES.length,
              segmentStates: getSegmentStates(),
            }}
            paused={paused}
            onPauseToggle={togglePause}
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
