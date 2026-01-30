"use client"

import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Github, Linkedin, Youtube, ArrowRight } from "lucide-react"
import { motion,Variants } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} satisfies Variants

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1], // 🔑 IMPORTANT
    },
  },
} satisfies Variants

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

 
  return (
    <footer className="w-full bg-black relative overflow-hidden py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6 border-t border-white/10">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="mx-auto w-full max-w-6xl relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Join the Community</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Be part of something extraordinary. Connect with us and stay updated on the latest releases and events.
          </p>
        </motion.div>

        {/* Main Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16"
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <span className="text-white font-bold">RC</span>
                </div>
                <span className="text-white font-bold text-xl">RedCube</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Creating immersive gaming experiences that push boundaries and inspire millions of players worldwide.
              </p>
            </div>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: "facebook" },
                { icon: Twitter, label: "twitter" },
                { icon: Instagram, label: "instagram" },
                { icon: Youtube, label: "youtube" },
              ].map(({ icon: Icon, label }) => (
                <motion.button
                  key={label}
                  whileHover={{ scale: 1.2, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialLink(label)}
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/10 to-white/5 hover:from-orange-500/20 hover:to-red-500/20 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 group border border-white/10"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-white font-semibold text-lg">Product</h4>
            <ul className="space-y-3">
              {[
                { label: "Games", href: "#games" },
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "Updates", href: "#updates" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-white/60 hover:text-white text-sm transition-colors duration-300 flex items-center group"
                  >
                    {item.label}
                    <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-white font-semibold text-lg">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "About", href: "#about" },
                { label: "Blog", href: "#blog" },
                { label: "Careers", href: "#careers" },
                { label: "Contact", href: "#contact" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-white/60 hover:text-white text-sm transition-colors duration-300 flex items-center group"
                  >
                    {item.label}
                    <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-white font-semibold text-lg">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info.redcube@gmail.com"
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300 flex items-start gap-2 group"
                >
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>info.redcube@gmail.com</span>
                </a>
              </li>
              <li>
                <div className="text-white/60 text-sm flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>+1 (555) 000-0000</span>
                </div>
              </li>
              <li>
                <div className="text-white/60 text-sm flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>123 Game Street, Studio City, CA</span>
                </div>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-orange-500/10 via-red-500/10 to-purple-500/10 border border-white/10 backdrop-blur-sm"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h4 className="text-white font-semibold text-xl mb-2">Stay in the Loop</h4>
              <p className="text-white/60 text-sm">Get exclusive updates, game launches, and special offers.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-all duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Links */}
        <div className="border-t border-white/10 pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="flex gap-4 text-white/60 text-xs sm:text-sm flex-wrap">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span className="text-white/20">•</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <span className="text-white/20">•</span>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
            <div className="flex gap-4 text-white/60 text-xs sm:text-sm justify-end">
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
              <span className="text-white/20">•</span>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-white/40 text-xs text-center">
            © {currentYear} RedCube Studios. All rights reserved. Committed to Entertainment.
          </p>
        </div>
      </div>
    </footer>
  )
}