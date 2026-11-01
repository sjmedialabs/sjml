import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { SITE_URL, getSeoData } from "@/lib/seo"
import { ThemeProvider } from "@/hooks/use-theme"
import { SiteScrollReveal } from "@/components/site-scroll-reveal"
import { SiteScripts } from "@/components/site-scripts"
import { PublicReadability } from "@/components/public-readability"
import { HeaderProvider } from "@/components/header-provider"
import { normalizeHeaderContent } from "@/lib/header-content"
import { getPageContent } from "@/lib/models/content"
import { getSiteTypography } from "@/lib/get-site-typography"
import { siteTypographyStyleVars } from "@/lib/site-typography"
import { getSiteScripts } from "@/lib/get-site-scripts"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
})

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSeoData()
  const favicon = seoData?.favicon?.trim() || "/favicon.ico"
  return {
    metadataBase: new URL(SITE_URL),
    icons: { icon: favicon, shortcut: favicon, apple: favicon },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [typography, scripts, headerRecord] = await Promise.all([
    getSiteTypography(),
    getSiteScripts(),
    getPageContent("header").catch(() => null),
  ])
  const typographyVars = siteTypographyStyleVars(typography)
  const header = normalizeHeaderContent((headerRecord || {}) as Record<string, unknown>)

  return (
    <html lang="en" className="light" suppressHydrationWarning style={typographyVars}>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <ThemeProvider>
          <HeaderProvider value={header}>
            <SiteScrollReveal />
            <PublicReadability />
            <SiteScripts scripts={scripts} />
            {children}
          </HeaderProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
