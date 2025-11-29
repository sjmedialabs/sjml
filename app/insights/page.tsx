import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getPageContent } from "@/lib/models/content"
import { getDefaultPageContent } from "@/lib/defaults"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function InsightsPage() {
  let data

  try {
    data = await getPageContent("insights")
    if (!data) {
      data = getDefaultPageContent("insights")
    }
  } catch (error) {
    console.error("Failed to fetch insights content:", error)
    data = getDefaultPageContent("insights")
  }

  const hero = data?.hero || {
    title: "Insights & Resources",
    subtitle: "Expert perspectives on branding, marketing, and digital transformation.",
  }

  const posts = data?.posts || []
  const categories = data?.categories || ["All"]
  const newsletter = data?.newsletter || {
    title: "Subscribe to Our Newsletter",
    description: "Get the latest insights and resources delivered to your inbox.",
    buttonText: "Subscribe",
  }
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Insights & <span className="text-[#E63946]">Resources</span>
          </h1>
          <p className="text-xl text-[#888] max-w-3xl mx-auto">
            Expert perspectives on branding, marketing, and digital transformation.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full text-sm transition-colors ${
                  category === "All"
                    ? "bg-[#E63946] text-white"
                    : "bg-[#1a1a1a] text-[#888] hover:text-white border border-[#333]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden hover:border-[#E63946]/50 transition-colors"
              >
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full aspect-[16/10] object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-[#888] mb-3">
                    <span className="text-[#E63946]">{post.category}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-3 line-clamp-2">{post.title}</h2>
                  <p className="text-[#888] text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#333] rounded-full"></div>
                      <div>
                        <div className="text-white text-sm">{post.author}</div>
                        <div className="text-[#666] text-xs">{post.date}</div>
                      </div>
                    </div>
                    <button className="text-[#E63946] text-sm hover:underline">Read More →</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-[#111] border border-[#222] rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{newsletter.title}</h2>
          <p className="text-[#888] mb-8">{newsletter.description}</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-[#0a0a0a] border border-[#333] rounded-full text-white placeholder-[#666] focus:outline-none focus:border-[#E63946]"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-[#E63946] text-white rounded-full font-medium hover:bg-[#d62839] transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}
