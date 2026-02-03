'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function HomePageContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const section = searchParams.get('section')

  useEffect(() => {
    if (section) {
      setTimeout(() => {
        const element = document.querySelector(`[data-section="${section}"]`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 500)
    }
  }, [section])

  return <>{children}</>
}