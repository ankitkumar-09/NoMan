'use client'

import { useState, Suspense } from 'react'
import { Navbar } from "@/components/layout/navbar"
import { HeroRotator } from "@/components/pages/hero-rotator"
import { GameShowcase } from "@/components/pages/game-showcase"
import { GameInfoSection } from "@/components/pages/game-info-section"
import { GameLibrary } from "@/components/pages/game-library"
import { NewsPeekCarousel } from "@/components/carousel/NewsPeekCarousel"
import { Footer } from "@/components/layout/footer"
import { HomePageContent } from "@/components/layout/home-page-content"
import { WelcomeScreen } from "@/components/layout/welcome-screen"

let hasPlayedIntro = false

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(!hasPlayedIntro)

  const handleWelcomeComplete = () => {
    hasPlayedIntro = true
    setShowIntro(false)
  }

  return (
    <main className="min-h-screen bg-black overflow-x-hidden">

      {showIntro && <WelcomeScreen onComplete={handleWelcomeComplete} />}

      <Navbar />

      <Suspense fallback={null}>
        <HomePageContent>

          {/* HERO SECTION */}
          <section className="w-full pt-28 pb-6 md:pt-32 md:pb-8">
            <div className="w-full max-w-7xl mx-auto px-4">
              <HeroRotator />
            </div>
          </section>

          {/* GAME SHOWCASE */}
          <section className="w-full py-6">
            <div className="w-full max-w-7xl mx-auto px-4">
              <GameShowcase />
            </div>
          </section>

          {/* GAME INFO SECTION (Self-contained width control inside component) */}
          {/* GAME INFO SECTION */}
{/* GAME INFO SECTION */}
{/* GAME INFO SECTION */}
{/* GAME INFO SECTION */}
{/* GAME INFO SECTION */}
<section className="w-full px-3 sm:px-4 md:px-6 py-6">
  <div className="mx-auto w-full max-w-6xl">
    <GameInfoSection
      logo="/images/logos/burn-point-logo.png"
      title="BURN POINT"
      subtitle="RACING GAME"
      description="In BURN POINT, you control your survival. As the last racer in a world where winning means everything, it's up to you to conquer the streets and own the drift."
    />
  </div>
</section>
          {/* GAME LIBRARY */}
          <section className="w-full py-6">
            <div className="w-full max-w-7xl mx-auto px-4">
              <GameLibrary />
            </div>
          </section>

          {/* NEWS */}
          <section className="w-full py-6" data-section="news">
            <div className="w-full max-w-7xl mx-auto px-4">
              <NewsPeekCarousel />
            </div>
          </section>

          <Footer />

        </HomePageContent>
      </Suspense>
    </main>
  )
}
