"use client"

import { useEffect, useRef, useState } from "react"
import { GameCard } from "@/components/game-card"

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
    image: "/images/hero-drift.png",
    logo: "/images/burn-point-logo.png",
  },
  {
    title: "Urban Warriors",
    subtitle: "TACTICAL ACTION",
    image: "/images/hero3.png",
  },
  {
    title: "Shadow Operations",
    subtitle: "STEALTH SHOOTER",
    image: "/images/sniper.jpeg",
  },
]

const THEMES: Theme[] = [
  { accent: "#2B7BFF", fg: "#ffffff" },
  { accent: "#FF9A3D", fg: "#111111" },
  { accent: "#C9CED8", fg: "#111111" },
]

export function HeroRotator() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const slide = SLIDES[active]
  const theme = THEMES[active] ?? THEMES[0]

  // Auto-rotate every 10 seconds
  useEffect(() => {
    if (paused) return

    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length)
    }, 10000)

    return () => window.clearInterval(id)
  }, [paused])

  // Left/Right click navigation
  const handleLeftClick = () => {
    setActive((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }

  const handleRightClick = () => {
    setActive((prev) => (prev + 1) % SLIDES.length)
  }

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStartRef.current - touchEnd

    // Minimum swipe distance threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleRightClick() // Swipe left → next
      } else {
        handleLeftClick() // Swipe right → prev
      }
    }
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
        progress={{ active, total: SLIDES.length }}
        paused={paused}
        onPauseToggle={() => setPaused((p) => !p)}
        accentColor={theme.accent}
        accentTextColor={theme.fg}
        pageBgColor="#000000"
      />

      {/* Left Click Area */}
      <button
        onClick={handleLeftClick}
        className="absolute left-0 top-0 h-full w-1/4 cursor-pointer hover:bg-white/5 transition-colors"
        aria-label="Previous card"
        type="button"
      />

      {/* Right Click Area */}
      <button
        onClick={handleRightClick}
        className="absolute right-0 top-0 h-full w-1/4 cursor-pointer hover:bg-white/5 transition-colors"
        aria-label="Next card"
        type="button"
      />
    </div>
  )
}
