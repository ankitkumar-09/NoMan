"use client"

export function Footer() {
  const handleSocialLink = (platform: string) => {
    const links: Record<string, string> = {
      facebook: "https://facebook.com",
      twitter: "https://x.com",
      instagram: "https://instagram.com",
    }
    if (links[platform]) window.open(links[platform], "_blank")
  }

  return (
    <footer className="w-full bg-black py-6 sm:py-8 md:py-10 lg:py-12 px-3 sm:px-4 md:px-6">
      <div className="mx-auto w-full">
        {/* Device Wrapper - Responsive aspect ratio */}
        <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[420px] md:max-w-[680px] lg:max-w-[960px] aspect-[360/146.16]">

          {/* Steam Deck Frame */}
          <img
            src="/images/steam-deck-frame.png"
            alt="Gaming Device"
            className="absolute inset-0 w-full h-full select-none pointer-events-none object-cover"
          />

          {/* Screen Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[61%] h-[82%] rounded-[2px] sm:rounded-[3px] md:rounded-[4px] overflow-hidden">
              {/* Background */}
              <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/50" />

              {/* Content - Stack on mobile */}
              <div className="relative z-10 h-full w-full px-[3%] sm:px-[4%] md:px-[5%] py-[4%] sm:py-[5%] flex items-center">
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-[6%] sm:gap-x-[8%] gap-y-[8%] sm:gap-y-[10%]">
                  
                  {/* Left Column */}
                  <div className="min-w-0">
                    <p className="font-semibold text-white mb-[8%] sm:mb-[10%] text-[clamp(9px,2vw,14px)]">
                      Terms &amp; Conditions
                    </p>
                    <div className="space-y-[clamp(3px,0.8vw,8px)] text-white/80 text-[clamp(8px,1.2vw,12px)] leading-tight">
                      <a href="#support" className="block hover:text-white transition-colors cursor-pointer">
                        Support
                      </a>
                      <a href="#privacy" className="block hover:text-white transition-colors cursor-pointer">
                        Privacy &amp; Cookies
                      </a>
                      <a href="#terms" className="block hover:text-white transition-colors cursor-pointer">
                        Terms of Use
                      </a>
                      <a href="#legal" className="block hover:text-white transition-colors cursor-pointer">
                        Legal
                      </a>
                      <a href="#health" className="block hover:text-white transition-colors cursor-pointer">
                        Health Warning
                      </a>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="min-w-0">
                    <p className="font-semibold text-white underline underline-offset-1 sm:underline-offset-2 mb-[8%] sm:mb-[10%] text-[clamp(9px,2vw,14px)]">
                      Contact Us:
                    </p>
                    <div className="space-y-[clamp(3px,0.8vw,8px)] text-white/80 text-[clamp(8px,1.2vw,12px)] leading-tight">
                      <a
                        href="mailto:info.redcube@gmail.com"
                        className="block truncate hover:text-white transition-colors cursor-pointer"
                        title="info.redcube@gmail.com"
                      >
                        info.redcube@gmail.com
                      </a>
                      <button
                        onClick={() => handleSocialLink("facebook")}
                        className="block hover:text-white transition-colors cursor-pointer text-left"
                      >
                        Facebook
                      </button>
                      <button
                        onClick={() => handleSocialLink("twitter")}
                        className="block hover:text-white transition-colors cursor-pointer text-left"
                      >
                        X
                      </button>
                      <button
                        onClick={() => handleSocialLink("instagram")}
                        className="block hover:text-white transition-colors cursor-pointer text-left"
                      >
                        Instagram
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-3 sm:mt-4 md:mt-6 text-center text-[8px] sm:text-[9px] md:text-xs text-white/50">
          © 2025 RedCube. Committed to Entertainment.
        </p>
      </div>
    </footer>
  )
}