// components/GameCarousel.tsx (example parent that switches 1=blue, 2=orange, 3=grey)
"use client"

import { useState } from "react"
import { GameCard } from "../pages/game-card"
import { Button } from "@/components/ui/button"

const CARDS = [
  {
    title: "Own the Drift",
    subtitle: "BURN POINT",
    image: "/games/burnpoint.jpg",
    logo: "/games/burnpoint-logo.png",
  },
  {
    title: "Sky Raiders",
    subtitle: "AURORA",
    image: "/games/skyraiders.jpg",
    logo: "/games/skyraiders-logo.png",
  },
  {
    title: "Neon Runner",
    subtitle: "METRO",
    image: "/games/neonrunner.jpg",
    logo: "/games/neonrunner-logo.png",
  },
]

// 1st bluish, 2nd orangish light, 3rd light greyish
const THEMES = [
  { accent: "#2B7BFF", fg: "#ffffff" }, // blue
  { accent: "#FF9A3D", fg: "#111111" }, // orange light
  { accent: "#C9CED8", fg: "#111111" }, // grey light
]

export default function GameCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const theme = THEMES[active] ?? THEMES[0]
  const card = CARDS[active]

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <GameCard
        title={card.title}
        subtitle={card.subtitle}
        image={card.image}
        logo={card.logo}
        progress={{ active, total: CARDS.length }}
        paused={paused}
        onPauseToggle={() => setPaused((p) => !p)}
        accentColor={theme.accent}
        accentTextColor={theme.fg}
        pageBgColor="#000000" // change if your page bg isn't black
      />

      {/* demo controls */}
      <div className="mt-4 flex gap-2 justify-center">
        <Button variant="outline" onClick={() => setActive((a) => (a + CARDS.length - 1) % CARDS.length)}>
          Prev
        </Button>
        <Button onClick={() => setActive((a) => (a + 1) % CARDS.length)}>Next</Button>
      </div>
    </div>
  )
}
