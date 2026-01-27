"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type NewsItem = {
  id: string
  image: string
  tag: string
  title: string
  date: string
}

type Pos = "left" | "center" | "right"

const INITIAL_NEWS: NewsItem[] = [
  {
    id: "n1",
    image: "/images/news1.png",
    tag: "ZERO HOUR CITY",
    title: "Fresh content update introduces enhanced combat mechanics and new missions.",
    date: "November 16, 2025",
  },
  {
    id: "n2",
    image: "/images/news2.png",
    tag: "BURN POINT",
    title: "New drift challenges and leaderboard events are now live for all players.",
    date: "November 20, 2025",
  },
  {
    id: "n3",
    image: "/images/news3.png",
    tag: "SKY RAIDERS",
    title: "Season rewards updated with new cosmetics and limited-time drops.",
    date: "November 28, 2025",
  },
]

export function NewsPeekCarousel() {
  const [items, setItems] = useState<NewsItem[]>(INITIAL_NEWS)
  const [activeIndex, setActiveIndex] = useState(0)
  const [centerPulse, setCenterPulse] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [swapPhase, setSwapPhase] = useState<null | "crazy">(null)
  const touchStartRef = useRef(0)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [stageW, setStageW] = useState(0)
  const lockRef = useRef(false)

  const len = items.length
  const center = items[activeIndex]
  const left = items[(activeIndex - 1 + len) % len]
  const right = items[(activeIndex + 1) % len]

  // Layout constants
  const CARD_W_RATIO = 0.78
  const SIDE_SCALE = 0.88
  const GAP = 24
  const EDGE_FILL = 6

  useEffect(() => {
    if (!stageRef.current) return
    const ro = new ResizeObserver(() => setStageW(stageRef.current?.clientWidth || 0))
    ro.observe(stageRef.current)
    setStageW(stageRef.current.clientWidth)
    return () => ro.disconnect()
  }, [])

  const cardW = stageW * CARD_W_RATIO
  const sideEffectiveW = cardW * SIDE_SCALE
  const neededForGap = cardW * (1 + SIDE_SCALE) / 2 + GAP
  const neededForEdgeFill = stageW ? stageW / 2 - sideEffectiveW / 2 + EDGE_FILL : 0
  const SIDE_X = stageW ? Math.max(neededForGap, neededForEdgeFill) : 230

  const base = {
    left: { x: -SIDE_X, scale: SIDE_SCALE, opacity: 0.78, zIndex: 1 },
    center: { x: 0, scale: 1, opacity: 1, zIndex: 3 },
    right: { x: SIDE_X, scale: SIDE_SCALE, opacity: 0.78, zIndex: 1 },
  } as const

  // Crazy swap animation phase
  const crazyPhase = {
    left: { x: SIDE_X, scale: 0.9, opacity: 0.95, zIndex: 6, rotate: 15 },
    center: { x: 0, scale: 1, opacity: 1, zIndex: 3, rotate: 0 },
    right: { x: -SIDE_X, scale: 0.9, opacity: 0.95, zIndex: 6, rotate: -15 },
  } as const

  const variants = swapPhase === "crazy" ? crazyPhase : base

  const cards = useMemo(
    () => [
      { item: left, pos: "left" as Pos },
      { item: center, pos: "center" as Pos },
      { item: right, pos: "right" as Pos },
    ],
    [left, center, right]
  )

  const handleSwipe = (direction: "left" | "right") => {
    if (lockRef.current) return
    lockRef.current = true

    const nextClick = clickCount + 1

    if (nextClick === 1 || nextClick === 2) {
      setCenterPulse((p) => p + 1)
      if (direction === "left") {
        setActiveIndex((prev) => (prev + 1) % len)
      } else {
        setActiveIndex((prev) => (prev - 1 + len) % len)
      }
      setClickCount(nextClick)
      setTimeout(() => (lockRef.current = false), 500)
      return
    }

    // On 3rd click - crazy swap animation
    if (nextClick === 3) {
      setSwapPhase("crazy")
      setTimeout(() => {
        setItems((prev) => {
          const copy = [...prev]
          // Swap left and right cards
          ;[copy[0], copy[2]] = [copy[2], copy[0]]
          return copy
        })
        setActiveIndex(0)
        setClickCount(0)
        setSwapPhase(null)
        lockRef.current = false
      }, 600)
      return
    }

    lockRef.current = false
  }

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStartRef.current - touchEnd

    if (Math.abs(diff) > 50) {
      handleSwipe(diff > 0 ? "left" : "right")
    }
  }

  // Mouse drag support (desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartRef.current = e.clientX
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    const dragEnd = e.clientX
    const diff = touchStartRef.current - dragEnd

    if (Math.abs(diff) > 50) {
      handleSwipe(diff > 0 ? "left" : "right")
    }
  }

  // Direct click on card handler
  const handleCardClick = (pos: Pos) => {
    if (lockRef.current) return

    if (pos === "center") {
      handleSwipe("left")
    } else if (pos === "left") {
      handleSwipe("right")
    } else if (pos === "right") {
      handleSwipe("left")
    }
  }

  return (
    <section className="w-full px-4 pb-10">
      <div className="mx-auto w-full max-w-[420px]">
        <div className="relative">
          {/* Left Decorative Bar */}
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-[560px] rounded-r-3xl bg-gradient-to-r from-orange-600 to-orange-500 -z-10 pointer-events-none shadow-lg"
          />

          {/* Right Decorative Bar */}
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-[560px] rounded-l-3xl bg-gradient-to-l from-blue-600 via-blue-500 to-cyan-400 -z-10 pointer-events-none shadow-lg"
            style={{
              backgroundImage: "linear-gradient(135deg, rgba(59,130,246,0.8) 0%, rgba(34,197,94,0.6) 50%, rgba(168,85,247,0.4) 100%)",
            }}
          />

          <button
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            className="relative w-full h-[560px] outline-none touch-none cursor-grab active:cursor-grabbing"
            aria-label="Swipe or click to change news"
            type="button"
          >
            <div ref={stageRef} className="absolute inset-0 overflow-hidden rounded-[32px] bg-black">
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                  {cards.map(({ item, pos }) => {
                    const isCenter = pos === "center"

                    return (
                      <motion.div
                        key={item.id}
                        className="absolute left-1/2 top-1/2 h-[92%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[30px] overflow-hidden cursor-pointer"
                        initial={{
                          ...base[pos],
                          opacity: 0,
                        }}
                        animate={variants[pos]}
                        exit={{
                          opacity: 0,
                          scale: 0.8,
                          transition: { duration: 0.3, ease: "easeIn" },
                        }}
                        transition={{
                          x: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
                          scale: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
                          opacity: { duration: 0.6, ease: "easeOut" },
                          rotate: { duration: 0.6, ease: "easeOut" },
                        }}
                        style={{ zIndex: variants[pos].zIndex as number }}
                        onClick={() => handleCardClick(pos)}
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            priority={isCenter}
                          />

                          <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                          {/* Center Pulse */}
                          {isCenter && swapPhase !== "crazy" && (
                            <motion.div
                              key={`pulse-${centerPulse}`}
                              className="absolute inset-0"
                              initial={{ opacity: 1 }}
                              animate={{ opacity: [1, 0.82, 1] }}
                              transition={{ duration: 0.22, ease: "easeOut" }}
                              style={{ pointerEvents: "none" }}
                            />
                          )}

                          {/* Center Overlay */}
                          {isCenter && (
                            <motion.div
                              initial={{ y: 30, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -30, opacity: 0 }}
                              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                              className="absolute left-4 right-4 bottom-6 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-4 text-left shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
                            >
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.15 }}
                                className="text-[10px] tracking-widest text-white/70"
                              >
                                {item.tag}
                              </motion.p>
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="mt-2 text-[16px] font-semibold leading-snug text-white"
                              >
                                {item.title}
                              </motion.p>
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.25 }}
                                className="mt-3 text-[11px] text-white/55"
                              >
                                {item.date}
                              </motion.p>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          </button>
        </div>

        {/* Progress Dots with Click Counter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4 flex justify-center gap-2"
        >
          {items.map((_, i) => (
            <motion.span
              key={i}
              layout
              className={[
                "h-1.5 rounded-full transition-all",
                i === activeIndex ? "w-6 bg-white/80" : "w-2 bg-white/30",
              ].join(" ")}
              animate={{
                scale: i === activeIndex ? 1.1 : 1,
              }}
            />
          ))}
        </motion.div>

        {/* Click Counter Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-3 text-center text-white/60 text-xs"
        >
          Click {clickCount} of 3 • Next: {"•".repeat(3 - clickCount)}
        </motion.div>
      </div>
    </section>
  )
}
