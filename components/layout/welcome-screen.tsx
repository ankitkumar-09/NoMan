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
                    // Wait 2.5 seconds after typing finishes, then exit
                    setTimeout(() => setIsExiting(true), 2500)
                    return prev
                }
                return prev + 1
            })
        }, 60)
        return () => clearInterval(interval)
    }, [])

    // Trigger removal from DOM after fade-out animation ends
    useEffect(() => {
        if (isExiting) {
            const timer = setTimeout(onComplete, 800) // matches duration-800
            return () => clearTimeout(timer)
        }
    }, [isExiting, onComplete])

    return (
        <div
            className={cn(
                "fixed inset-0 z-[100] flex items-center justify-center bg-black transition-all duration-800 ease-in-out",
                isExiting ? "opacity-0 scale-110 blur-xl pointer-events-none" : "opacity-100"
            )}
        >
            {/* Cinematic Background Detail */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 pointer-events-none" />
            
            <div className="relative flex flex-col items-center">
                <h1 className="text-white font-light tracking-[0.4em] text-sm md:text-xl uppercase transition-all">
                    {TEXT.slice(0, displayWeight)}
                    <span className={cn(
                        "inline-block w-[2px] h-4 md:h-6 bg-red-600 ml-1 align-middle",
                        displayWeight < TEXT.length ? "animate-pulse" : "hidden"
                    )} />
                </h1>
                
                {/* Subtle underline decoration */}
                <div className={cn(
                    "h-[1px] bg-linear-to-r from-transparent via-white/40 to-transparent transition-all duration-1000 mt-4",
                    displayWeight >= TEXT.length ? "w-64 opacity-100" : "w-0 opacity-0"
                )} />
            </div>
        </div>
    )
}