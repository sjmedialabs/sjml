import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { generateSeoMetadata } from "@/lib/seo"
import { ThemeProvider } from "@/hooks/use-theme"
import { SiteScrollReveal } from "@/components/site-scroll-reveal"
import { getSiteTypography } from "@/lib/get-site-typography"
import { siteTypographyStyleVars } from "@/lib/site-typography"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
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
      <body className={`${poppins.variable} font-sans antialiased`}>
        <ThemeProvider>
          <SiteScrollReveal />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
