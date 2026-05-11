import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ThokWale.Store",
  description: "Direct wholesale marketplace for grains, pulses, rice, and premium flours.",
  generator: "v0.app",
  icons: {
    icon: "/app_logo.png",
    apple: "/app_logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased min-h-screen bg-background text-foreground`}>
        {children}
        <Analytics />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
