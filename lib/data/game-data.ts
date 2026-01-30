// lib/game-data.ts

export interface Game {
  id: string
  title: string
  image: string
  logo: string
  subtitle: string
  developer: string
  platform: string
  releaseDate: string
  rating: string
  description: string
  gameDescription: string
  screenshots: string[]
}

export const GAMES_DATA: Record<string, Game> = {
  g1: {
    id: "g1",
    title: "Zero Hour City",
    image: "/images/news1.png",
    logo: "/images/burn-point-logo.png",
    subtitle: "ZERO HOUR CITY",
    developer: "NoMan Production",
    platform: "Android, PC, PS5",
    releaseDate: "March 15, 2026",
    rating: "Blood, Violence, Mature",
    description: "Urban tactical shooter action",
    gameDescription: `Zero Hour City is an intense tactical shooter set in a sprawling metropolis where every decision matters. Navigate dynamic environments, engage in strategic combat, and uncover the city's darkest secrets.

Experience cutting-edge gameplay mechanics that blend realism with intense action. From rooftop pursuits to underground operations, every mission pushes you to the brink. Use advanced tactics, environmental awareness, and precision timing to complete objectives and survive encounters with ruthless opponents.

The city never sleeps, and neither do the threats. Face dynamic AI that adapts to your strategies, requiring constant innovation and quick thinking. Team up with allies or go solo—either way, success demands skill, courage, and tactical brilliance.`,
    screenshots: [
      "/images/news1.png",
      "/images/news2.png",
      "/images/news3.png",
      "/images/news1.png",
    ],
  },
  
  g2: {
    id: "g2",
    title: "Burn Point",
    image: "/images/news2.png",
    logo: "/images/burn-point-logo.png",
    subtitle: "BURN POINT",
    developer: "NoMan Production",
    platform: "Android, PC, Xbox",
    releaseDate: "February 1, 2026",
    rating: "Blood, Intense Violence, Mature",
    description: "Own the Drift - High-speed racing adventure",
    gameDescription: `Burnout is a high-speed racing game that puts players in a world where speed, risk, and destruction define success. Set on busy city roads and highways, players compete in intense races while avoiding traffic and taking down rival drivers. With explosive crashes, boost mechanics, and fast-paced gameplay, Burnout rewards bold driving and quick reflexes.

Using realistic crash physics and dynamic environments, the game delivers an exciting arcade racing experience where only the fastest and bravest racers reach the top. Set in a high-speed world where adrenaline rules and hesitation means defeat, Burnout throws players into the heart of underground street racing.

In cities built for speed and highways made for chaos, racers battle not just for victory—but for dominance. Traffic becomes your greatest obstacle, rival drivers your fiercest enemies, and every second counts in the fight to stay ahead.

With spectacular crashes, intense takedowns, and pulse-pounding races, Burnout transforms reckless driving into an art form. Master dangerous shortcuts, smash through opponents, and unleash devastating crashes to earn boosts and rewards. Every race is a test of skill, reflex, and nerve, where only the bold survive.

Powered by dynamic physics and cinematic crash technology, Burnout delivers an unmatched arcade racing experience.`,
    screenshots: [
      "/images/news2.png",
      "/images/news3.png",
      "/images/news1.png",
      "/images/news2.png",
    ],
  },
  
  g3: {
    id: "g3",
    title: "Sky Raiders",
    image: "/images/news3.png",
    logo: "/images/burn-point-logo.png",
    subtitle: "SKY RAIDERS",
    developer: "NoMan Production",
    platform: "Android, PC, Nintendo Switch",
    releaseDate: "April 22, 2026",
    rating: "Action, Adventure, Mild Violence",
    description: "Aerial combat action adventure",
    gameDescription: `Sky Raiders takes you to breathtaking heights where aerial combat reigns supreme. Pilot advanced aircraft through stunning environments, engage in explosive dogfights, and uncover mysteries hidden in the clouds.

Feel the rush of high-speed aerial maneuvers as you navigate treacherous skies filled with enemy patrols and environmental hazards. Upgrade your aircraft with cutting-edge technology, unlock special abilities, and master combat techniques that separate the legendary pilots from the rest.

Fight against invading forces threatening to control the skies. Complete challenging missions across diverse environments—from tropical islands to snowy peaks to urban landscapes. Each location presents unique tactical challenges that demand precision flying and combat expertise.

Experience the thrill of being a sky warrior. Engage in thrilling multiplayer dogfights, compete in aerial races, and prove your skills in challenges that push even veteran pilots to their limits. The skies are calling—answer with courage and skill.`,
    screenshots: [
      "/images/news3.png",
      "/images/news1.png",
      "/images/news2.png",
      "/images/news3.png",
    ],
  },
  
  g4: {
    id: "g4",
    title: "Action Game 1",
    image: "/images/news1.png",
    logo: "/images/burn-point-logo.png",
    subtitle: "ACTION GAME 1",
    developer: "NoMan Production",
    platform: "PC, Xbox, PlayStation",
    releaseDate: "May 10, 2026",
    rating: "Violence, Intense Action",
    description: "Epic action adventure awaits",
    gameDescription: `Join an epic journey where your choices shape the destiny of kingdoms. Battle fierce enemies, solve ancient puzzles, and uncover the truth behind a forgotten civilization.

Experience a rich narrative filled with compelling characters and morally complex decisions. Every action has consequences—choose wisely as you navigate through a world on the brink of collapse.

Master an array of combat techniques, combine powerful abilities, and develop your own fighting style. Face challenging boss battles that test your skills, strategy, and determination to overcome seemingly impossible odds.

Explore vast open worlds filled with secrets, hidden dungeons, and mysterious artifacts. Discover the lore of forgotten civilizations and piece together the history of your world as you progress through an unforgettable adventure.`,
    screenshots: [
      "/images/news1.png",
      "/images/news2.png",
      "/images/news3.png",
      "/images/news1.png",
    ],
  },

  g5: {
    id: "g5",
    title: "Action Game 2",
    image: "/images/news2.png",
    logo: "/images/burn-point-logo.png",
    subtitle: "ACTION GAME 2",
    developer: "NoMan Production",
    platform: "Android, PC, Xbox",
    releaseDate: "June 5, 2026",
    rating: "Action, Adventure",
    description: "Intense action-packed gameplay",
    gameDescription: `Prepare for non-stop action as you battle through waves of enemies in this adrenaline-pumping adventure. Use tactical abilities, powerful weapons, and explosive combinations to defeat your foes.

Test your skills in multiple game modes including campaign, survival, and competitive multiplayer. Climb leaderboards, unlock exclusive rewards, and prove you're the ultimate warrior.`,
    screenshots: [
      "/images/news2.png",
      "/images/news3.png",
      "/images/news1.png",
      "/images/news2.png",
    ],
  },

  g6: {
    id: "g6",
    title: "Action Game 3",
    image: "/images/news3.png",
    logo: "/images/burn-point-logo.png",
    subtitle: "ACTION GAME 3",
    developer: "NoMan Production",
    platform: "PC, PlayStation, Xbox",
    releaseDate: "July 12, 2026",
    rating: "Violence, Intense Action",
    description: "Ultimate combat experience",
    gameDescription: `Experience the pinnacle of action gaming with next-generation graphics and physics. Engage in brutal combat against intelligent enemies that adapt to your tactics.

Customize your character with hundreds of equipment combinations, unlock special abilities, and create your own fighting style. Progress through an engaging story mode and test yourself against other players worldwide.`,
    screenshots: [
      "/images/news3.png",
      "/images/news1.png",
      "/images/news2.png",
      "/images/news3.png",
    ],
  },

  g7: {
    id: "g7",
    title: "Action Game 4",
    image: "/images/news1.png",
    logo: "/images/burn-point-logo.png",
    subtitle: "ACTION GAME 4",
    developer: "NoMan Production",
    platform: "Android, PC, Switch",
    releaseDate: "August 20, 2026",
    rating: "Action, Adventure",
    description: "Thrilling action adventure",
    gameDescription: `Embark on an unforgettable journey through stunning worlds filled with mystery and danger. Solve intricate puzzles, defeat powerful enemies, and uncover secrets that change the course of history.

With immersive storytelling and engaging gameplay mechanics, this action adventure combines the best of exploration, combat, and problem-solving. Every moment brings new challenges and opportunities for discovery.`,
    screenshots: [
      "/images/news1.png",
      "/images/news2.png",
      "/images/news3.png",
      "/images/news1.png",
    ],
  },

  g8: {
    id: "g8",
    title: "Action Game 5",
    image: "/images/news2.png",
    logo: "/images/burn-point-logo.png",
    subtitle: "ACTION GAME 5",
    developer: "NoMan Production",
    platform: "PC, Xbox, PlayStation",
    releaseDate: "September 8, 2026",
    rating: "Violence, Action",
    description: "Fast-paced action gameplay",
    gameDescription: `Rush into battle with lightning-fast reflexes and powerful attacks. Compete against players worldwide in this fast-paced action game that rewards skill and strategy.

Master multiple weapons, learn devastating combos, and dominate competitive matches. Customize your loadout, unlock rare cosmetics, and rise through the ranks to become a legend.`,
    screenshots: [
      "/images/news2.png",
      "/images/news3.png",
      "/images/news1.png",
      "/images/news2.png",
    ],
  },

  g9: {
    id: "g9",
    title: "Action Game 6",
    image: "/images/news3.png",
    logo: "/images/burn-point-logo.png",
    subtitle: "ACTION GAME 6",
    developer: "NoMan Production",
    platform: "Android, PC, Xbox",
    releaseDate: "October 15, 2026",
    rating: "Action, Violence",
    description: "Epic battle scenarios",
    gameDescription: `Engage in massive battles where every decision matters. Lead armies, execute tactical strategies, and overcome impossible odds in this action-packed warfare simulator.

Experience dynamic AI that learns from your tactics and adapts accordingly. Discover hidden mechanics, unlock powerful abilities, and become a master strategist in this challenging action game.`,
    screenshots: [
      "/images/news3.png",
      "/images/news1.png",
      "/images/news2.png",
      "/images/news3.png",
    ],
  },

  g10: {
    id: "g10",
    title: "Action Cover",
    image: "/images/news1.png",
    logo: "/images/burn-point-logo.png",
    subtitle: "ACTION COVER",
    developer: "NoMan Production",
    platform: "PC, PlayStation, Xbox",
    releaseDate: "November 22, 2026",
    rating: "Action, Adventure",
    description: "Cover-based tactical action",
    gameDescription: `Master tactical cover-based combat in this strategic action game. Use environmental objects strategically, outflank enemies, and execute perfect takedowns to succeed in intense firefights.

Complete challenging single-player missions and test your skills in competitive multiplayer modes. Unlock weapons, abilities, and cosmetics as you climb the ranks and establish yourself as the ultimate tactical operative.`,
    screenshots: [
      "/images/news1.png",
      "/images/news2.png",
      "/images/news3.png",
      "/images/news1.png",
    ],
  },
}

// Helper function to get a single game by ID
export function getGameById(id: string): Game | undefined {
  return GAMES_DATA[id]
}

// Helper function to get all games
export function getAllGames(): Game[] {
  return Object.values(GAMES_DATA)
}

// Helper function to search games by title
export function searchGames(query: string): Game[] {
  const lowerQuery = query.toLowerCase()
  return Object.values(GAMES_DATA).filter(
    game => 
      game.title.toLowerCase().includes(lowerQuery) ||
      game.description.toLowerCase().includes(lowerQuery)
  )
}