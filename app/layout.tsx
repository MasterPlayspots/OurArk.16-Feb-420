import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import "./globals.css"

const inter = localFont({
  src: [
    {
      path: "../public/fonts/Inter-Variable.woff2",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "OurArk - AI Workspace",
  description:
    "All-in-One Plattform fur Teams, die mit KI arbeiten. Chat, Browser, Agenten-Steuerung, Dokumenten-Management und Team-Kollaboration.",
  icons: {
    icon: "/oa-logo.svg",
  },
}

export const viewport: Viewport = {
  themeColor: "#08080d",
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
    <html lang="de" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
