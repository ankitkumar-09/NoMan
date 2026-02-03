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

let hasPlayedIntro = false;

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(!hasPlayedIntro)

  const handleWelcomeComplete = () => {
    hasPlayedIntro = true;
    setShowIntro(false);
  }

  return (
    <main className="min-h-screen bg-black">
      {showIntro && <WelcomeScreen onComplete={handleWelcomeComplete} />}

      <Navbar />

      <Suspense fallback={null}>
        <HomePageContent>
          {/* Hero Section: Increased top padding for mobile to prevent Navbar overlap */}
          <section className="w-full px-4 pt-28 pb-6 md:pt-32 md:pb-8">
            <div className="w-full max-w-7xl mx-auto">
              <HeroRotator />
            </div>
          </section>

          {/* Consistent Width Container for Showcase */}
          <div className="w-full max-w-7xl mx-auto">
             <GameShowcase />
          </div>

          <section className="w-full px-4 py-4 md:py-6">
            <div className="container mx-auto max-w-7xl">
              <GameInfoSection
                logo="/images/logos/burn-point-logo.png"
                title="BURN POINT"
                subtitle="RACING GAME"
                description="In BURN POINT, you control your survival. As the last racer in a world where winning means everything, it's up to you to conquer the streets and own the drift."
              />
            </div>
          </section>

          <div className="w-full max-w-7xl mx-auto">
            <GameLibrary />
          </div>

          <section className="w-full px-4 py-4 md:py-6" data-section="news">
            <div className="container mx-auto max-w-7xl">
              <NewsPeekCarousel />
            </div>
          </section>

          <Footer />
        </HomePageContent>
      </Suspense>
    </main>
  )
}