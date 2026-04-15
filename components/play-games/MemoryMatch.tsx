"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getPlayerId, getPlayerName, setPlayerName } from "@/lib/player"
import { Trophy, X } from "lucide-react"

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

interface LeaderboardEntry {
  playerId: string
  name: string
  bestMoves: number
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

  // Leaderboard state
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loadingBoard, setLoadingBoard] = useState(false)
  const [myRank, setMyRank] = useState<number | null>(null)

  // Name prompt
  const [showNamePrompt, setShowNamePrompt] = useState(false)
  const [nameInput, setNameInput] = useState("")
  const [nameError, setNameError] = useState("")
  const [pendingMoves, setPendingMoves] = useState<number | null>(null)
  const [playerName, setLocalPlayerName] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const name = getPlayerName()
    setLocalPlayerName(name)
  }, [])

  const fetchLeaderboard = async () => {
    setLoadingBoard(true)
    try {
      const res = await fetch("/api/leaderboard")
      const data = await res.json()
      setLeaderboard(data.scores || [])

      const pid = getPlayerId()
      const rank = data.scores.findIndex(
        (s: LeaderboardEntry) => s.playerId === pid
      )
      setMyRank(rank === -1 ? null : rank + 1)
    } catch {
      console.error("Failed to fetch leaderboard")
    } finally {
      setLoadingBoard(false)
    }
  }

  const submitScore = async (name: string, finalMoves: number) => {
    setSubmitting(true)
    try {
      const playerId = getPlayerId()
      await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, name, moves: finalMoves }),
      })
      await fetchLeaderboard()
      setShowLeaderboard(true)
    } catch {
      console.error("Failed to submit score")
    } finally {
      setSubmitting(false)
    }
  }

  const handleWin = (finalMoves: number) => {
    setGameWon(true)
    if (bestMoves === null || finalMoves < bestMoves) {
      setBestMoves(finalMoves)
    }

    const name = getPlayerName()
    if (!name) {
      setPendingMoves(finalMoves)
      setShowNamePrompt(true)
    } else {
      submitScore(name, finalMoves)
    }
  }

  const handleNameSubmit = () => {
    if (!nameInput.trim()) {
      setNameError("Please enter a name.")
      return
    }
    if (nameInput.trim().length > 20) {
      setNameError("Max 20 characters.")
      return
    }
    setPlayerName(nameInput.trim())
    setLocalPlayerName(nameInput.trim())
    setShowNamePrompt(false)
    if (pendingMoves !== null) {
      submitScore(nameInput.trim(), pendingMoves)
    }
  }

  const handleFlip = useCallback(
    (idx: number) => {
      if (
        locked ||
        cards[idx].flipped ||
        cards[idx].matched ||
        selected.length >= 2
      )
        return

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
            const finalMoves = moves + 1
            handleWin(finalMoves)
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

  const currentPlayerId = typeof window !== "undefined" ? getPlayerId() : ""

  return (
    <div className="flex flex-col items-center gap-6 select-none">

      {/* Stats */}
      <div className="flex gap-4 text-sm font-semibold flex-wrap justify-center">
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
        <button
          onClick={() => {
            fetchLeaderboard()
            setShowLeaderboard(true)
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30 transition-all text-xs font-bold"
        >
          <Trophy className="w-3.5 h-3.5" /> LEADERBOARD
        </button>
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
            <p className="text-emerald-400 font-bold text-lg">
              🎉 All matched in {moves} moves!
            </p>
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

      {/* ── Name Prompt Modal ── */}
      <AnimatePresence>
        {showNamePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-900 border border-white/10 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl p-8 space-y-6 text-center"
            >
              <div className="space-y-2">
                <p className="text-3xl">🏆</p>
                <h3 className="text-xl font-bold text-white">You Won!</h3>
                <p className="text-white/40 text-sm">
                  Enter your name to save your score to the leaderboard.
                </p>
              </div>
              <div className="space-y-3">
                <input
                  autoFocus
                  type="text"
                  maxLength={20}
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value)
                    setNameError("")
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-orange-500/50 text-white text-sm outline-none text-center"
                />
                {nameError && (
                  <p className="text-red-400 text-xs">{nameError}</p>
                )}
                <button
                  onClick={handleNameSubmit}
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-colors disabled:opacity-60"
                >
                  {submitting ? "Saving..." : "Save Score"}
                </button>
                <button
                  onClick={() => setShowNamePrompt(false)}
                  className="w-full py-2 text-white/30 hover:text-white text-xs transition-colors"
                >
                  Skip
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Leaderboard Modal ── */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-900 border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-orange-500" />
                  <h3 className="text-xl font-bold text-white">Leaderboard</h3>
                </div>
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="text-white/40 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
                {loadingBoard ? (
                  <div className="text-center py-8 text-white/30 text-sm">
                    Loading...
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div className="text-center py-8 text-white/30 text-sm">
                    No scores yet. Be the first!
                  </div>
                ) : (
                  leaderboard.map((entry, i) => {
                    const isMe = entry.playerId === currentPlayerId
                    const medals = ["🥇", "🥈", "🥉"]
                    return (
                      <div
                        key={entry.playerId}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                          isMe
                            ? "bg-orange-600/10 border-orange-500/30"
                            : "bg-white/[0.02] border-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg w-6 text-center">
                            {i < 3 ? medals[i] : `${i + 1}.`}
                          </span>
                          <span
                            className={`font-semibold text-sm ${isMe ? "text-orange-400" : "text-white"}`}
                          >
                            {entry.name}
                            {isMe && (
                              <span className="ml-2 text-[10px] text-orange-500/70 font-normal">
                                (you)
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-white font-bold text-sm">
                            {entry.bestMoves}
                          </span>
                          <span className="text-white/30 text-xs">moves</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {myRank && myRank > 10 && (
                <div className="px-6 pb-4 text-center text-white/30 text-xs">
                  Your rank: #{myRank}
                </div>
              )}

              <div className="p-6 border-t border-white/5">
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="w-full py-2.5 bg-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/15 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}