"use client"

import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils/utils"

const TEXT = "WELCOME TO REDCUBE STUDIOS!"
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

	// Handle scroll
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 50)
		window.addEventListener("scroll", onScroll)
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	// Auto-collapse after 5s
	useEffect(() => {
		if (!showTypewriter) return
		const timer = setTimeout(() => setShowTypewriter(false), AUTO_RETURN_MS)
		return () => clearTimeout(timer)
	}, [showTypewriter])

	const typed = useTypewriter(TEXT, showTypewriter, 45)

	return (
		<nav className="fixed top-4 left-4 right-4 z-50 max-w-[calc(100%-2rem)] mx-auto">
			<div className="relative h-[44px] max-w-4xl mx-auto">
				{/* Welcome Text - Auto Display */}
				<div
					className={cn(
						"absolute inset-0 rounded-full overflow-hidden isolate flex items-center justify-center transition-all duration-700",
						"bg-black/20 backdrop-blur-md ring-1 ring-white/10",
						"before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-linear-to-b before:from-white/8 before:to-transparent before:pointer-events-none",
						showTypewriter ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
					)}
				>
					<span className="relative z-10 text-white tracking-[0.3em] text-[11px] sm:text-[12px] font-medium px-4 text-center">
						{typed}
						{typed.length < TEXT.length && (
							<span className="ml-1 animate-pulse">|</span>
						)}
					</span>
				</div>

				{/* Navbar with Menu */}
				<div
					className={cn(
						"absolute inset-0 rounded-full overflow-hidden isolate transition-all duration-700",
						"before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-linear-to-b before:from-white/8 before:to-transparent before:pointer-events-none",
						scrolled
							? "bg-black/30 backdrop-blur-md ring-1 ring-white/10 shadow-md shadow-black/20"
							: "bg-black/20 backdrop-blur-md ring-1 ring-white/10 shadow-sm shadow-black/20",
						!showTypewriter ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
					)}
				>
					<div className="px-4 h-full flex items-center justify-between">
						<img
							src="/images/logos/logo-cube.png"
							alt="Red Cube Logo"
							className="w-6 h-6 select-none"
							draggable={false}
						/>

						<button
							onClick={() => setMenuOpen(!menuOpen)}
							className="cursor-pointer text-white/80 hover:text-white transition-colors"
							aria-label="Toggle menu"
							type="button"
						>
							<Menu className="w-6 h-6" />
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{menuOpen && (
				<div className="absolute top-16 right-0 w-64 bg-black/90 backdrop-blur-md rounded-2xl border border-white/10 p-4 animate-in fade-in slide-in-from-top-2">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-white font-semibold">Menu</h3>
						<button
							onClick={() => setMenuOpen(false)}
							className="cursor-pointer text-white/60 hover:text-white transition-colors"
							aria-label="Close menu"
						>
							<X className="w-5 h-5" />
						</button>
					</div>
					<div className="space-y-3 text-white/80 text-sm">
						<a
							href="#games"
							className="block hover:text-white transition-colors cursor-pointer"
						>
							Games
						</a>
						<a
							href="#news"
							className="block hover:text-white transition-colors cursor-pointer"
						>
							News
						</a>
						<a
							href="#about"
							className="block hover:text-white transition-colors cursor-pointer"
						>
							About
						</a>
						<a
							href="#contact"
							className="block hover:text-white transition-colors cursor-pointer"
						>
							Contact
						</a>
					</div>
				</div>
			)}
		</nav>
	)
}