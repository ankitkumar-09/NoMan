import { Navbar } from "@/components/navbar"
import { GameShowcase } from "@/components/game-showcase"
import { GameInfoSection } from "@/components/game-info-section"
import { Footer } from "@/components/footer"
import { HeroRotator } from "@/components/hero-rotator"
import { NewsPeekCarousel } from "@/components/NewsPeekCarousel"


export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section - Landscape */}
      <section className="w-full px-4 py-6 md:py-8">
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

      {/* News Carousel Section */}
      <section className="w-full px-4 py-4 md:py-6">
        <div className="container mx-auto max-w-7xl flex justify-center">
          <NewsPeekCarousel />
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </main>
  )
}

