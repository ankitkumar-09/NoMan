import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Play } from "lucide-react"

interface GameCardProps {
  title: string
  subtitle: string
  image: string
  logo?: string
  showButtons?: boolean
  imageClassName?: string
  progress?: { 
    active: number
    total: number
    segmentStates?: number[]
  }
  paused?: boolean
  onPauseToggle?: () => void
  accentColor?: string
  accentTextColor?: string
  pageBgColor?: string
}

export function GameCard(props: GameCardProps) {
  const {
    title,
    subtitle,
    image,
    logo,
    showButtons = true,
    imageClassName,
    progress,
    paused,
    onPauseToggle,
    accentColor = "#2B7BFF",
    accentTextColor = "#ffffff",
    pageBgColor = "#000000",
  } = props

  const handleWatchTrailer = () => {
    window.open("https://youtube.com", "_blank")
  }

  const handleLearnMore = () => {
    window.open("https://redcube.com", "_blank")
  }

  const totalDots = Math.max(0, progress?.total ?? 0)
  const activeDot = progress?.active ?? 0

  // Layout constants
  const R = 44
  const NOTCH_W = 112
  const NOTCH_H = 82
  const NOTCH_R = 56
  const PAUSE_W = 104
  const PAUSE_H = 56
  const CUT_SIZE_TOP = 56
  const CUT_SIZE_BOTTOM = 56
  const CUT_TOP_Y = 120
  const CUT_BOTTOM_Y = 40

  return (
    <div
      className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[480px] group"
      style={
        {
          ["--primary" as any]: accentColor,
          ["--primary-foreground" as any]: accentTextColor,
          ["--accent" as any]: accentColor,
          ["--accent-foreground" as any]: accentTextColor,
          ["--pageBg" as any]: pageBgColor,
        } as React.CSSProperties
      }
    >
      <div 
        className="relative h-full w-full overflow-hidden" 
        style={{ 
          borderRadius: R,
          borderBottomRightRadius: 100,
          pointerEvents: "none"
        }}
      >
        {/* Background Image */}
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          priority
          className={`${imageClassName ?? "object-cover object-center"} transition-transform duration-500 group-hover:scale-110`}
          style={{ scale: 1.3 }}
          draggable={false}
        />

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: showButtons
              ? "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.15) 100%)"
              : "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
          }}
        />

        {/* Accent Glow */}
        {showButtons && (
          <div
            className="absolute inset-x-0 bottom-0 h-40 sm:h-48 md:h-56 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, color-mix(in oklab, var(--primary) 40%, transparent) 0%, transparent 100%)",
            }}
          />
        )}

        {/* Content */}
        <div
          className={[
            "absolute inset-0 flex flex-col justify-end p-3 sm:p-4 md:p-6 gap-2 sm:gap-3 md:gap-4",
            showButtons ? "sm:pr-20 md:pr-24 pb-6 md:pb-8" : "",
          ].join(" ")}
          style={{ pointerEvents: "auto" }}
        >
          {/* Title Section */}
          <div className="space-y-1 sm:space-y-2 max-w-[70%] sm:max-w-[65%] md:max-w-[60%]">
            {logo ? (
              <div className="flex items-start gap-2 sm:gap-3">
                <Image 
                  src={logo} 
                  alt={`${title} logo`} 
                  width={40}
                  height={40}
                  className="shrink-0 mt-0.5 sm:mt-1 w-9 h-9 sm:w-12 sm:h-12 md:w-[54px] md:h-[54px]"
                />
                <div className="flex flex-col">
                  <p className="text-[10px] sm:text-xs md:text-xs text-white/85 font-semibold tracking-wide uppercase leading-none">
                    {subtitle}
                  </p>
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white text-balance leading-tight mt-1 sm:mt-2">
                    {title}
                  </h2>
                </div>
              </div>
            ) : (
              <>
                <p className="text-[10px] sm:text-xs md:text-xs text-white/70 font-medium tracking-wide uppercase">
                  {subtitle}
                </p>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white text-balance leading-tight">
                  {title}
                </h2>
              </>
            )}
          </div>

          {/* Action Buttons - Stack on mobile */}
          {showButtons && (
            <div className="flex flex-col gap-1.5 sm:gap-2 items-start w-full max-w-xs pt-1 sm:pt-2 md:pt-3">
              <Button
                onClick={handleWatchTrailer}
                size="lg"
                className="w-full h-9 sm:h-10 md:h-11 px-4 sm:px-5 md:px-6 text-[12px] sm:text-[13px] md:text-[14px] font-semibold rounded-full bg-white text-black hover:opacity-90 cursor-pointer transition-all"
              >
                Watch Trailer
                <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ml-1.5 sm:ml-2" />
              </Button>

              <Button
                onClick={handleLearnMore}
                size="lg"
                variant="outline"
                className="w-full h-9 sm:h-10 md:h-11 px-4 sm:px-5 md:px-6 text-[12px] sm:text-[13px] md:text-[14px] font-semibold rounded-full border-2 border-white/30 cursor-pointer transition-all hover:border-white/60"
                style={{ color: "white" }}
              >
                Learn More
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ml-1.5 sm:ml-2" />
              </Button>
            </div>
          )}

          {/* Timeline */}
          {showButtons && totalDots > 0 && (
            <div className="flex items-center gap-0.5 sm:gap-1 pt-2 sm:pt-3 w-full max-w-xs">
              {Array.from({ length: totalDots }).map((_, idx) => {
                const fillAmount = progress?.segmentStates?.[idx] ?? 0
                return (
                  <div
                    key={idx}
                    className="flex-1 h-0.5 sm:h-1 bg-white/25 rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full rounded-full transition-all duration-100 ease-linear"
                      style={{ 
                        background: "var(--primary)",
                        width: `${fillAmount * 100}%`
                      }}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pause Button - Hide on very small screens */}
      {showButtons && (
        <div className="absolute -bottom-1 -right-4 hidden sm:block" style={{ pointerEvents: "auto" }}>
          <button
            className="backdrop-blur-xl flex items-center justify-center transition-colors rounded-b-[28px] rounded-t-[18px]"
            style={{
              width: PAUSE_W,
              height: PAUSE_H,
              background: "color-mix(in oklab, black 55%, var(--primary) 18%)",
            }}
            aria-label={paused ? "Play" : "Pause"}
            onClick={onPauseToggle}
            type="button"
          >
            {paused ? (
              <div
                className="w-0 h-0"
                style={{
                  borderTop: "7px solid transparent",
                  borderBottom: "7px solid transparent",
                  borderLeft: "10px solid rgba(255,255,255,0.9)",
                  marginLeft: 2,
                }}
              />
            ) : (
              <div className="flex gap-1">
                <div className="w-1 h-5 bg-white/90 rounded-full" />
                <div className="w-1 h-5 bg-white/90 rounded-full" />
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  )
}