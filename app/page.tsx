import { Navbar } from "@/components/layout/navbar"
import { GameShowcase } from "@/components/pages/game-showcase"
import { GameInfoSection } from "@/components/pages/game-info-section"
import { Footer } from "@/components/layout/footer"
import { HeroRotator } from "@/components/pages/hero-rotator"
import { NewsPeekCarousel } from "@/components/carousel/NewsPeekCarousel"
import { GameLibrary } from "@/components/pages/game-library"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section - Landscape */}
      <section className="w-full px-4 pt-20 pb-6 md:pt-20 md:pb-8">
        <div className="w-full">
          <HeroRotator />
        </div>
      </section>

      {/* Game Showcase Section */}
      <GameShowcase />

      {/* Game Info Section */}
      <section className="w-full px-4 py-4 md:py-6">
        <div className="container mx-auto max-w-7xl">
          <GameInfoSection
            logo="/images/burn-point-logo.png"
            description="In BURN POINT, you control your survival. As the last racer in a world where winning means everything, it's up to you to conquer the streets and own the drift. Make your choices, face the consequences."
          />
        </div>
      </section>

      {/* Game Library Section */}
      

      {/* News Carousel Section */}
      <section className="w-full px-4 py-4 md:py-6">
        <div className="container mx-auto max-w-7xl flex justify-center">
          <NewsPeekCarousel />
        </div>
      </section>
      <GameLibrary />
      {/* Footer Section */}
      <Footer />
    </main>
  )
}