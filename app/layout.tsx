import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Image from "next/image" // Image import zaroori hai
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NoMan - Committed to Entertainment",
  description:
    "Experience unreal gaming with NoMan. Own the Drift and explore our immersive game collection.",
  generator: "Next.js",
  applicationName: "NoMan",
  keywords: ["gaming", "burn point", "own the drift", "video games", "entertainment"],
  authors: [{ name: "NoMan" }],
  creator: "NoMan",
  icons: {
    // Browser tab icon path
    icon: "/images/logos/logo-cube2.png",
    apple: "/images/logos/logo-cube.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${_geist.className} antialiased bg-black text-white`}>
        {/* Agar aapko screen par kahin logo circle mein chahiye toh ye use karein */}
        <div className="fixed top-4 left-4 z-50">
          <div className="relative w-13 h-13 overflow-hidden rounded-full border-2 border-white/20 shadow-lg">
            <Image
              src="/images/logos/logo-cube.png"
              alt="NoMan Logo"
              fill
              className="object-cover scale-110" // scale thoda badhaya hai taaki circle fit dikhe
            />
          </div>
        </div>

        {children}
      </body>
    </html>
  )
}