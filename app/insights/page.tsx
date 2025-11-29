import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const posts = [
  {
    id: "1",
    title: "The Ultimate Guide to Brand Strategy in 2024",
    excerpt:
      "Discover the essential elements that make up a successful brand strategy in today's rapidly evolving digital landscape.",
    image: "/brand-strategy-guide.jpg",
    category: "Brand Strategy",
    author: "John Smith",
    date: "Dec 15, 2024",
    readTime: "8 min read",
  },
  {
    id: "2",
    title: "10 Digital Marketing Trends You Can't Ignore",
    excerpt:
      "As we head into the new year, here are the top digital marketing trends that will shape how brands connect with audiences.",
    image: "/digital-marketing-trends.png",
    category: "Digital Marketing",
    author: "Sarah Johnson",
    date: "Dec 12, 2024",
    readTime: "6 min read",
  },
  {
    id: "3",
    title: "UX Design Best Practices for Conversion",
    excerpt:
      "Learn how thoughtful UX design can dramatically improve your website's conversion rates and user satisfaction.",
    image: "/ux-design-conversion.jpg",
    category: "UX Design",
    author: "Michael Chen",
    date: "Dec 10, 2024",
    readTime: "5 min read",
  },
  {
    id: "4",
    title: "Building a Strong Social Media Presence",
    excerpt:
      "Strategies and tactics for building and maintaining a powerful social media presence that drives real results.",
    image: "/social-media-marketing.png",
    category: "Social Media",
    author: "Emily Davis",
    date: "Dec 8, 2024",
    readTime: "7 min read",
  },
  {
    id: "5",
    title: "The Power of Video Marketing",
    excerpt: "Why video content is essential for modern marketing and how to create compelling videos that convert.",
    image: "/video-marketing-production.jpg",
    category: "Content Marketing",
    author: "John Smith",
    date: "Dec 5, 2024",
    readTime: "6 min read",
  },
  {
    id: "6",
    title: "SEO Strategies That Actually Work",
    excerpt:
      "Cut through the noise with proven SEO strategies that will help your website rank higher in search results.",
    image: "/seo-strategy-analytics.jpg",
    category: "SEO",
    author: "Sarah Johnson",
    date: "Dec 2, 2024",
    readTime: "9 min read",
  },
]

const categories = [
  "All",
  "Brand Strategy",
  "Digital Marketing",
  "UX Design",
  "Social Media",
  "Content Marketing",
  "SEO",
]

export default function InsightsPage() {
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
          <h2 className="text-3xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-[#888] mb-8">Get the latest insights and resources delivered to your inbox.</p>
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
