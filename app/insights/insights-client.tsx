"use client"

import { useState } from "react"
import Image from "next/image"

interface Post {
  id: string
  title: string
  excerpt: string
  image: string
  category: string
  author: string
  date: string
  readTime: string
}

interface InsightsClientProps {
  posts: Post[]
  categories: string[]
  hero: {
    title: string
    subtitle: string
  }
  newsletter: {
    title: string
    description: string
    buttonText: string
  }
}

export default function InsightsClient({ posts, categories, hero, newsletter }: InsightsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Filter posts based on selected category
  const filteredPosts = selectedCategory === "All" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory)

  return (
    <>
      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {hero.title.includes("Resources") ? (
              <>
                Insights & <span className="text-[#E63946]">Resources</span>
              </>
            ) : (
              hero.title
            )}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{hero.subtitle}</p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-[#E63946] text-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
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
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No posts found in this category.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:border-[#E63946]/50 transition-colors"
                >
                  <div className="relative w-full aspect-16/10">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="text-[#E63946]">{post.category}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">{post.title}</h2>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#333] rounded-full"></div>
                        <div>
                          <div className="text-foreground text-sm">{post.author}</div>
                          <div className="text-muted-foreground text-xs">{post.date}</div>
                        </div>
                      </div>
                      <button className="text-[#E63946] text-sm hover:underline">Read More →</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">{newsletter.title}</h2>
          <p className="text-muted-foreground mb-8">{newsletter.description}</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-background border border-border rounded-full text-foreground placeholder-[#666] focus:outline-none focus:border-[#E63946]"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-[#E63946] text-foreground rounded-full font-medium hover:bg-[#d62839] transition-colors"
            >
              {newsletter.buttonText}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
