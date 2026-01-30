"use client"

interface ProgressTimelineProps {
  total: number
  segmentStates?: number[]
  accentColor?: string
}

export function ProgressTimeline({
  total,
  segmentStates = [],
  accentColor = "#2B7BFF",
}: ProgressTimelineProps) {
  if (total <= 0) return null

  return (
    <div className="flex gap-2 pt-2">
      {Array.from({ length: total }).map((_, idx) => {
        const fillAmount = segmentStates[idx] ?? 0
        return (
          <div
            key={idx}
            className="h-1 rounded-full bg-white/20 overflow-hidden flex-1"
          >
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${fillAmount * 100}%`,
                backgroundColor: accentColor,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}