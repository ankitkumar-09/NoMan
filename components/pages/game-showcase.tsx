import { GameThumbnail } from "@/components/pages/game-thumbnail"

const GAMES = [
	{ title: "Game 1", image: "/images/games/action-game-cover-1.jpg" },
	{ title: "Game 2", image: "/images/games/racing-game-cover.png" },
	{ title: "Game 3", image: "/images/games/fps-game-cover.jpg" },
	{ title: "Game 4", image: "/images/games/adventure-game-cover.jpg" },
	{ title: "Game 5", image: "/images/games/rpg-game-cover.png" },
	{ title: "Game 6", image: "/images/games/strategy-game-cover.jpg" },
	{ title: "Game 7", image: "/images/games/sports-game-cover.jpg" },
	{ title: "Game 8", image: "/images/games/sports-game-cover.jpg" },
]

export function GameShowcase() {
	const collage = [...GAMES, ...GAMES, ...GAMES]

	return (
		<section className="py-8 px-4 overflow-visible">
			<div className="container mx-auto max-w-6xl overflow-visible">
				<div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6">
					{/* Headline */}
					<h2
						className="
              text-white font-extrabold tracking-tight leading-[1.08]
              text-[20px] xs:text-[22px] sm:text-[32px] md:text-[48px] lg:text-[72px]
              flex-1 min-w-0
              pr-2
            "
					>
						Committed to
						<br />
						Entertainment.
					</h2>

					{/* Game Collage */}
					<div className="shrink-0">
						<div className="flex flex-col items-end gap-1.5 xs:gap-2 sm:gap-3 md:gap-4">
							{/* Row 1 */}
							<div className="flex justify-end gap-1.5 xs:gap-2 sm:gap-3 md:gap-4">
								{collage.slice(0, 4).map((g, i) => (
									<GameThumbnail
										key={`r1-${i}`}
										image={g.image}
										title={g.title}
										className="
                      w-[26px] h-[26px]
                      xs:w-[30px] xs:h-[30px]
                      sm:w-[44px] sm:h-[44px]
                      md:w-[74px] md:h-[74px]
                      rounded-[8px] sm:rounded-[12px] md:rounded-[18px]
                      overflow-hidden
                    "
									/>
								))}
							</div>

							{/* Row 2 */}
							<div className="flex justify-end gap-1.5 xs:gap-2 sm:gap-3 md:gap-4">
								{collage.slice(4, 10).map((g, i) => (
									<GameThumbnail
										key={`r2-${i}`}
										image={g.image}
										title={g.title}
										className="
                      w-[26px] h-[26px]
                      xs:w-[30px] xs:h-[30px]
                      sm:w-[44px] sm:h-[44px]
                      md:w-[74px] md:h-[74px]
                      rounded-[8px] sm:rounded-[12px] md:rounded-[18px]
                      overflow-hidden
                    "
									/>
								))}
							</div>

							{/* Row 3 */}
							<div className="flex justify-end gap-1.5 xs:gap-2 sm:gap-3 md:gap-4">
								{collage.slice(10, 14).map((g, i) => (
									<GameThumbnail
										key={`r3-${i}`}
										image={g.image}
										title={g.title}
										className="
                      w-[26px] h-[26px]
                      xs:w-[30px] xs:h-[30px]
                      sm:w-[44px] sm:h-[44px]
                      md:w-[74px] md:h-[74px]
                      rounded-[8px] sm:rounded-[12px] md:rounded-[18px]
                      overflow-hidden
                    "
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
  