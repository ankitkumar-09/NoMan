import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Play } from "lucide-react"
import { motion } from "framer-motion"

interface GameCardProps {
  title: string
  subtitle: string
  image: string
  logo?: string
  showButtons?: boolean
  imageClassName?: string
  progress?: { active: number; total: number }
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
      className="relative w-full aspect-video group"
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
      <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: R }}>
        {/* Background Image - Zoomed out so only center visible */}
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          priority
          className={`${imageClassName ?? "object-cover object-center"} transition-transform duration-500 group-hover:scale-110`}
          style={{ scale: 1.3 }}
        />

        {/* Outward Cuts - repositioned near pause button */}
        {showButtons && (
          <>
            {/* Top cut near pause button */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: CUT_SIZE_TOP,
                height: CUT_SIZE_TOP,
                borderRadius: 9999,
                background: "var(--pageBg)",
                bottom: CUT_TOP_Y,
                right: -20,
              }}
            />
            {/* Bottom cut near pause button */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: CUT_SIZE_BOTTOM,
                height: CUT_SIZE_BOTTOM,
                borderRadius: 9999,
                background: "var(--pageBg)",
                bottom: CUT_BOTTOM_Y,
                right: -20,
              }}
            />
          </>
        )}

        {/* Gradient Overlay - Lighter on right to show character, darker on left */}
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
            className="absolute inset-x-0 bottom-0 h-56 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, color-mix(in oklab, var(--primary) 40%, transparent) 0%, transparent 100%)",
            }}
          />
        )}

        {/* Notch Cutout */}
        {showButtons && (
          <div
            className="absolute bottom-0 right-0"
            style={{
              width: NOTCH_W,
              height: NOTCH_H,
              background: "var(--pageBg)",
              borderTopLeftRadius: NOTCH_R,
            }}
          />
        )}

        {/* Content */}
        <div
          className={[
            "absolute inset-0 flex flex-col justify-end p-6 gap-2",
            showButtons ? "pr-24 pb-6" : "",
          ].join(" ")}
        >
          {/* Title Section - Left aligned */}
          <div className="space-y-1 max-w-[50%]">
            {logo ? (
              <div className="flex items-start gap-2">
                <Image src={logo} alt={`${title} logo`} width={44} height={44} className="shrink-0 mt-0" />
                <div className="flex flex-col">
                  <p className="text-xs text-white/85 font-semibold tracking-wide uppercase leading-none">
                    {subtitle}
                  </p>
                  <h2 className="text-xl md:text-2xl font-bold text-white text-balance leading-tight mt-1">
                    {title}
                  </h2>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs text-white/70 font-medium tracking-wide uppercase">{subtitle}</p>
                <h2 className="text-xl md:text-2xl font-bold text-white text-balance leading-tight">{title}</h2>
              </>
            )}
          </div>

          {/* Action Buttons */}
          {showButtons && (
            <div className="flex flex-col gap-1.5 items-start w-full max-w-xs">
              <Button
                onClick={handleWatchTrailer}
                size="sm"
                className="w-full h-9 px-5 text-[12px] font-semibold rounded-full bg-white text-black hover:opacity-90 cursor-pointer transition-all"
              >
                Watch Trailer
                <Play className="w-3 h-3 ml-1.5" />
              </Button>

              <Button
                onClick={handleLearnMore}
                size="sm"
                variant="outline"
                className="w-full h-9 px-5 text-[12px] font-semibold rounded-full border-2 border-white/30 cursor-pointer transition-all hover:border-white/60"
                style={{ color: "white" }}
              >
                Learn More
                <ArrowUpRight className="w-3 h-3 ml-1.5" />
              </Button>
            </div>
          )}

          {/* WhatsApp Status-style Segmented Timeline */}
          {showButtons && totalDots > 0 && (
            <div className="flex items-center gap-0.5 pt-2 w-full max-w-xs">
              {Array.from({ length: totalDots }).map((_, idx) => (
                <motion.div
                  key={idx}
                  className="flex-1 h-0.5 bg-white/25 rounded-full overflow-hidden"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "var(--primary)" }}
                    initial={{ width: idx < activeDot ? "100%" : "0%" }}
                    animate={{
                      width: idx < activeDot ? "100%" : idx === activeDot ? "100%" : "0%",
                    }}
                    transition={{
                      duration: idx === activeDot ? 9.5 : 0.3,
                      ease: idx === activeDot ? "linear" : "easeOut",
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pause Button */}
      {showButtons && (
        <div className="absolute -bottom-1 -right-4">
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