import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const clients = [
  { name: "TechCorp", logo: "/tech-company-logo.jpg", industry: "Technology" },
  { name: "FinanceFlow", logo: "/finance-company-logo.png", industry: "Finance" },
  { name: "MediCare+", logo: "/healthcare-company-logo.png", industry: "Healthcare" },
  { name: "GreenLeaf", logo: "/eco-company-logo.png", industry: "Retail" },
  { name: "AutoDrive", logo: "/automotive-company-logo.png", industry: "Automotive" },
  { name: "FoodieHub", logo: "/food-delivery-logo.png", industry: "Food & Beverage" },
  { name: "EduPro", logo: "/education-company-logo.png", industry: "Education" },
  { name: "TravelNow", logo: "/travel-company-logo.png", industry: "Travel" },
  { name: "FitLife", logo: "/fitness-company-logo.jpg", industry: "Health & Fitness" },
  { name: "HomeStyle", logo: "/home-decor-logo.png", industry: "Home & Living" },
  { name: "CloudTech", logo: "/cloud-technology-logo.jpg", industry: "Technology" },
  { name: "MediaMax", logo: "/generic-media-logo.png", industry: "Media" },
]

const industries = ["All Industries", "Technology", "Finance", "Healthcare", "Retail", "Automotive", "Education"]

export default function ClientsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our <span className="text-[#E63946]">Clients</span>
          </h1>
          <p className="text-xl text-[#888] max-w-3xl mx-auto">
            Trusted by industry leaders worldwide to deliver exceptional results.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((industry) => (
              <button
                key={industry}
                className={`px-6 py-2 rounded-full text-sm transition-colors ${
                  industry === "All Industries"
                    ? "bg-[#E63946] text-white"
                    : "bg-[#1a1a1a] text-[#888] hover:text-white border border-[#333]"
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Grid */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {clients.map((client, index) => (
              <div
                key={index}
                className="bg-[#111] border border-[#222] rounded-2xl p-8 flex flex-col items-center justify-center hover:border-[#E63946]/50 transition-colors"
              >
                <img
                  src={client.logo || "/placeholder.svg"}
                  alt={client.name}
                  className="h-12 object-contain mb-4 opacity-70 hover:opacity-100 transition-opacity"
                />
                <p className="text-white font-medium">{client.name}</p>
                <p className="text-[#666] text-sm">{client.industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-[#111]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "200+", label: "Happy Clients" },
              { value: "40+", label: "Countries" },
              { value: "98%", label: "Client Retention" },
              { value: "500+", label: "Projects Completed" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-[#E63946] mb-2">{stat.value}</div>
                <div className="text-[#888]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#E63946] to-[#d62839] rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Growing Client List</h2>
          <p className="text-white/80 mb-8">Partner with us and experience the difference.</p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-[#E63946] rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            Become a Client
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
