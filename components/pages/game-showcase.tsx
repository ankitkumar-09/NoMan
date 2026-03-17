"use client"

import Image from "next/image"

interface GameThumbnailProps {
  image: string
  title: string
  className?: string
}

function GameThumbnail({ image, title, className = "" }: GameThumbnailProps) {
  return (
    <div className={`relative bg-black overflow-hidden ${className}`}>
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover hover:scale-110 transition-transform duration-300"
        draggable={false}
      />
    </div>
  )
}

const GAMES = [
  { title: "Game 1", image: "/images/racing/3.png" },
  { title: "Game 2", image: "/images/racing/6.png" },
  { title: "Game 3", image: "/images/racing/10.png" },
  { title: "Game 4", image: "/images/teacher/1.png" },
  { title: "Game 5", image: "/images/racing/3.png" },
  { title: "Game 6", image: "/images/racing/7.png" },
  { title: "Game 7", image: "/images/racing/11.png"},
  { title: "Game 8", image: "/images/racing/10.png" },
]

export function GameShowcase() {
  const collage = [...GAMES, ...GAMES, ...GAMES]

  return (
    <section className="py-8 px-3 sm:px-4 md:px-6 overflow-visible bg-black">
      <div className="mx-auto w-full max-w-6xl overflow-visible">
        <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6">
          <h2
            className="
              text-white font-extrabold tracking-tight leading-[1.08]
              text-lg xs:text-xl sm:text-3xl md:text-4xl lg:text-6xl
              flex-1 min-w-0
              pr-2
            "
          >
            Committed to
            <br />
            Entertainment.
          </h2>

          <div className="shrink-0">
            <div className="flex flex-col items-end gap-1.5 xs:gap-2 sm:gap-3 md:gap-4">
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