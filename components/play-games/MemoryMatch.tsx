"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const EMOJIS = ["🎮", "🚀", "⚡", "🔥", "💎", "🎯", "🌟", "🎪"]
const PAIRS = [...EMOJIS, ...EMOJIS]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface Card {
  id: number
  emoji: string
  flipped: boolean
  matched: boolean
}

export default function MemoryMatch() {
  const initCards = useCallback(
    () =>
      shuffle(PAIRS).map((emoji, i) => ({
        id: i,
        emoji,
        flipped: false,
        matched: false,
      })),
    []
  )

  const [cards, setCards] = useState<Card[]>(initCards)
  const [selected, setSelected] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [locked, setLocked] = useState(false)
  const [bestMoves, setBestMoves] = useState<number | null>(null)
  const [gameWon, setGameWon] = useState(false)

  const handleFlip = useCallback(
    (idx: number) => {
      if (locked || cards[idx].flipped || cards[idx].matched || selected.length >= 2) return

      const newCards = [...cards]
      newCards[idx].flipped = true
      const newSelected = [...selected, idx]
      setCards(newCards)
      setSelected(newSelected)

      if (newSelected.length === 2) {
        setMoves((m) => m + 1)
        const [a, b] = newSelected

        if (newCards[a].emoji === newCards[b].emoji) {
          newCards[a].matched = true
          newCards[b].matched = true
          setCards([...newCards])
          setSelected([])
          const newMatches = matches + 1
          setMatches(newMatches)

          if (newMatches === EMOJIS.length) {
            const totalMoves = moves + 1
            setGameWon(true)
            if (bestMoves === null || totalMoves < bestMoves) {
              setBestMoves(totalMoves)
            }
          }
        } else {
          setLocked(true)
          setTimeout(() => {
            newCards[a].flipped = false
            newCards[b].flipped = false
            setCards([...newCards])
            setSelected([])
            setLocked(false)
          }, 800)
        }
      }
    },
    [cards, selected, locked, moves, matches, bestMoves]
  )

  const resetGame = useCallback(() => {
    setCards(initCards())
    setSelected([])
    setMoves(0)
    setMatches(0)
    setLocked(false)
    setGameWon(false)
  }, [initCards])

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {/* Stats */}
      <div className="flex gap-4 text-sm font-semibold">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
          <span className="text-cyan-400 text-xs">MOVES</span>
          <span className="text-xl text-white">{moves}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/20 border border-violet-500/30">
          <span className="text-violet-400 text-xs">MATCHED</span>
          <span className="text-xl text-white">{matches}/{EMOJIS.length}</span>
        </div>
        {bestMoves !== null && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
            <span className="text-amber-400 text-xs">BEST</span>
            <span className="text-xl text-white">{bestMoves}</span>
          </div>
        )}
      </div>

      {/* Board */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
        {cards.map((card, i) => (
          <motion.button
            key={card.id}
            whileHover={!card.flipped && !card.matched ? { scale: 1.06 } : {}}
            whileTap={!card.flipped && !card.matched ? { scale: 0.94 } : {}}
            onClick={() => handleFlip(i)}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl text-2xl sm:text-3xl flex items-center justify-center transition-all duration-300 font-bold
              ${card.matched ? "bg-emerald-500/30 ring-2 ring-emerald-400/40" : card.flipped ? "bg-cyan-500/20 border border-cyan-400/30" : "bg-white/10 hover:bg-white/15 border border-white/5 cursor-pointer"}
            `}
          >
            <AnimatePresence mode="wait">
              {card.flipped || card.matched ? (
                <motion.span
                  key="emoji"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {card.emoji}
                </motion.span>
              ) : (
                <motion.span
                  key="back"
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-white/20"
                >
                  ?
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Win / Reset */}
      <AnimatePresence>
        {gameWon && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <p className="text-emerald-400 font-bold text-lg">🎉 All matched in {moves} moves!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-full text-white font-semibold text-sm transition-colors"
            >
              Play Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {!gameWon && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          className="px-5 py-2 bg-white/10 hover:bg-white/15 rounded-full text-white/70 font-medium text-xs tracking-wide transition-colors"
        >
          Shuffle & Reset
        </motion.button>
      )}
    </div>
  )
}
