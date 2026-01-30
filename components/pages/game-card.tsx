import React from "react"
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
  // Added focusPoint to handle the vertical images (e.g., "top", "center", "20%")
  focusPoint?: string 
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
    focusPoint = "center 25%", // Best default for hero shots with faces
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

  // Layout constants
  const R = 44
  const PAUSE_W = 104
  const PAUSE_H = 56

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
        }}
      >
        {/* Background Image - Fixed Framing */}
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          priority
          className={`${imageClassName ?? "object-cover"} transition-transform duration-500 group-hover:scale-105`}
          sizes="(max-width: 768px) 100vw, 1200px"
          style={{ 
            objectPosition: focusPoint 
          }}
          draggable={false}
        />

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: showButtons
              ? "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)"
              : "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
          }}
        />

        {/* Accent Glow */}
        {showButtons && (
          <div
            className="absolute inset-x-0 bottom-0 h-40 sm:h-48 md:h-56 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(to top, color-mix(in oklab, var(--primary) 35%, transparent) 0%, transparent 100%)",
            }}
          />
        )}

        {/* Content Layer */}
        <div
          className={[
            "absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-6 md:p-8 gap-3 sm:gap-4",
            showButtons ? "sm:pr-24 md:pr-32" : "",
          ].join(" ")}
          style={{ pointerEvents: "auto" }}
        >
          {/* Title Section */}
          <div className="space-y-1 sm:space-y-2 max-w-full sm:max-w-[80%]">
            {logo ? (
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 shrink-0">
                   <Image 
                    src={logo} 
                    alt={`${title} logo`} 
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] sm:text-xs font-semibold tracking-widest text-white/70 uppercase">
                    {subtitle}
                  </p>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                    {title}
                  </h2>
                </div>
              </div>
            ) : (
              <>
                <p className="text-[10px] sm:text-xs font-semibold tracking-widest text-white/70 uppercase">
                  {subtitle}
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {title}
                </h2>
              </>
            )}
          </div>

          {/* Action Buttons */}
          {showButtons && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start pt-2">
              <Button
                onClick={handleWatchTrailer}
                className="w-full sm:w-auto px-6 h-10 sm:h-11 rounded-full bg-white text-black hover:bg-white/90 font-bold uppercase text-[11px] tracking-tight"
              >
                Watch Trailer
                <Play className="w-3.5 h-3.5 ml-2 fill-current" />
              </Button>

              <Button
                onClick={handleLearnMore}
                variant="outline"
                className="w-full sm:w-auto px-6 h-10 sm:h-11 rounded-full border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 font-bold uppercase text-[11px] tracking-tight"
              >
                Learn More
                <ArrowUpRight className="w-3.5 h-3.5 ml-2" />
              </Button>
            </div>
          )}

          {/* Timeline */}
          {showButtons && totalDots > 0 && (
            <div className="flex items-center gap-1.5 pt-4 w-full max-w-[200px]">
              {Array.from({ length: totalDots }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-[var(--primary)] transition-all duration-300"
                    style={{ 
                      width: `${(progress?.segmentStates?.[idx] ?? 0) * 100}%`
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pause Button */}
      {showButtons && (
        <div className="absolute -bottom-1 -right-4 hidden sm:block z-30">
          <button
            className="backdrop-blur-xl flex items-center justify-center transition-all rounded-b-[28px] rounded-t-[18px] hover:bg-white/10"
            style={{
              width: PAUSE_W,
              height: PAUSE_H,
              background: "color-mix(in oklab, black 60%, var(--primary) 15%)",
            }}
            aria-label={paused ? "Play" : "Pause"}
            onClick={onPauseToggle}
            type="button"
          >
            {paused ? (
              <Play className="w-5 h-5 text-white fill-current" />
            ) : (
              <div className="flex gap-1.5">
                <div className="w-1.5 h-5 bg-white/90 rounded-full" />
                <div className="w-1.5 h-5 bg-white/90 rounded-full" />
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  )
}