import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-invert max-w-none space-y-6 text-foreground">
            <p>This page is currently being updated. Please check back soon or contact us for more information.</p>
            
            <div className="mt-12 p-6 bg-secondary border border-border rounded-lg">
              <p className="text-muted-foreground">
                For privacy-related inquiries, please contact us at:{" "}
                <a href="mailto:info@sjmedialabs.com" className="text-[#E63946] hover:underline">
                  info@sjmedialabs.com
                </a>
              </p>
            </div>

            <div className="mt-8">
              <Link href="/" className="inline-block px-6 py-3 bg-[#E63946] text-white rounded-full hover:bg-[#d62839] transition-colors">
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
