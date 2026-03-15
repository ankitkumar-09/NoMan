'use client'
import { Footer } from '@/components/layout/footerGames'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronDown, Youtube, Linkedin, Instagram, Download, Clock } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { BackToTop } from '@/components/ui/back-to-top'
import { GAMES_DATA, Game } from '@/lib/data/game-data' // ✅ Import shared data

interface GameDetailPageProps {
  params: Promise<{ gameId: string }>
}
function CountdownTimer({ releaseDate }: { releaseDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const target = new Date(releaseDate)
    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) return
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [releaseDate])

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hrs', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ]

  return (
    <div className="flex gap-2">
      {units.map(({ label, value }) => (
        <div key={label} className="text-center bg-white/8 border border-white/15 rounded-lg px-3 py-2 min-w-[50px]">
          <div className="text-lg sm:text-xl font-bold text-white leading-none">
            {String(value).padStart(2, '0')}
          </div>
          <div className="text-[10px] text-white/45 uppercase tracking-wider mt-1">{label}</div>
        </div>
      ))}
    </div>
  )
}
export default function GameDetailPage({ params }: GameDetailPageProps) {
  const router = useRouter()
  const [expandedDescription, setExpandedDescription] = useState(false)
  const [game, setGame] = useState<Game | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.resolve(params).then((resolvedParams) => {
      const foundGame = GAMES_DATA[resolvedParams.gameId]
      setGame(foundGame ?? null)
      setLoaded(true)
    })
  }, [params])

  if (!loaded) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </main>
    )
  }

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

  // ✅ Use game.gameDescription directly (no shortDescription needed)
  const shortDescription = game.gameDescription.split('\n\n')[0]

  const handleGoBack = () => router.push('/games')
  const handleDownload = () => window.open('https://store.steampowered.com', '_blank')
  const handleSocialClick = (url: string) => window.open(url, '_blank')

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      <header className="fixed top-20 left-0 right-0 z-30 pt-4 sm:pt-6 px-3 sm:px-4 md:px-6">
        <div className="flex items-start max-w-7xl mx-auto w-full">
          <button
            onClick={handleGoBack}
            className="p-2 sm:p-3 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>
      </header>

      <section className="relative w-full px-3 sm:px-4 md:px-6 pt-32 sm:pt-36 md:pt-40 pb-6 sm:pb-8 md:pb-10">
        <div className="mx-auto w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-64 sm:h-80 md:h-[400px] lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image src={game.image} alt={game.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  {game.logo && (
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0">
                      <Image src={game.logo} alt={game.title} fill className="object-contain" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-white/70 font-semibold uppercase tracking-wide">
                      {game.subtitle}
                    </p>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                      {game.title}
                    </h1>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  {game.status === 'upcoming' ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        disabled
                        className="flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 border-2 border-white/30 text-white/40 rounded-full font-semibold text-sm sm:text-base cursor-not-allowed"
                      >
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                        Coming Soon
                      </button>
                      <CountdownTimer releaseDate={game.releaseDate} />
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 border-2 border-white text-white rounded-full font-semibold text-sm sm:text-base hover:bg-white hover:text-black transition-all duration-300"
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                      Download Now
                    </motion.button>
                  )}

                  <div className="flex gap-2 sm:gap-3">
                    {[
                      { icon: Youtube, url: game.youtube, label: 'YouTube' },
                      { icon: Linkedin, url: game.linkedin, label: 'Linkedin' },
                      { icon: Instagram, url: game.instagram, label: 'Instagram' },
                    ].map(({ icon: Icon, url, label }) => (
                      <motion.button
                        key={label}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleSocialClick(url)}
                        className="p-2.5 sm:p-3 rounded-full border border-white/40 hover:border-white/80 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                        aria-label={label}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="w-full px-3 sm:px-4 md:px-6 pb-6 sm:pb-8 md:pb-12">
        <div className="mx-auto w-full max-w-6xl">

          {/* Description */}
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
                    {game.gameDescription.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4">{paragraph}</p>
                    ))}
                    <button
                      onClick={() => setExpandedDescription(false)}
                      className="text-yellow-500 hover:text-yellow-400 font-semibold flex items-center gap-2 mt-4 transition-colors"
                    >
                      Read Less <ChevronDown className="w-4 h-4 rotate-180" />
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mb-4">{shortDescription}</p>
                    <button
                      onClick={() => setExpandedDescription(true)}
                      className="text-yellow-500 hover:text-yellow-400 font-semibold flex items-center gap-2 transition-colors"
                    >
                      Read More <ChevronDown className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Screenshots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 sm:mb-8 md:mb-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">Screens</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {game.screenshots.map((screenshot, idx) => (
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

          {/* Specifications */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6 sm:mb-8 md:mb-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">Specifications</h2>
            <div className="p-4 sm:p-6 rounded-2xl border border-white/20 bg-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {[
                  { label: 'Developer', value: game.developer },
                  { label: 'Platform', value: game.platform },
                  { label: 'Release Date', value: game.releaseDate },
                  { label: 'Rating', value: game.rating },
                ].map(({ label, value }) => (
                  <div key={label} className="space-y-2">
                    <p className="text-white/60 text-xs sm:text-sm font-semibold uppercase tracking-wider">{label}</p>
                    <p className="text-white text-base sm:text-lg md:text-xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <Footer />
      <BackToTop />
    </main>
  )
}