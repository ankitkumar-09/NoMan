"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

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
  description,
}: GameInfoSectionProps) {

  const router = useRouter()

  const handleDownload = () => {
    router.push("/games/FlappyAR")
  }

  const handleLearnMore = () => {
    window.open("https://www.nomangames.store/games/FlappyAR", "_blank")
  }

  return (
    <div className="relative w-full h-[320px] sm:h-[400px] md:h-[480px] lg:h-[520px] rounded-lg sm:rounded-2xl md:rounded-3xl overflow-hidden bg-black group">

      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      >
        <source src="/images/3.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-4 sm:p-6 md:p-8 lg:p-10 space-y-3 sm:space-y-4">

        {/* Logo + Title */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 shrink-0">
              <Image
                src={logo}
                alt="Logo"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>

            <div className="min-w-0">
              <p className="text-[8px] sm:text-xs md:text-sm font-bold tracking-[0.2em] text-white/70 uppercase">
                {subtitle}
              </p>

              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase">
                {title}
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed max-w-2xl drop-shadow-md">
            {description}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 pt-1 sm:pt-2">

          <Button
            onClick={handleDownload}
            className="h-8 sm:h-10 md:h-12 px-4 sm:px-6 md:px-8 text-[10px] sm:text-xs md:text-sm font-black bg-white text-black rounded-full hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
          >
            DOWNLOAD NOW
          </Button>

          <Button
            onClick={handleLearnMore}
            variant="outline"
            className="h-8 sm:h-10 md:h-12 px-4 sm:px-6 md:px-8 text-[10px] sm:text-xs md:text-sm font-black rounded-full border-white/20 bg-white/5 text-white backdrop-blur-md hover:bg-white/10 transition-all"
          >
            LEARN MORE
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
          </Button>

        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

    </div>
  )
}