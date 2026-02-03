"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowUpRight, Play, Pause } from "lucide-react"

export function GameCard(props: any) {
  const { title, subtitle, image, logo, accentColor = "#2B7BFF", focusPoint = "center 30%", paused, onPauseToggle, showButtons, progress } = props

  return (
    /* Removed max-w to let the parent container (max-w-7xl) control the width */
    <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[550px] rounded-[2rem] overflow-hidden group shadow-2xl">
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

      <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end">
        <div className="flex items-start gap-4">
          {logo && (
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0">
              <Image src={logo} alt="logo" fill className="object-contain" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-white/60 uppercase mb-1">
              {subtitle}
            </p>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase italic">
              {title}
            </h2>
          </div>
        </div>

        {showButtons && (
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs uppercase hover:bg-gray-200 transition-all flex items-center gap-2">
              Watch Trailer <Play className="w-3 h-3 fill-current" />
            </button>
            <button className="px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs uppercase hover:bg-white/20 transition-all flex items-center gap-2">
              Learn More <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {showButtons && (
        <button 
          onClick={onPauseToggle}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white"
        >
          {paused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
        </button>
      )}
    </div>
  )
}