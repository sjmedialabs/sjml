import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { generateSeoMetadata } from "@/lib/seo"

export function generateMetadata() {
  return generateSeoMetadata("Cookies")
}

export default function CookiesPage() {
  return (
      <main className="site-page min-h-screen bg-background pb-16">
      <Header />
        <div className="site-container">
          <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: 1 November 2026</p>
          
          <div className="prose prose-invert max-w-none space-y-6 text-foreground">
            <p>
              SJ Media Labs uses cookies and similar technologies on sjmedialabs.com. A cookie is a small text file stored on your device.
            </p>

            <h2 className="text-2xl font-bold">Cookies we use</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Essential cookies keep the site working, including the sign-in cookie used only in the private admin area.</li>
              <li>Analytics cookies from Google Analytics, loaded through the Google tag, help us see which pages people visit and how the site is used. Google may set cookies such as _ga.</li>
            </ul>

            <h2 className="text-2xl font-bold">Your choices</h2>
            <p>
              You can block or delete cookies in your browser settings. Blocking essential cookies can stop parts of the site from working. Blocking analytics cookies does not stop you from reading the site or contacting us.
            </p>
            <p>
              For how we handle personal information, read our <Link href="/privacy" className="text-[#E63946] hover:underline">Privacy Policy</Link>.
            </p>

            <div className="mt-12 p-6 bg-secondary border border-border rounded-lg">
              <p className="text-muted-foreground">
                For cookie-related inquiries, please contact us at:{" "}
                <a href="mailto:info@sjmedialabs.com" className="text-[#E63946] hover:underline">
                  info@sjmedialabs.com
                </a>
              </p>
            </div>

            <div className="mt-8">
              <Link href="/" className="home-hero-cta-primary inline-flex items-center px-6 font-semibold">
                Return to Homepage
              </Link>
            </div>
          </div>
          </div>
        </div>
      <Footer />
      </main>
  )
}
