"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
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
  {
    id: "n4",
    image: "/images/news/news1.png",
    tag: "ACTION ZONE",
    title: "Upcoming tournament series announced with major prize pools.",
    date: "December 05, 2025",
  },
]

export function NewsPeekCarousel() {
  const [activeIndex, setActiveIndex] = useState(1)
  const [stageW, setStageW] = useState(0)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const touchStartRef = useRef(0)
  const isDraggingRef = useRef(false)

  const len = INITIAL_NEWS.length

  useEffect(() => {
    if (!stageRef.current) return
    const ro = new ResizeObserver(() => setStageW(stageRef.current?.clientWidth || 0))
    ro.observe(stageRef.current)
    setStageW(stageRef.current.clientWidth)
    return () => ro.disconnect()
  }, [])

  const CARD_W_RATIO = 0.75
  const SIDE_SCALE = 0.82
  const cardW = stageW * CARD_W_RATIO
  const SIDE_X = stageW * 0.45 // Optimized spacing

  const base = {
    left: { x: -SIDE_X, scale: SIDE_SCALE, opacity: 0.4, zIndex: 1, rotateY: 15 },
    center: { x: 0, scale: 1, opacity: 1, zIndex: 10, rotateY: 0 },
    right: { x: SIDE_X, scale: SIDE_SCALE, opacity: 0.4, zIndex: 1, rotateY: -15 },
  } as const

  const handleSwipe = (diff: number) => {
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < len - 1) setActiveIndex(activeIndex + 1)
      if (diff < 0 && activeIndex > 0) setActiveIndex(activeIndex - 1)
    }
  }

  const cards = [
    { item: activeIndex > 0 ? INITIAL_NEWS[activeIndex - 1] : null, pos: "left" as Pos, idx: activeIndex - 1 },
    { item: INITIAL_NEWS[activeIndex], pos: "center" as Pos, idx: activeIndex },
    { item: activeIndex < len - 1 ? INITIAL_NEWS[activeIndex + 1] : null, pos: "right" as Pos, idx: activeIndex + 1 },
  ].filter(c => c.item !== null)

  return (
    <section className="w-full px-4 py-12 bg-black overflow-hidden">
      <div className="mx-auto max-w-6xl relative">
        
        {/* Background Decorative Glows */}
        <div className="absolute top-1/2 left-[-10%] -translate-y-1/2 w-64 h-[400px] bg-orange-600/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-64 h-[400px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />

        <div
          ref={stageRef}
          className="relative w-full h-[500px] md:h-[580px] perspective-[1200px]"
          onMouseDown={(e) => (touchStartRef.current = e.clientX)}
          onMouseUp={(e) => handleSwipe(touchStartRef.current - e.clientX)}
          onTouchStart={(e) => (touchStartRef.current = e.touches[0].clientX)}
          onTouchEnd={(e) => handleSwipe(touchStartRef.current - e.changedTouches[0].clientX)}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {cards.map(({ item, pos, idx }) => (
              <motion.div
                key={item!.id}
                initial={base[pos]}
                animate={base[pos]}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                onClick={() => setActiveIndex(idx)}
                className={`absolute left-1/2 top-1/2 w-[85%] md:w-[75%] h-[90%] -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none rounded-[40px] overflow-hidden border border-white/10`}
                style={{ zIndex: base[pos].zIndex }}
              >
                <div className="relative w-full h-full group">
                  <Image
                    src={item!.image}
                    alt={item!.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={pos === "center"}
                  />
                  
                  {/* Overlay for all cards */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent ${pos !== 'center' ? 'bg-black/40' : ''}`} />

                  {/* Center Card Content */}
                  {pos === "center" && (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute inset-x-6 bottom-8 p-6 rounded-[24px] border border-white/20 bg-black/40 backdrop-blur-md"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        <p className="text-[10px] font-black tracking-[0.2em] text-white/60 uppercase">
                          {item!.tag}
                        </p>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">
                        {item!.title}
                      </h3>
                      <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="text-xs text-white/40 font-medium italic">{item!.date}</span>
                        <button className="text-[10px] font-black uppercase tracking-widest text-white bg-orange-600 px-4 py-2 rounded-full hover:bg-orange-500 transition-colors">
                          Read Story
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {INITIAL_NEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                i === activeIndex ? "w-10 bg-orange-500" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}