// lib/game-data.ts

export interface Game {
  id: string
  title: string
  image: string
  logo?: string
  subtitle: string
  developer: string
  platform: string
  releaseDate: string
  rating: string
  description: string
  gameDescription: string
  screenshots: string[]
  youtube: string
  linkedin: string
  instagram: string
  status: string
}

export const GAMES_DATA: Record<string, Game> = {
  FlappyAR: {
    id: "FlappyAR",
    title: "FlappyAR",
    image: "/images/flappyAR/3.png",
    subtitle: "FlappyAR",
    developer: "NoMan Production",
    platform: "Android",
    releaseDate: "March 23, 2026",
    rating: "Everyone",
    status: "released",
    description: "Arcade flying game with Normal and AR modes",
    youtube: "https://www.youtube.com/channel/UCQWzNg1ToM8umNt0YUaIVhw",
    linkedin: "https://www.linkedin.com/company/nomanprod/",
    instagram: "https://www.instagram.com/noman__.games/",
    gameDescription: `FlappyAR is an exciting arcade flying game that combines classic flappy-style gameplay with modern Augmented Reality.

Play in Normal Mode for the traditional endless flappy challenge, where you guide your character through obstacles and try to beat your highest score. Switch to AR Mode to bring the game into the real world using augmented reality and experience the gameplay in your environment.

With simple controls, fast-paced gameplay, and immersive AR features, FlappyAR offers a fresh twist on the classic flappy experience.`,
    screenshots: [
      "/images/flappyAR/4.png",
      "/images/flappyAR/5.png",
      "/images/flappyAR/6.png",
      "/images/flappyAR/7.png",
    ],
  },

  "2048Quest": {
    id: "2048Quest",
    title: "2048Quest",
    image: "/images/2048/1.png",
    subtitle: "Merge to the Top",
    developer: "NoMan Production",
    platform: "Android",
    status: "upcoming",
    releaseDate: "March 16, 2026",
    rating: "Everyone",
    description: "Classic 2048 puzzle game with a fresh twist and new game modes.",
    youtube: "https://www.youtube.com/channel/UCQWzNg1ToM8umNt0YUaIVhw",
    linkedin: "https://www.linkedin.com/company/nomanprod/",
    instagram: "https://www.instagram.com/noman__.games/",
    gameDescription: `2048 Quest is a fresh take on the classic 2048 puzzle game. Swipe to merge tiles, reach the 2048 tile, and beyond.

Challenge yourself with new game modes, unlock achievements, and compete on global leaderboards. Simple to learn, impossible to put down.

With smooth animations, clean design, and addictive gameplay, 2048 Quest is the ultimate puzzle experience for casual and hardcore players alike.`,
    screenshots: [
      "/images/racing/5.png",
      "/images/racing/12.png",
      "/images/racing/11.png",
      "/images/racing/9.png",
    ],
  },

  BurnPoint: {
    id: "BurnPoint",
    title: "Burn Point",
    image: "/images/racing/21.png",
    subtitle: "Own the Drift",
    developer: "NoMan Production",
    platform: "Android",
    status: "upcoming",
    releaseDate: "April 25, 2026",
    rating: "Everyone 10+ | Mild Violence, In-Game Purchases",
    description: "High-speed arcade racing with intense drift mechanics and competitive street races.",
    youtube: "https://www.youtube.com/channel/UCQWzNg1ToM8umNt0YUaIVhw",
    linkedin: "https://www.linkedin.com/company/nomanprod/",
    instagram: "https://www.instagram.com/noman__.games/",
    gameDescription: `Burn Point is an adrenaline-fueled arcade racing experience built for players who live for speed, precision, and the thrill of drifting at the edge of control. Set across vibrant city streets, neon-lit highways, and challenging mountain roads, the game places you behind the wheel of powerful racing machines where every corner, every drift, and every boost can determine victory or defeat.

Players must master the art of high-speed drifting while navigating through intense street racing environments filled with sharp turns, dynamic traffic, and competitive rivals. Perfect timing, smooth control, and strategic use of boosts are essential to maintain momentum and dominate the race track. The more precise your driving, the higher your score and the faster you climb the leaderboards.

Burn Point features a variety of unique racing locations designed to test your driving skills. From crowded urban roads to open highways and dangerous mountain curves, each track offers a new challenge that requires quick reflexes and expert handling. Players can push their cars to the absolute limit, chaining together long drift combos and executing perfect racing lines to maintain top speed.

Customization and progression are at the core of the experience. Players can unlock new vehicles, upgrade performance components, and personalize their cars to match their racing style. Whether you prefer aggressive high-speed racing or smooth technical drifting, Burn Point allows you to build the perfect machine for the challenge ahead.

With responsive controls, immersive environments, and fast-paced gameplay, Burn Point delivers a thrilling racing adventure designed for both casual players and hardcore racing enthusiasts. Every race is a test of skill, every drift is an opportunity to push further, and every finish line is just the beginning of the next challenge.

Start your engine, hit the throttle, and prove that you have what it takes to own the drift and reach the Burn Point.`,
    screenshots: [
      "/images/racing/5.png",
      "/images/racing/12.png",
      "/images/racing/11.png",
      "/images/racing/9.png",
    ],
  },
}