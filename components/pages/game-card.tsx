"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowUpRight, Play, Pause } from "lucide-react"
import { ProgressTimeline } from "@/components/progress-timeline"

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

export function GameCard(props: any) {
  const {
    title,
    subtitle,
    image,
    logo,
    accentColor = "#2B7BFF",
    focusPoint = "center 30%",
    paused,
    onPauseToggle,
    showButtons,
    progress,
  } = props

  const totalDots = Math.max(0, progress?.total ?? 0)

  return (
    <div className="relative w-full h-[280px] sm:h-[350px] md:h-[450px] lg:h-[550px] rounded-[2rem] overflow-hidden group shadow-2xl">

      {/* Background Image + Gradient */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ objectPosition: focusPoint }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-4 sm:p-6 md:p-10 flex flex-col justify-end">
        <div className="flex items-start gap-4">
          {logo && (
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 shrink-0">
              <Image src={logo} alt="logo" fill className="object-contain" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-[8px] sm:text-xs md:text-sm font-bold tracking-[0.2em] text-white/60 uppercase mb-1">
              {subtitle}
            </p>
            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {title}
            </h2>

            {/* Mobile only: subtitle text below title to fill space */}
            {showButtons && (
              <p className="flex sm:hidden mt-1 text-white/50 text-[10px] font-medium tracking-wide leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Desktop only: Watch Trailer + Learn More buttons */}
        {showButtons && (
          <div className="hidden sm:flex mt-6 flex-wrap gap-3">
            <button
              onClick={() => window.open("https://www.youtube.com/channel/UCQWzNg1ToM8umNt0YUaIVhw", "_blank", "noopener,noreferrer")}
              className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-sm uppercase hover:bg-gray-200 transition-all flex items-center gap-2"
            >
              Watch Trailer <Play className="w-4 h-4 fill-current" />
            </button>
            {/* <button
              onClick={() => window.open("https://redcube.com", "_blank", "noopener,noreferrer")}
              className="px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm uppercase hover:bg-white/20 transition-all flex items-center gap-2"
            >
              Learn More <ArrowUpRight className="w-4 h-4" />
            </button> */}
          </div>
        )}

        {/* Progress timeline + pause button — inside card at bottom */}
        {showButtons && totalDots > 0 && (
          <div className="flex items-center gap-3 mt-4">
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
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full flex-shrink-0 grid place-items-center border-2 border-white/55 hover:border-white/90 bg-black/40 backdrop-blur-md shadow-lg"
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
  )
}