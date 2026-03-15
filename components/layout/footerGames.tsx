"use client"

import { useState } from "react"
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  X, 
  Mail, 
  Phone, 
  Linkedin 
} from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  // State for Pop-up Modals
  const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null)

  const legalDocs = {
    privacy: {
      title: "Privacy & Cookies",
      content: <p>At NoMan Studios, we take your privacy seriously. We only collect the email addresses you provide via our newsletter to send updates. We do not sell your data to third parties. Cookies are used only to enhance site performance.</p>
    },
    terms: {
      title: "Terms & Conditions",
      content: <p>All game assets, logos, and code displayed on this site are the property of NoMan Studios. Unauthorized reproduction or distribution is strictly prohibited.</p>
    },
    faq: {
      title: "Support & FAQ",
      content: (
        <div className="space-y-6 text-left">
          <div>
            <h4 className="text-orange-500 font-bold mb-2">When is the next game release?</h4>
            <p>Burn Point is scheduled for April 2026. Stay tuned for more updates!</p>
          </div>
          <div>
            <h4 className="text-orange-500 font-bold mb-2">How can I contact support?</h4>
            <p>You can reach us at nomanproddigital@gmail.com for any technical issues or feedback.</p>
          </div>
        </div>
      )
    },
    contact: {
      title: "Contact Us",
      content: (
        <div className="space-y-6 text-left">
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-orange-500 shrink-0" />
            <div>
              <p className="font-bold text-white">Email</p>
              <p>nomanproddigital@gmail.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="w-6 h-6 text-orange-500 shrink-0" />
            <div>
              <p className="font-bold text-white">Phone</p>
              <p>+91 79996 72109</p>
            </div>
          </div>
        </div>
      )
    },
    careers: {
      title: "Join Our Team",
      content: <p>We are always looking for passionate developers and artists. Please send your portfolio to <span className="text-orange-500">nomanproddigital@gmail.com</span>.</p>
    }
  }

  return (
    <footer className="w-full bg-black border-t border-white/10 py-12 md:py-16 px-3 sm:px-4 md:px-6 relative" data-section="footer">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          
          {/* Left Column: Contact, Careers, Socials */}
          <div className="space-y-8 text-center md:text-left">
            <div className="space-y-3">
              <h3 className="text-white font-bold text-lg tracking-tight">Contact</h3>
              <button 
                onClick={() => setModalContent(legalDocs.contact)} 
                className="text-white/70 text-sm hover:text-white transition-colors"
              >
                Get in touch with us
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-white font-bold text-lg tracking-tight">Careers</h3>
              <button 
                onClick={() => setModalContent(legalDocs.careers)} 
                className="text-white/70 text-sm hover:text-white transition-colors"
              >
                Join our team
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg tracking-tight">Follow Us</h3>
              <div className="flex justify-center md:justify-start gap-4">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-white/20 hover:bg-orange-600 hover:border-orange-600 transition-all duration-300">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-white/20 hover:bg-orange-600 hover:border-orange-600 transition-all duration-300">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-white/20 hover:bg-orange-600 hover:border-orange-600 transition-all duration-300">
                  <Youtube className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Columns: Legal Links */}
          <div className="md:col-span-2 grid grid-cols-2 gap-8 text-left">
            <div className="space-y-4">
              <button onClick={() => setModalContent(legalDocs.terms)} className="block text-white/70 hover:text-white text-sm transition-colors">Terms & Conditions</button>
              <button onClick={() => setModalContent(legalDocs.faq)} className="block text-white/70 hover:text-white text-sm transition-colors">Support & FAQ</button>
              <button onClick={() => setModalContent(legalDocs.privacy)} className="block text-white/70 hover:text-white text-sm transition-colors">Privacy & Cookies</button>
            </div>

            <div className="space-y-4">
              <button onClick={() => setModalContent(legalDocs.terms)} className="block text-white/70 hover:text-white text-sm transition-colors">Terms of Use</button>
              <button onClick={() => setModalContent(legalDocs.faq)} className="block text-white/70 hover:text-white text-sm transition-colors">Legal FAQ</button>
              <button onClick={() => setModalContent(legalDocs.privacy)} className="block text-white/70 hover:text-white text-sm transition-colors">Health Warning</button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs tracking-widest uppercase">
            © {currentYear} NOMAN PRODUCTION STUDIO.
          </p>
          <p className="text-white/20 text-[10px] uppercase tracking-tighter">
            Committed to Entertainment.
          </p>
        </div>
      </div>

      {/* POP-UP MODAL */}
      {modalContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-neutral-900 border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-xl font-bold text-white">{modalContent.title}</h3>
              <button onClick={() => setModalContent(null)} className="text-white/40 hover:text-white p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 max-h-[50vh] overflow-y-auto text-white/70 leading-relaxed text-sm">
              {modalContent.content}
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end bg-white/[0.02]">
              <button 
                onClick={() => setModalContent(null)} 
                className="px-8 py-2.5 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}
