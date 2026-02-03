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
        const t = setTimeout(() => setShowTypewriter(false), AUTO_RETURN_MS)
        return () => clearTimeout(t)
    }, [showTypewriter])

    const typed = useTypewriter(TEXT, showTypewriter, 45)

    // ✅ RESTORED ORIGINAL SCROLL LOGIC
    const handleScrollToSection = (sectionId: string) => {
        setMenuOpen(false)

        const element = document.querySelector(
            `[data-section="${sectionId}"]`
        ) as HTMLElement | null

        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: "smooth", block: "start" })
            }, 200)
        } else {
            window.location.href = `/?section=${sectionId}`
        }
    }

    const handleContactClick = () => {
        setMenuOpen(false)
        window.location.href = "mailto:contact@nomans.com"
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-40 w-full pt-4 px-4">
            <div className="relative h-[48px] max-w-6xl mx-auto">

                {/* Background (visual only) */}
                <div
                    className={cn(
                        "absolute inset-0 rounded-full transition-all duration-700 pointer-events-none",
                        scrolled
                            ? "bg-black/60 backdrop-blur-xl ring-1 ring-white/20 shadow-lg shadow-black/40"
                            : "bg-black/30 backdrop-blur-md ring-1 ring-white/10"
                    )}
                />

                {/* Typewriter */}
                <div
                    className={cn(
                        "absolute inset-0 z-20 flex items-center justify-center transition-all duration-700 pointer-events-none",
                        showTypewriter
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95"
                    )}
                >
                    <span className="text-white tracking-[0.3em] text-[10px] sm:text-[12px] font-medium px-4 text-center">
                        {typed}
                        {typed.length < TEXT.length && (
                            <span className="ml-1 animate-pulse text-red-600">|</span>
                        )}
                    </span>
                </div>

                {/* Brand + Menu */}
                <div
                    className={cn(
                        "relative z-30 h-full px-5 flex items-center justify-center transition-all duration-700",
                        showTypewriter
                            ? "opacity-0 scale-95 pointer-events-none"
                            : "opacity-100 scale-100"
                    )}
                >
                    <span className="text-white font-bold tracking-[0.25em] text-[11px] sm:text-xs uppercase">
                        NOMAN <span className="text-red-600">STUDIOS</span>
                    </span>

                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        className="absolute right-4 p-1 text-white/80 hover:text-white transition-colors"
                        aria-label="Toggle menu"
                        type="button"
                    >
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Dropdown (✅ original behavior restored) */}
                {menuOpen && (
                    <div className="absolute top-16 right-0 w-56 bg-black/95 backdrop-blur-2xl rounded-xl border border-white/10 p-3 shadow-2xl z-50">
                        <div className="space-y-2 text-white/80 text-sm font-medium">
                            <a
                                href="/games"
                                onClick={() => setMenuOpen(false)}
                                className="block px-4 py-2.5 hover:bg-red-600/20 rounded-lg"
                            >
                                GAMES
                            </a>

                            <button
                                onClick={() => handleScrollToSection("news")}
                                className="w-full text-left px-4 py-2.5 hover:bg-red-600/20 rounded-lg"
                            >
                                NEWS
                            </button>

                            <button
                                onClick={() => handleScrollToSection("footer")}
                                className="w-full text-left px-4 py-2.5 hover:bg-red-600/20 rounded-lg"
                            >
                                ABOUT
                            </button>

                            <button
                                onClick={handleContactClick}
                                className="w-full text-left px-4 py-2.5 hover:bg-red-600/20 rounded-lg"
                            >
                                CONTACT
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}
