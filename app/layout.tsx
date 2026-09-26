import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { generateSeoMetadata } from "@/lib/seo"
import { ThemeProvider } from "@/hooks/use-theme"
import { SiteScrollReveal } from "@/components/site-scroll-reveal"
import { SiteScripts } from "@/components/site-scripts"
import { getSiteTypography } from "@/lib/get-site-typography"
import { siteTypographyStyleVars } from "@/lib/site-typography"
import { getSiteScripts } from "@/lib/get-site-scripts"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
})

export const dynamic = "force-dynamic"

// Generate metadata dynamically from database
export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("Home")
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [typography, scripts] = await Promise.all([getSiteTypography(), getSiteScripts()])
  const typographyVars = siteTypographyStyleVars(typography)

  return (
    <html lang="en" className="light" suppressHydrationWarning style={typographyVars}>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <ThemeProvider>
          <SiteScrollReveal />
          <SiteScripts scripts={scripts} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
