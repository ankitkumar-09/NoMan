"use client"

import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils/utils"

const TEXT = "WELCOME TO NOMAN STUDIOS®"
const AUTO_RETURN_MS = 5000

function useTypewriter(text: string, active: boolean, speed = 45) {
    const [value, setValue] = useState("")

    useEffect(() => {
        if (!active) {
            setValue("")
            return
        }

        let i = 0
        const id = setInterval(() => {
            i++
            setValue(text.slice(0, i))
            if (i >= text.length) clearInterval(id)
        }, speed)

        return () => clearInterval(id)
    }, [text, active, speed])

    return value
}

export function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [showTypewriter, setShowTypewriter] = useState(true)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    useEffect(() => {
        if (!showTypewriter) return
        const timer = setTimeout(() => setShowTypewriter(false), AUTO_RETURN_MS)
        return () => clearTimeout(timer)
    }, [showTypewriter])

    const typed = useTypewriter(TEXT, showTypewriter, 45)

    const handleScrollToSection = (sectionId: string) => {
        setMenuOpen(false)
        if (typeof window !== 'undefined') {
            const element = document.querySelector(`[data-section="${sectionId}"]`)
            
            if (element) {
                // Section exists on current page, scroll to it
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }, 200)
            } else {
                // Section doesn't exist, redirect to home and scroll after page loads
                window.location.href = `/?section=${sectionId}`
            }
        }
    }

    const handleContactClick = () => {
        setMenuOpen(false)
        if (typeof window !== 'undefined') {
            window.location.href = "mailto:contact@nomans.com"
        }
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full pt-4 px-4">
            <div className="relative h-[44px] max-w-6xl mx-auto">
                
                {/* 1. Typewriter View */}
                <div
                    className={cn(
                        "absolute inset-0 rounded-full overflow-hidden isolate flex items-center justify-center transition-all duration-700",
                        "bg-black/40 backdrop-blur-md ring-1 ring-white/10",
                        "before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-linear-to-b before:from-white/10 before:to-transparent before:pointer-events-none",
                        showTypewriter ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
                    )}
                >
                    <span className="relative z-10 text-white tracking-[0.3em] text-[10px] sm:text-[12px] font-medium px-4 text-center">
                        {typed}
                        {typed.length < TEXT.length && (
                            <span className="ml-1 animate-pulse text-red-600">|</span>
                        )}
                    </span>
                </div>

                {/* 2. Brand View */}
                <div
                    className={cn(
                        "absolute inset-0 rounded-full overflow-hidden isolate transition-all duration-700",
                        "before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-linear-to-b before:from-white/10 before:to-transparent before:pointer-events-none",
                        scrolled
                            ? "bg-black/60 backdrop-blur-lg ring-1 ring-white/20 shadow-lg shadow-black/40"
                            : "bg-black/20 backdrop-blur-md ring-1 ring-white/10",
                        !showTypewriter ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
                    )}
                >
                    <div className="relative px-5 h-full flex items-center justify-center">
                        
                        <span className="text-white font-bold tracking-[0.25em] text-[11px] sm:text-xs select-none uppercase">
                            NOMAN <span className="text-red-600">STUDIOS</span>
                        </span>

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="absolute right-4 p-1 cursor-pointer text-white/80 hover:text-white transition-colors"
                            aria-label="Toggle menu"
                            type="button"
                        >
                            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown - Positioned near button */}
                {menuOpen && (
                    <div className="absolute top-16 right-0 w-56 bg-black/95 backdrop-blur-2xl rounded-xl border border-white/10 p-3 animate-in fade-in zoom-in-95 duration-200 shadow-2xl z-50">
                        <div className="space-y-2 text-white/80 text-sm font-medium tracking-wide">
                            <a 
                                href="/games" 
                                className="block px-4 py-2.5 hover:bg-red-600/20 hover:text-red-500 rounded-lg transition-colors duration-200 cursor-pointer"
                                onClick={(e) => {
                                    setMenuOpen(false)
                                }}
                            >
                                GAMES
                            </a>
                            <button
                                onClick={() => handleScrollToSection('news')}
                                className="w-full text-left px-4 py-2.5 hover:bg-red-600/20 hover:text-red-500 rounded-lg transition-colors duration-200"
                            >
                                NEWS
                            </button>
                            <button
                                onClick={() => handleScrollToSection('footer')}
                                className="w-full text-left px-4 py-2.5 hover:bg-red-600/20 hover:text-red-500 rounded-lg transition-colors duration-200"
                            >
                                ABOUT
                            </button>
                            <button
                                onClick={handleContactClick}
                                className="w-full text-left px-4 py-2.5 hover:bg-red-600/20 hover:text-red-500 rounded-lg transition-colors duration-200"
                            >
                                CONTACT
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}