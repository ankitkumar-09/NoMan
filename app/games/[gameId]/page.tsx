'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronDown, Share2, Youtube, Twitter, Instagram, Download } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'

const GAMES_DATA: Record<string, any> = {
  g1: {
    id: 'g1',
    title: 'Burn Point',
    subtitle: 'BURN POINT',
    logo: '/images/logos/burn-point-logo.png',
    image: '/images/hero/hero-drift.png',
    developer: 'NoMan Production',
    platform: 'Android, PC, Xbox',
    releaseDate: 'February 1, 2026',
    rating: 'Blood, Intense Violence, Mature',
    gameDescription: `Burnout is a high-speed racing game that puts players in a world where speed, risk, and destruction define success. Set on busy city roads and highways, players compete in intense races while avoiding traffic and taking down rival drivers. With explosive crashes, boost mechanics, and fast-paced gameplay, Burnout rewards bold driving and quick reflexes.

Using realistic crash physics and dynamic environments, the game delivers an exciting arcade racing experience where only the fastest and bravest racers reach the top. Set in a high-speed world where adrenaline rules and hesitation means defeat, Burnout throws players into the heart of underground street racing.

In cities built for speed and highways made for chaos, racers battle not just for victory—but for dominance. Traffic becomes your greatest obstacle, rival drivers your fiercest enemies, and every second counts in the fight to stay ahead.

With spectacular crashes, intense takedowns, and pulse-pounding races, Burnout transforms reckless driving into an art form. Master dangerous shortcuts, smash through opponents, and unleash devastating crashes to earn boosts and rewards. Every race is a test of skill, reflex, and nerve, where only the bold survive.

Powered by dynamic physics and cinematic crash technology, Burnout delivers an unmatched arcade racing experience. From crowded city streets to winding mountain roads, players must push their limits, defy gravity, and dominate the asphalt. In a world where speed is everything and destruction is celebrated, only true racers rise to the top.`,
    shortDescription: 'Burnout is a high-speed racing game that puts players in a world where speed, risk, and destruction define success. Set on busy city roads and highways, players compete in intense races...',
    youtube: 'https://youtube.com/@burnpoint',
    twitter: 'https://twitter.com/burnpoint',
    instagram: 'https://instagram.com/burnpoint',
    screenshots: ['/images/news/news1.png', '/images/news/news2.png', '/images/news/news3.png', '/images/news/news1.png'],
  },
  g2: {
    id: 'g2',
    title: 'Zero Hour City',
    subtitle: 'ZERO HOUR CITY',
    logo: '/images/logos/burn-point-logo.png',
    image: '/images/news/news2.png',
    developer: 'NoMan Production',
    platform: 'Android, PC, PS5',
    releaseDate: 'March 15, 2026',
    rating: 'Blood, Violence, Mature',
    gameDescription: `Zero Hour City is an intense tactical shooter set in a sprawling metropolis where every decision matters. Navigate dynamic environments, engage in strategic combat, and uncover the city's darkest secrets. Experience cutting-edge gameplay mechanics that blend realism with intense action. From rooftop pursuits to underground operations, every mission pushes you to the brink.`,
    shortDescription: 'Zero Hour City is an intense tactical shooter set in a sprawling metropolis where every decision matters. Navigate dynamic environments, engage in strategic combat...',
    youtube: 'https://youtube.com/@zerohourcity',
    twitter: 'https://twitter.com/zerohourcity',
    instagram: 'https://instagram.com/zerohourcity',
    screenshots: ['/images/news2.png', '/images/news3.png', '/images/news1.png', '/images/news2.png'],
  },
  g3: {
    id: 'g3',
    title: 'Sky Raiders',
    subtitle: 'SKY RAIDERS',
    logo: '/images/logos/burn-point-logo.png',
    image: '/images/news/news3.png',
    developer: 'NoMan Production',
    platform: 'Android, PC, Nintendo Switch',
    releaseDate: 'April 22, 2026',
    rating: 'Action, Adventure, Mild Violence',
    gameDescription: `Sky Raiders takes you to breathtaking heights where aerial combat reigns supreme. Pilot advanced aircraft through stunning environments, engage in explosive dogfights, and uncover mysteries hidden in the clouds. Feel the rush of high-speed aerial maneuvers as you navigate treacherous skies filled with enemy patrols and environmental hazards.`,
    shortDescription: 'Sky Raiders takes you to breathtaking heights where aerial combat reigns supreme. Pilot advanced aircraft through stunning environments...',
    youtube: 'https://youtube.com/@skyraiders',
    twitter: 'https://twitter.com/skyraiders',
    instagram: 'https://instagram.com/skyraiders',
    screenshots: ['/images/news/news3.png', '/images/news/news1.png', '/images/news/news2.png', '/images/news/news3.png'],
  },
}

interface GameDetailPageProps {
  params: Promise<{
    gameId: string
  }>
}

export default function GameDetailPage({ params }: GameDetailPageProps) {
  const router = useRouter()
  const [expandedDescription, setExpandedDescription] = useState(false)
  const [gameId, setGameId] = useState<string>('')
  const [loaded, setLoaded] = useState(false)

  if (!loaded) {
    Promise.resolve(params).then((resolvedParams) => {
      setGameId(resolvedParams.gameId)
      setLoaded(true)
    })
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </main>
    )
  }

  const game = GAMES_DATA[gameId]

  if (!game) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Game Not Found</h1>
          <p className="text-white/60 mb-8">The game you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/games')}
            className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-white/90"
          >
            Go Back
          </button>
        </div>
      </main>
    )
  }

  const handleGoBack = () => {
    router.push('/games')
  }

  const handleDownload = () => {
    window.open('https://store.steampowered.com', '_blank')
  }

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 pt-4 sm:pt-6 px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <button
            onClick={handleGoBack}
            className="p-2 sm:p-3 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/30 backdrop-blur-sm" />

          <button className="p-2 sm:p-3 rounded-full hover:bg-white/10 transition-all duration-300">
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>
      </header>

      {/* Hero Image Card Section */}
      <section className="relative w-full px-3 sm:px-4 md:px-6 pt-20 sm:pt-24 md:pt-28 pb-6 sm:pb-8 md:pb-10">
        <div className="mx-auto w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-64 sm:h-80 md:h-[400px] lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Game Image */}
            <Image src={game.image} alt={game.title} fill className="object-cover" priority />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />

            {/* Bottom Left: Logo, Title, Download, and Social */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
              <div className="flex flex-col gap-4">
                {/* Logo and Title Row */}
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Logo */}
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0">
                    <Image
                      src={game.logo}
                      alt={game.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Game Title */}
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-white/70 font-semibold uppercase tracking-wide">
                      {game.subtitle}
                    </p>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                      {game.title}
                    </h1>
                  </div>
                </div>

                {/* Download Button and Social Icons */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-3 border-2 border-white text-white rounded-full font-semibold text-sm sm:text-base hover:bg-white hover:text-black transition-all duration-300"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    Download Now
                  </motion.button>

                  {/* Social Media Links */}
                  <div className="flex gap-2 sm:gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleSocialClick(game.youtube)}
                      className="p-2.5 sm:p-3 rounded-full border border-white/40 hover:border-white/80 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                      aria-label="YouTube"
                    >
                      <Youtube className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleSocialClick(game.twitter)}
                      className="p-2.5 sm:p-3 rounded-full border border-white/40 hover:border-white/80 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleSocialClick(game.instagram)}
                      className="p-2.5 sm:p-3 rounded-full border border-white/40 hover:border-white/80 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="w-full px-3 sm:px-4 md:px-6 pb-6 sm:pb-8 md:pb-12">
        <div className="mx-auto w-full max-w-6xl">
          
          {/* Game Description Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 sm:mb-8 md:mb-10"
          >
            <div className="p-4 sm:p-6 rounded-2xl border border-white/20 bg-white/5">
              <div className="text-white/80 text-sm sm:text-base leading-relaxed">
                {expandedDescription ? (
                  <>
                    {game.gameDescription.split('\n\n').map((paragraph: string, idx: number) => (
                      <p key={idx} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                    <button
                      onClick={() => setExpandedDescription(false)}
                      className="text-yellow-500 hover:text-yellow-400 font-semibold flex items-center gap-2 mt-4 transition-colors"
                    >
                      Read Less
                      <ChevronDown className="w-4 h-4 rotate-180" />
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mb-4">{game.shortDescription}</p>
                    <button
                      onClick={() => setExpandedDescription(true)}
                      className="text-yellow-500 hover:text-yellow-400 font-semibold flex items-center gap-2 transition-colors"
                    >
                      Read More
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Screenshots Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 sm:mb-8 md:mb-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Screens
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {game.screenshots.map((screenshot: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
                  className="relative aspect-video rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={screenshot}
                    alt={`Screenshot ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Specifications Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6 sm:mb-8 md:mb-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Specifications
            </h2>

            <div className="p-4 sm:p-6 rounded-2xl border border-white/20 bg-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <p className="text-white/60 text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    Developer
                  </p>
                  <p className="text-white text-base sm:text-lg md:text-xl font-semibold">
                    {game.developer}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-white/60 text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    Platform
                  </p>
                  <p className="text-white text-base sm:text-lg md:text-xl font-semibold">
                    {game.platform}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-white/60 text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    Release Date
                  </p>
                  <p className="text-white text-base sm:text-lg md:text-xl font-semibold">
                    {game.releaseDate}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-white/60 text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    Rating
                  </p>
                  <p className="text-white text-base sm:text-lg md:text-xl font-semibold">
                    {game.rating}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer with Contact Details */}
      <footer className="w-full bg-black border-t border-white/10 py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 mb-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-white font-bold text-lg">Contact</h3>
                <p className="text-white/70 text-sm">Get in touch with us</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-white font-bold text-lg">Careers</h3>
                <p className="text-white/70 text-sm">Join our team</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-white font-bold text-lg">Subscribe</h3>
                <div className="flex gap-3">
                  <button className="p-2.5 rounded-full border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all">
                    <Instagram className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-2.5 rounded-full border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all">
                    <Twitter className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-2.5 rounded-full border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all">
                    <Youtube className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-2 grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">
                  Terms & Conditions
                </a>
                <a href="#" className="block text-white/70 hover:text-white text-sm transition-colors">
                  Support
                </a>
                <a href="#" className="block text-white/70 hover:text-white text-sm transition-colors">
                  Privacy & Cookies
                </a>
              </div>

              <div className="space-y-3">
                <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">
                  Terms of Use
                </a>
                <a href="#" className="block text-white/70 hover:text-white text-sm transition-colors">
                  Legal
                </a>
                <a href="#" className="block text-white/70 hover:text-white text-sm transition-colors">
                  Health Warning
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-white/10 pt-6 sm:pt-8 text-center">
            <p className="text-white/60 text-sm">
              © 2025 NoMan Production Studio. Committed to Entertainment.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}