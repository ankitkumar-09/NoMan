"use client"

import { useEffect, useRef, useState } from "react"
import { GameCard } from "@/components/pages/game-card"

type Slide = {
  title: string
  subtitle: string
  image: string
  logo?: string
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
  },
  {
    title: "Urban Warriors",
    subtitle: "TACTICAL ACTION",
    image: "/images/hero/hero3.png",
    logo: "/images/logos/burn-point-logo.png",
  },
  {
    title: "Shadow Operations",
    subtitle: "STEALTH SHOOTER",
    image: "/images/games/sniper.jpeg",
    logo: "/images/logos/burn-point-logo.png",
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
  const containerRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef(Date.now())

  const slide = SLIDES[active]
  const theme = THEMES[active] ?? THEMES[0]

  // Reset progress when slide changes
  useEffect(() => {
    setProgress(0)
    startTimeRef.current = Date.now()
  }, [active])

  // Update progress smoothly
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
          segmentStates: getSegmentStates()
        }}
        paused={paused}
        onPauseToggle={() => setPaused((p) => !p)}
        accentColor={theme.accent}
        accentTextColor={theme.fg}
        pageBgColor="#000000"
      />

   {/* Left Click Area - smaller width, doesn't cover pause button */}
<button
  onClick={handleLeftClick}
  className="absolute left-0 top-0 bottom-16 w-1/5 cursor-pointer hover:bg-white/5 transition-colors"
  aria-label="Previous card"
  type="button"
/>

{/* Right Click Area - smaller width, doesn't cover pause button */}
<button
  onClick={handleRightClick}
  className="absolute right-0 top-0 bottom-16 w-1/5 cursor-pointer hover:bg-white/5 transition-colors"
  aria-label="Next card"
  type="button"
/>
    </div>
  )
}