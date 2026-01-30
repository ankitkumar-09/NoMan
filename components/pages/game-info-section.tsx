"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface GameInfoSectionProps {
  logo: string
  description: string
}

export function GameInfoSection({ logo, description }: GameInfoSectionProps) {
  const handleDownload = () => {
    window.open("https://store.steampowered.com", "_blank")
  }

  const handleLearnMore = () => {
    window.open("https://redcube.com", "_blank")
  }

  return (
    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/toto.jpg"
        alt="Burn Point Gameplay"
        fill
        priority
        className="object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

      {/* Bottom Content */}
      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-6 space-y-4">
        {/* Logo and Description */}
        <div className="space-y-2">
          <Image
            src={logo}
            alt="Burn Point"
            width={72}
            height={72}
            className="rounded-md"
          />
          <p className="text-sm text-white/70 leading-snug max-w-[90%]">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleDownload}
            className="h-9 px-5 text-sm font-extrabold bg-white text-black rounded-full hover:bg-white/90 cursor-pointer"
          >
            Download Now
          </Button>

          <Button
            onClick={handleLearnMore}
            variant="outline"
            className="h-9 px-5 text-sm font-extrabold rounded-full border border-white/40 text-white hover:bg-white/10 cursor-pointer"
          >
            Learn More
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
