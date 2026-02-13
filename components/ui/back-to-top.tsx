'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from "lucide-react"

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentScroll = window.scrollY
      const progress = (currentScroll / totalHeight) * 100
      
      setScrollProgress(progress)
      setIsVisible(currentScroll > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Progress Ring Math
  const radius = 24
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (scrollProgress / 100) * circumference

  return (
    <div
      className={`fixed bottom-10 right-10 z-[100] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        className="relative group flex items-center justify-center w-14 h-14 outline-none"
      >
        {/* Soft Ambient Shadow/Glow */}
        <div className="absolute inset-0 rounded-full bg-orange-500/5 blur-xl group-hover:bg-orange-500/20 transition-all duration-500" />

        {/* Outer Progress Ring - Thin & Elegant */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="#f97316"
            strokeWidth="2"
            fill="none"
            strokeDasharray={circumference}
            style={{ 
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 0.3s ease-out'
            }}
          />
        </svg>

        {/* The Center Core */}
        <div className="absolute inset-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-orange-500 group-hover:border-orange-400 group-shadow-[0_0_15px_rgba(249,115,22,0.4)]">
          <ArrowUp 
            // strokeWidth increased to 3 for that "Bold" look
            className="text-white group-hover:text-black transition-all duration-300 group-hover:-translate-y-0.5" 
            size={22} 
            strokeWidth={3} 
          />
        </div>
      </button>
    </div>
  )
}