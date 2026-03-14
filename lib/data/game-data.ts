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
}

export const GAMES_DATA: Record<string, Game> = {
  FlappyAR: {
    id: "FlappyAR",
    title: "FlappyAR",
    image: "/images/flappyAR/3.png",
    subtitle: "FlappyAR",
    developer: "NoMan Production",
    platform: "Android, PC, PS5",
    releaseDate: "March 15, 2026",
    rating: "Everyone",
    description: "Arcade flying game with Normal and AR modes",
    youtube: "https://youtube.com/@zerohourcity",
    linkedin: "https://twitter.com/zerohourcity",
    instagram: "https://instagram.com/zerohourcity",
    gameDescription: `FlappyAR is an exciting arcade flying game that combines classic flappy-style gameplay with modern Augmented Reality.

Play in Normal Mode for the traditional endless flappy challenge, where you guide your character through obstacles and try to beat your highest score. Switch to AR Mode to bring the game into the real world using augmented reality and experience the gameplay in your environment.

With simple controls, fast-paced gameplay, and immersive AR features, FlappyAR offers a fresh twist on the classic flappy experience.`,
    screenshots: [
      "/images/flappyAR/4.png",
      "/images/flappyAR/5.png",
      "/images/flappyAR/6.png",
      "/images/flappyAR/7.png"
    ],
  },
  
  BurnPoint: {
    id: "BurnPoint",
    title: "Burn Point",
    image: "/images/news2.png",
    logo: "/images/burn-point-logo.png",
    subtitle: "BURN POINT",
    developer: "NoMan Production",
    platform: "Android, PC, Xbox",
    releaseDate: "February 1, 2026",
    rating: "Blood, Intense Violence, Mature",
    description: "Own the Drift - High-speed racing adventure",
    youtube: 'https://youtube.com/@burnpoint',
    linkedin: 'https://www.linkedin.com/company/nomanprod/',
    instagram: 'https://instagram.com/burnpoint',
    gameDescription: `Burnout is a high-speed racing game that puts players in a world where speed, risk, and destruction define success. Set on busy city roads and highways, players compete in intense races while avoiding traffic and taking down rival drivers. With explosive crashes, boost mechanics, and fast-paced gameplay, Burnout rewards bold driving and quick reflexes.`,
    screenshots: ["/images/news2.png", "/images/news3.png", "/images/news1.png", "/images/news2.png"],
  },
  
  SkyRaiders: {
    id: "SkyRaiders",
    title: "Sky Raiders",
    image: "/images/news3.png",
    logo: "/images/burn-point-logo.png",
    subtitle: "SKY RAIDERS",
    developer: "NoMan Production",
    platform: "Android, PC, Nintendo Switch",
    releaseDate: "April 22, 2026",
    rating: "Action, Adventure, Mild Violence",
    description: "Aerial combat action adventure",
    youtube: 'https://youtube.com/@skyraiders',
    linkedin: 'https://twitter.com/skyraiders',
    instagram: 'https://instagram.com/skyraiders',
    gameDescription: `Sky Raiders takes you to breathtaking heights where aerial combat reigns supreme. Pilot advanced aircraft through stunning environments, engage in explosive dogfights, and uncover mysteries hidden in the clouds.`,
    screenshots: ["/images/news3.png", "/images/news1.png", "/images/news2.png", "/images/news3.png"],
  }
};