"use client"

import { useState } from "react"
import { Linkedin, Instagram, Youtube, Mail, Loader2, CheckCircle2, X, Phone, MapPin, Rocket } from "lucide-react"

interface FooterProps {
  hideNewsletter?: boolean
}

export function Footer({ hideNewsletter = false }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!email || !email.includes("@")) return

  setStatus("loading")
  setErrorMsg("")

  try {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    if (res.status === 409) {
      setErrorMsg("This email is already subscribed!")
      setStatus("error")
      return
    }

    if (!res.ok) throw new Error("Failed")

    setStatus("success")
    setEmail("")
  } catch {
    setErrorMsg("Something went wrong. Please try again.")
    setStatus("error")
  }
}

  const legalDocs = {
    privacy: {
      title: "Privacy Policy",
      content: (
        <p>At NoMan Studios, we take your privacy seriously. We only collect the email addresses you provide via our newsletter to send updates. We do not sell your data to third parties.</p>
      ),
    },
    terms: {
      title: "Terms of Service",
      content: (
        <p>All game assets, logos, and code displayed on this site are the property of NoMan Studios. Unauthorized reproduction or distribution is strictly prohibited.</p>
      ),
    },
    cookies: {
      title: "Cookie Policy",
      content: (
        <p>We use essential cookies to keep our site functional and secure. You can disable cookies in your browser settings at any time.</p>
      ),
    },
    faq: {
      title: "Frequently Asked Questions",
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-orange-500 font-bold mb-2">What games do you develop?</h4>
            <p>We specialize in high-octane indie titles and immersive storytelling experiences across PC and Console platforms.</p>
          </div>
          <div>
            <h4 className="text-orange-500 font-bold mb-2">How can I join the Beta?</h4>
            <p>Subscribe to our newsletter! We send out beta testing invites exclusively to our community members.</p>
          </div>
          <div>
            <h4 className="text-orange-500 font-bold mb-2">Are your games free to play?</h4>
            <p>We offer a mix of premium titles and free-to-play experiences. Check the individual game pages for details.</p>
          </div>
        </div>
      ),
    },
    contact: {
      title: "Contact Us",
      content: (
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-orange-500 shrink-0" />
            <div><p className="font-bold text-white">Email</p><p>nomanproddigital@gmail.com</p></div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="w-6 h-6 text-orange-500 shrink-0" />
            <div><p className="font-bold text-white">Phone</p><p>+91 98765 43210</p></div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-orange-500 shrink-0" />
            <div><p className="font-bold text-white">Studio Address</p><p>Chennai, India</p></div>
          </div>
        </div>
      ),
    },
  }

  return (
    <footer className="w-full bg-black py-8 sm:py-12 md:py-20 border-t border-white/10 relative" data-section="footer">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">

        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16 text-center sm:text-left">

          {/* Brand Column */}
          <div className="flex flex-col items-center sm:items-start space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
                <img src="/1.png" alt="NoMan Logo" className="w-full h-full object-contain rounded-lg" />
              </div>
              <span className="text-white font-bold text-lg sm:text-xl tracking-tight">NoMan</span>
            </div>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-[280px]">
              Committed to Entertainment. Creating world-class games that inspire and delight.
            </p>
            <div className="flex gap-3 sm:gap-4 pt-1 sm:pt-2">
              {[
                { Icon: Linkedin, href: "https://www.linkedin.com/company/nomanprod/" },
                { Icon: Instagram, href: "https://www.instagram.com/noman__.games/" },
                { Icon: Youtube, href: "https://www.youtube.com/channel/UCQWzNg1ToM8umNt0YUaIVhw" },
              ].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-orange-600 flex items-center justify-center text-white/70 hover:text-white transition-all border border-white/5">
                  <social.Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Support Column */}
          <div className="flex flex-col items-center sm:items-start space-y-5">
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.2em] text-orange-500">Support</h4>
            <ul className="space-y-4 text-white/60 text-sm font-medium">
              <li><button onClick={() => setModalContent(legalDocs.contact)} className="hover:text-white transition-colors">Contact Us</button></li>
              <li><button onClick={() => setModalContent(legalDocs.faq)} className="hover:text-white transition-colors">FAQ</button></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="flex flex-col items-center sm:items-start space-y-5">
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.2em] text-orange-500">Legal</h4>
            <ul className="space-y-4 text-white/60 text-sm font-medium">
              <li><button onClick={() => setModalContent(legalDocs.privacy)} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => setModalContent(legalDocs.terms)} className="hover:text-white transition-colors">Terms of Service</button></li>
              <li><button onClick={() => setModalContent(legalDocs.cookies)} className="hover:text-white transition-colors">Cookie Policy</button></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        { !hideNewsletter && (
          <div className="mb-12 sm:mb-16 rounded-2xl sm:rounded-[2.5rem] bg-white/[0.02] border border-white/10 overflow-hidden relative">
            <div className="flex justify-center pt-8 sm:pt-10">
              <span className="inline-flex items-center gap-2 bg-orange-600/15 border border-orange-500/30 text-orange-400 text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full">
                <Rocket className="w-3 h-3" />
                Beta Access Available
              </span>
            </div>

            <div className="p-6 sm:p-8 md:p-10 relative z-10">
              {status === "success" ? (
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <CheckCircle2 className="w-12 h-12 text-orange-500" />
                  <h3 className="text-white font-bold text-2xl sm:text-3xl">You&apos;re on the list!</h3>
                  <p className="text-white/50 text-sm sm:text-base max-w-sm">
                    Check your inbox — a confirmation email is on its way. Beta invites go out to this list first.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10 text-center lg:text-left">
                  <div className="space-y-3 lg:max-w-sm">
                    <h3 className="text-white font-bold text-xl sm:text-2xl md:text-3xl leading-tight">
                      Stay Updated & Get Early Access
                    </h3>
                    <p className="text-white/50 text-xs sm:text-sm md:text-base leading-relaxed">
                      Subscribe to receive the latest studio news, dev updates, and — most importantly — exclusive invites to{" "}
                      <span className="text-orange-400 font-semibold">beta test our internal app</span> before anyone else.
                    </p>
                    <ul className="flex flex-col sm:flex-row lg:flex-col gap-1.5 items-center lg:items-start text-white/40 text-xs">
                      {["Early game announcements", "Beta testing invites", "Behind-the-scenes updates"].map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-orange-500/70 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto lg:min-w-[420px]">
                    <div className="relative w-full">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle") }}
                        required
                        placeholder="Enter your email"
                        className={`px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-2xl bg-black border ${
                          status === "error" ? "border-red-500/60" : "border-white/10 focus:border-orange-500/50"
                        } text-white text-xs sm:text-sm w-full outline-none transition-colors`}
                      />
                      {status === "error" && (
                        <p className="absolute -bottom-5 left-1 text-red-400 text-[11px]">{errorMsg}</p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold flex items-center justify-center gap-2 text-xs sm:text-sm transition-colors shrink-0 disabled:opacity-60"
                    >
                      {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 sm:pt-8 md:pt-10 text-center sm:text-left">
          <p className="text-white/40 text-[10px] xs:text-xs sm:text-[13px]">
            © {currentYear} NoMan Studios. All rights reserved.
          </p>
        </div>
      </div>

      {/* MODAL */}
      {modalContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{modalContent.title}</h3>
              <button onClick={() => setModalContent(null)} className="text-white/40 hover:text-white"><X /></button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto text-white/70 leading-relaxed custom-scrollbar">
              {modalContent.content}
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end">
              <button onClick={() => setModalContent(null)} className="px-6 py-2 bg-white/10 text-white rounded-xl">Close</button>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}