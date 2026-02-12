"use client"

import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-black py-12 sm:py-20 border-t border-white/10" data-section="footer">
      {/* Outer Container: 
         - px-6 ensures there is ALWAYS padding on the sides.
         - mx-auto ensures it stays in the center of the laptop screen.
      */}
    <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 md:px-12">
        
        {/* Main Grid: Centered on mobile, left-aligned on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-center sm:text-left">
          
          {/* Brand Column */}
          <div className="flex flex-col items-center sm:items-start space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-base">RC</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">NoMan</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-[280px]">
              Committed to Entertainment. Creating world-class games that inspire, challenge, and delight players worldwide.
            </p>
            <div className="flex gap-4 pt-2">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <button 
                  key={i} 
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-orange-600 flex items-center justify-center text-white/70 hover:text-white transition-all border border-white/5"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col items-center sm:items-start space-y-5">
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.2em] text-orange-500">Quick Links</h4>
            <ul className="space-y-4 text-white/60 text-sm font-medium">
              <li><a href="#games" className="hover:text-white transition-colors">Games</a></li>
              <li><a href="#news" className="hover:text-white transition-colors">News & Updates</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="flex flex-col items-center sm:items-start space-y-5">
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.2em] text-orange-500">Support</h4>
            <ul className="space-y-4 text-white/60 text-sm font-medium">
              <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="flex flex-col items-center sm:items-start space-y-5">
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.2em] text-orange-500">Legal</h4>
            <ul className="space-y-4 text-white/60 text-sm font-medium">
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#cookies" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter: Centered Container */}
        <div className="mb-16 p-8 sm:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
            <div className="space-y-3">
              <h3 className="text-white font-bold text-3xl">Stay Updated</h3>
              <p className="text-white/50 text-base">Subscribe to get the latest news and updates</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-4 rounded-2xl bg-black border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-orange-500 transition-all w-full lg:w-96"
              />
              <button className="px-10 py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Centered on mobile */}
        <div className="border-t border-white/10 pt-10 flex flex-col sm:flex-row items-center justify-between gap-8 text-white/40 text-[13px]">
          <p className="order-2 sm:order-1">
            © {currentYear} <span className="text-white/70">RedCube Studios</span>. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 order-1 sm:order-2">
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            <a href="#" className="hover:text-white transition-colors">Accessibility</a>
            <a href="#" className="hover:text-white transition-colors">Cookies Settings</a>
          </div>
        </div>
      </div>
    </footer>
  )
}