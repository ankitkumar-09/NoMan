"use client"

import React, { useEffect, useRef, useState } from "react"
import { GameCard } from "@/components/pages/game-card"

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
    title: "Flap Into Reality",
    subtitle: "Flap, Fly, and Experience Reality",
    image: "https://res.cloudinary.com/dpnpmkhmb/image/upload/v1773738402/firstimage_ci8ujz.png",
    focusPoint: "center",
  },
 {
  title: "Drift Legends",
  subtitle: "MASTER THE DRIFT",
  image: "/images/racing/21.png",
  focusPoint: "center 35%",
},
  {
  title: "2048",
  subtitle: "MERGE THE NUMBERS",
  image: "https://res.cloudinary.com/dpnpmkhmb/image/upload/v1773739907/thirdimage_jetjd7.png",
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
  const startTimeRef = useRef<number>(0)
  const carriedElapsedRef = useRef<number>(0)

  const DURATION_MS = 10000

  const slide = SLIDES[active]
  const theme = THEMES[active] ?? THEMES[0]

  useEffect(() => {
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
        setProgress(0)
        carriedElapsedRef.current = 0
        startTimeRef.current = Date.now()
        setActive((prev) => (prev + 1) % SLIDES.length)
      }
    }, 50)

    return () => window.clearInterval(interval)
  }, [paused])

  const handleLeftClick = () => {
    setProgress(0)
    carriedElapsedRef.current = 0
    startTimeRef.current = Date.now()
    setActive((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }

  const handleRightClick = () => {
    setProgress(0)
    carriedElapsedRef.current = 0
    startTimeRef.current = Date.now()
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
            className="absolute left-0 top-0 h-2/3 w-8 sm:w-10 md:w-12 cursor-pointer hover:bg-white/5 transition-colors z-20"
            aria-label="Previous card"
            type="button"
          />

          <button
            onClick={handleRightClick}
            className="absolute right-0 top-0 h-2/3 w-8 sm:w-10 md:w-12 cursor-pointer hover:bg-white/5 transition-colors z-20"
            aria-label="Next card"
            type="button"
          />
        </div>
      </div>
    </section>
  )
}