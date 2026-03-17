import Image from "next/image"
import { cn } from "@/lib/utils/utils"

interface GameThumbnailProps {
  image: string
  title: string
  className?: string
}

export function GameThumbnail({ image, title, className }: GameThumbnailProps) {
  return (
    <div className={cn("relative w-24 h-32 rounded-lg overflow-hidden shrink-0 group cursor-pointer", className)}>
      <Image
        src={image || "/placeholder.svg"}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
    </div>
  )
}
     