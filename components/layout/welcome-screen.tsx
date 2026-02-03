"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils/utils"

const TEXT = "WELCOME TO NOMAN STUDIOS®"

export function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
    const [displayWeight, setDisplayWeight] = useState(0)
    const [isExiting, setIsExiting] = useState(false)

    // Typewriter effect
    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayWeight((prev) => {
                if (prev >= TEXT.length) {
                    clearInterval(interval)
                    setTimeout(() => setIsExiting(true), 2500)
                    return prev
                }
                return prev + 1
            })
        }, 60)

        return () => clearInterval(interval)
    }, [])

    // Trigger removal after exit animation
    useEffect(() => {
        if (isExiting) {
            const timer = setTimeout(onComplete, 800)
            return () => clearTimeout(timer)
        }
    }, [isExiting, onComplete])

    return (
        <div
            className={cn(
                "fixed inset-0 z-[100] flex items-center justify-center bg-black transition-all duration-800 ease-in-out",
                isExiting
                    ? "opacity-0 scale-110 blur-xl pointer-events-none"
                    : "opacity-100"
            )}
        >
            {/* Film Grain */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 pointer-events-none" />

            <div className="relative flex flex-col items-center px-4">
                <h1 className="max-w-[92vw] text-center text-white font-light uppercase transition-all">
                    
                    {/* FIRST LINE */}
                    <span className="block md:inline tracking-[0.25em] md:tracking-[0.4em] text-xs sm:text-sm md:text-xl">
                        {TEXT.slice(0, Math.min(displayWeight, 10))}
                    </span>

                    {/* Line break ONLY on mobile */}
                    <span className="block md:hidden h-1" />

                    {/* SECOND LINE */}
                    <span className="block md:inline tracking-[0.25em] md:tracking-[0.4em] text-xs sm:text-sm md:text-xl">
                        {TEXT.slice(10, displayWeight)}

                        {/* Cursor */}
                        <span
                            className={cn(
                                "inline-block w-[2px] h-3 md:h-6 bg-red-600 ml-1 align-middle",
                                displayWeight < TEXT.length ? "animate-pulse" : "hidden"
                            )}
                        />
                    </span>
                </h1>

                {/* Underline */}
                <div
                    className={cn(
                        "h-[1px] bg-linear-to-r from-transparent via-white/40 to-transparent transition-all duration-1000 mt-4",
                        displayWeight >= TEXT.length ? "w-64 opacity-100" : "w-0 opacity-0"
                    )}
                />
            </div>
        </div>
    )
}
