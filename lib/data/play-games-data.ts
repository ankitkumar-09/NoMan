export interface PlayGame {
  slug: string
  title: string
  description: string
  category: "arcade" | "racing" | "puzzle" | "strategy"
  color: string
  icon: string
  controls: string
}

export const PLAY_GAMES: PlayGame[] = [
  {
    slug: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "Classic X vs O — outsmart the AI in this timeless strategy game.",
    category: "puzzle",
    color: "#8B5CF6",
    icon: "⭕",
    controls: "Click cells to place your mark",
  },
  {
    slug: "snake",
    title: "Snake",
    description: "Guide the snake, eat the food, grow longer. Don't hit the walls!",
    category: "arcade",
    color: "#10B981",
    icon: "🐍",
    controls: "Arrow Keys or WASD to move",
  },
  {
    slug: "flappy-bird",
    title: "Flappy Bird",
    description: "Tap to flap through the pipes. How far can you fly?",
    category: "arcade",
    color: "#F59E0B",
    icon: "🐦",
    controls: "Space or Click to flap",
  },
  {
    slug: "chess",
    title: "Chess",
    description: "The king of strategy games. Challenge the AI on the 8×8 board.",
    category: "strategy",
    color: "#EF4444",
    icon: "♟️",
    controls: "Click piece to select, click destination to move",
  },
  {
    slug: "car-racing",
    title: "Car Racing",
    description: "Dodge traffic at breakneck speed on the open highway.",
    category: "racing",
    color: "#3B82F6",
    icon: "🏎️",
    controls: "Left / Right Arrow to switch lanes",
  },
  {
    slug: "bike-racing",
    title: "Bike Racing",
    description: "Race through the terrain, jump obstacles, survive as long as you can.",
    category: "racing",
    color: "#EC4899",
    icon: "🏍️",
    controls: "Space or Up Arrow to jump",
  },
  {
    slug: "memory-match",
    title: "Memory Match",
    description: "Flip cards, find pairs. Test your memory and beat the clock!",
    category: "puzzle",
    color: "#06B6D4",
    icon: "🃏",
    controls: "Click cards to flip and match pairs",
  },
  {
    slug: "pong",
    title: "Pong",
    description: "The original arcade classic. Defend your side against the AI paddle.",
    category: "arcade",
    color: "#F97316",
    icon: "🏓",
    controls: "Up / Down Arrow or W / S to move paddle",
  },
]

export const CATEGORIES = [
  { key: "all", label: "All Games" },
  { key: "arcade", label: "Arcade" },
  { key: "racing", label: "Racing" },
  { key: "puzzle", label: "Puzzle" },
  { key: "strategy", label: "Strategy" },
] as const
