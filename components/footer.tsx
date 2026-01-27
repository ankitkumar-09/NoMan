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
    <footer className="w-full bg-black py-8 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Device Wrapper */}
       <div className="relative mx-auto w-full max-w-[960px] aspect-[360/146.16]">

          {/* Steam Deck Frame */}
          <img
            src="/images/steam-deck-frame.png"
            alt="Gaming Device"
            className="absolute inset-0 w-full h-full select-none pointer-events-none object-cover"
          />

          {/* Screen Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[61%] h-[82%] rounded-[4px] overflow-hidden">
              {/* Background */}
              <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/50" />

              {/* Content */}
              <div className="relative z-10 h-full w-full px-[5%] py-[5%] flex items-center">
                <div className="w-full grid grid-cols-2 gap-x-[8%] gap-y-[8%]">
                  {/* Left Column */}
                  <div className="min-w-0">
                    <p className="font-semibold text-white mb-[10%] text-[clamp(10px,1.2vw,14px)]">
                      Terms &amp; Conditions
                    </p>
                    <div className="space-y-[clamp(4px,0.6vw,8px)] text-white/80 text-[clamp(9px,1vw,12px)] leading-tight">
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
                    <p className="font-semibold text-white underline underline-offset-2 mb-[10%] text-[clamp(10px,1.2vw,14px)]">
                      Contact Us:
                    </p>
                    <div className="space-y-[clamp(4px,0.6vw,8px)] text-white/80 text-[clamp(9px,1vw,12px)] leading-tight">
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
        <p className="mt-4 text-center text-[9px] sm:text-xs text-white/50">
          © 2025 RedCube. Committed to Entertainment.
        </p>
      </div>
    </footer>
  )
}
