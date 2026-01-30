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
    image: "/images/news/news1.png",
    tag: "ZERO HOUR CITY",
    title: "Fresh content update introduces enhanced combat mechanics and new missions.",
    date: "November 16, 2025",
  },
  {
    id: "n2",
    image: "/images/news/news2.png",
    tag: "BURN POINT",
    title: "New drift challenges and leaderboard events are now live for all players.",
    date: "November 20, 2025",
  },
  {
    id: "n3",
    image: "/images/news/news3.png",
    tag: "SKY RAIDERS",
    title: "Season rewards updated with new cosmetics and limited-time drops.",
    date: "November 28, 2025",
  },
]

export function NewsPeekCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartRef = useRef(0)
  const touchStartYRef = useRef(0)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [stageW, setStageW] = useState(0)
  const isDraggingRef = useRef(false)
  const isMouseDownRef = useRef(false)

  const len = INITIAL_NEWS.length
  const center = INITIAL_NEWS[activeIndex]
  const left = activeIndex > 0 ? INITIAL_NEWS[activeIndex - 1] : null
  const right = activeIndex < len - 1 ? INITIAL_NEWS[activeIndex + 1] : null

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

  const cards = useMemo(() => {
    const result = []
    if (left) result.push({ item: left, pos: "left" as Pos })
    result.push({ item: center, pos: "center" as Pos })
    if (right) result.push({ item: right, pos: "right" as Pos })
    return result
  }, [left, center, right])

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
    touchStartYRef.current = e.touches[0].clientY
    isDraggingRef.current = false
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const xDiff = Math.abs(e.touches[0].clientX - touchStartRef.current)
    const yDiff = Math.abs(e.touches[0].clientY - touchStartYRef.current)
    
    // If horizontal movement is greater than vertical, it's a swipe
    if (xDiff > yDiff && xDiff > 10) {
      isDraggingRef.current = true
      e.preventDefault() // Prevent scroll only when swiping
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return

    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStartRef.current - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < len - 1) {
        // Swipe left - go to next
        setActiveIndex(activeIndex + 1)
      } else if (diff < 0 && activeIndex > 0) {
        // Swipe right - go to previous
        setActiveIndex(activeIndex - 1)
      }
    }

    isDraggingRef.current = false
  }

  // Mouse drag support
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartRef.current = e.clientX
    isMouseDownRef.current = true
    isDraggingRef.current = false
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return

    const xDiff = Math.abs(e.clientX - touchStartRef.current)
    
    if (xDiff > 10) {
      isDraggingRef.current = true
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return
    
    isMouseDownRef.current = false
    
    if (!isDraggingRef.current) return

    const mouseEnd = e.clientX
    const diff = touchStartRef.current - mouseEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < len - 1) {
        // Drag left - go to next
        setActiveIndex(activeIndex + 1)
      } else if (diff < 0 && activeIndex > 0) {
        // Drag right - go to previous
        setActiveIndex(activeIndex - 1)
      }
    }

    isDraggingRef.current = false
  }

  const handleMouseLeave = () => {
    isMouseDownRef.current = false
    isDraggingRef.current = false
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

          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="relative w-full h-[560px] touch-pan-y cursor-grab active:cursor-grabbing select-none"
          >
            <div ref={stageRef} className="absolute inset-0 overflow-hidden rounded-[32px] bg-black">
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="sync">
                  {cards.map(({ item, pos }) => {
                    const isCenter = pos === "center"

                    return (
                      <motion.div
                        key={item.id}
                        className="absolute left-1/2 top-1/2 h-[92%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[30px] overflow-hidden"
                        initial={base[pos]}
                        animate={base[pos]}
                        exit={{
                          opacity: 0,
                          scale: 0.85,
                          transition: { duration: 0.4, ease: "easeInOut" },
                        }}
                        transition={{
                          x: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
                          scale: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
                          opacity: { duration: 0.5, ease: "easeInOut" },
                        }}
                        style={{ zIndex: base[pos].zIndex as number }}
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover pointer-events-none"
                            priority={isCenter}
                            draggable={false}
                          />

                          <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

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
          </div>
        </div>

        {/* Progress Dots */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4 flex justify-center gap-2"
        >
          {INITIAL_NEWS.map((_, i) => (
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
      </div>
    </section>
  )
}