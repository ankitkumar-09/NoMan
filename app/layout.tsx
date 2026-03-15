import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
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
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${_geist.className} antialiased bg-black text-white`}>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WVV46LS59D"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WVV46LS59D');
          `}
        </Script>

        {children}
      </body>
    </html>
  )
}