"use client"

import { Mail, Facebook, Twitter, Instagram, Github, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  const handleSocialLink = (platform: string) => {
    const links: Record<string, string> = {
      facebook: "https://facebook.com",
      twitter: "https://x.com",
      instagram: "https://instagram.com",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      youtube: "https://youtube.com",
    }
    if (links[platform]) window.open(links[platform], "_blank")
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-black py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 border-t border-white/10" data-section="footer">
      <div className="mx-auto w-full max-w-6xl">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RC</span>
              </div>
              <span className="text-white font-bold text-lg">NoMan</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Committed to Entertainment. Creating world-class games that inspire, challenge, and delight players worldwide.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleSocialLink("facebook")}
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSocialLink("twitter")}
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSocialLink("instagram")}
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSocialLink("youtube")}
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-base">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#games"
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  Games
                </a>
              </li>
              <li>
                <a
                  href="#news"
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  News & Updates
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#careers"
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-base">Support</h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#help"
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#community"
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-base">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#privacy"
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#cookies"
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#health"
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  Health Warning
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-orange-500/10 via-red-500/10 to-purple-500/10 border border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-bold text-lg mb-2">Stay Updated</h3>
              <p className="text-white/60 text-sm">Subscribe to get the latest news and updates</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
              />
              <button className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-orange-500 flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">Email</p>
              <a
                href="mailto:info.redcube@gmail.com"
                className="text-white text-sm hover:text-orange-500 transition-colors duration-300"
              >
                info.redcube@gmail.com
              </a>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-orange-500 flex-shrink-0">
              <Twitter className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">Social Media</p>
              <p className="text-white text-sm">@redcube_studios</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-orange-500 flex-shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">Website</p>
              <a
                href="https://redcube.com"
                className="text-white text-sm hover:text-orange-500 transition-colors duration-300"
              >
                NoMan.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8 sm:pt-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-xs sm:text-sm text-center sm:text-left">
              © {currentYear} RedCube Studios. All rights reserved. Committed to Entertainment.
            </p>
            <div className="flex gap-6 text-white/50 text-xs">
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Cookies Settings</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Add this icon since lucide-react might not have Globe
function Globe(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 1 0 20" />
      <path d="M2 12h20" />
    </svg>
  )
}