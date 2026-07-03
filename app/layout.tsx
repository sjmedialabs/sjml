import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono, Playfair_Display } from "next/font/google"
import "./globals.css"
import { generateSeoMetadata } from "@/lib/seo"
import { ThemeProvider } from "@/hooks/use-theme"
import { getSiteTypography } from "@/lib/get-site-typography"
import { siteTypographyStyleVars } from "@/lib/site-typography"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
})

// Generate metadata dynamically from database
export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("Home")
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const typography = await getSiteTypography()
  const typographyVars = siteTypographyStyleVars(typography)

  return (
    <html lang="en" className="light" suppressHydrationWarning style={typographyVars}>
      <body className={`${inter.variable} ${geistMono.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
