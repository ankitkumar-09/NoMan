"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface GameInfoSectionProps {
  logo: string
  title: string
  subtitle: string
  description: string
}

export function GameInfoSection({ 
  logo, 
  title, 
  subtitle, 
  description
}: GameInfoSectionProps) {
  
  const handleDownload = () => {
    window.open("https://store.steampowered.com", "_blank")
  }

  const handleLearnMore = () => {
    window.open("https://redcube.com", "_blank")
  }

  return (
    <section className="w-full px-3 sm:px-4 md:px-6 py-6 sm:py-12 md:py-16 bg-black">
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative w-full h-[400px] sm:h-[480px] md:h-[520px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden bg-black group">
          
          {/* Background Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          >
            <source src="/images/2.mp4" type="video/mp4" />
          </video>

          {/* Overlays: Darker at bottom for text, subtle vignette on left */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

          {/* Content Layer: Matches padding of your Game Cards */}
          <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-8 md:p-10 space-y-4 sm:space-y-6">
            
            {/* Brand/Logo Section */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0">
                  <Image
                    src={logo}
                    alt="Logo"
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-white/70 uppercase">
                    {subtitle}
                  </p>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
                    {title}
                  </h2>
                </div>
              </div>
              
              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl drop-shadow-md">
                {description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
              <Button
                onClick={handleDownload}
                className="h-10 sm:h-12 px-6 sm:px-8 text-xs sm:text-sm font-black bg-white text-black rounded-full hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
              >
                DOWNLOAD NOW
              </Button>

              <Button
                onClick={handleLearnMore}
                variant="outline"
                className="h-10 sm:h-12 px-6 sm:px-8 text-xs sm:text-sm font-black rounded-full border-white/20 bg-white/5 text-white backdrop-blur-md hover:bg-white/10 transition-all"
              >
                LEARN MORE
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Subtle Shine Effect */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        </div>
      </div>
    </section>
  )
}

export default function Page() {
  return (
    <section className="w-full px-4 py-4 md:py-6">
      <div className="container mx-auto max-w-7xl">
        <GameInfoSection
          logo="/images/logos/burn-point-logo.png"
          title="BURN POINT"
          subtitle="RACING GAME"
          description="In BURN POINT, you control your survival. As the last racer in a world where winning means everything, it's up to you to conquer the streets and own the drift. Make your choices, face the consequences."
        />
      </div>
    </section>
  )
}