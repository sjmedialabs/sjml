"use client"

import { useState, useEffect } from "react"
import { ImageUpload } from "./image-upload"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  category: string
  author: string
  authorImage: string
  date: string
  readTime: string
  tags: string[]
  featured: boolean
  published: boolean
}

interface InsightsData {
  heroTitle: string
  heroSubtitle: string
  categories: string[]
  posts: BlogPost[]
}

const defaultData: InsightsData = {
  heroTitle: "Insights & Resources",
  heroSubtitle: "Expert perspectives on branding, marketing, and digital transformation.",
  categories: ["All", "Brand Strategy", "Digital Marketing", "Web Design", "Industry Trends"],
  posts: [],
}

export function InsightsPageManager() {
  const [data, setData] = useState<InsightsData>(defaultData)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/content/insights-page")
      if (res.ok) {
        const fetchedData = await res.json()
        setData({ ...defaultData, ...fetchedData })
      }
    } catch (error) {
      console.error("Failed to fetch insights data")
    }
  }

  const saveData = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/content/insights-page", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setMessage("Insights saved successfully!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch {
      setMessage("Failed to save")
    }
    setSaving(false)
  }

  const addPost = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: "New Blog Post",
      slug: "new-blog-post",
      excerpt: "",
      content: "",
      image: "/placeholder.svg?height=400&width=600",
      category: data.categories[1] || "Brand Strategy",
      author: "Admin",
      authorImage: "/placeholder.svg?height=100&width=100",
      date: new Date().toISOString().split("T")[0],
      readTime: "5 min read",
      tags: [],
      featured: false,
      published: false,
    }
    setData({ ...data, posts: [...data.posts, newPost] })
    setEditingPost(newPost)
  }

  const deletePost = (id: string) => {
    setData({ ...data, posts: data.posts.filter((p) => p.id !== id) })
    setEditingPost(null)
  }

  const updatePost = (updated: BlogPost) => {
    setData({ ...data, posts: data.posts.map((p) => (p.id === updated.id ? updated : p)) })
    setEditingPost(updated)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Insights / Blog</h1>
        <p className="text-[#888]">Manage your blog posts and articles</p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{message}</div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Posts List */}
        <div className="col-span-1 bg-[#111] border border-[#222] rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Posts</h2>
            <button
              onClick={addPost}
              className="px-3 py-1.5 bg-[#E63946] text-white rounded-lg hover:bg-[#d62839] text-sm"
            >
              + Add
            </button>
          </div>
          <div className="space-y-2 max-h-[500px] overflow-auto">
            {data.posts.map((post) => (
              <button
                key={post.id}
                onClick={() => setEditingPost(post)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  editingPost?.id === post.id
                    ? "bg-[#E63946] text-white"
                    : "bg-[#0a0a0a] text-[#888] hover:text-white hover:bg-[#1a1a1a]"
                }`}
              >
                <div className="font-medium truncate">{post.title}</div>
                <div className="text-xs opacity-70 flex items-center gap-2">
                  <span>{post.category}</span>
                  {post.published && <span className="text-green-400">Published</span>}
                </div>
              </button>
            ))}
            {data.posts.length === 0 && <p className="text-[#666] text-sm text-center py-4">No posts yet</p>}
          </div>
        </div>

        {/* Post Editor */}
        <div className="col-span-2 bg-[#111] border border-[#222] rounded-xl p-6 max-h-[600px] overflow-auto">
          {editingPost ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Edit Post</h2>
                <button onClick={() => deletePost(editingPost.id)} className="text-red-500 hover:text-red-400 text-sm">
                  Delete Post
                </button>
              </div>
              <div>
                <label className="block text-sm text-[#888] mb-2">Title</label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => updatePost({ ...editingPost, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#888] mb-2">Slug</label>
                  <input
                    type="text"
                    value={editingPost.slug}
                    onChange={(e) => updatePost({ ...editingPost, slug: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#888] mb-2">Category</label>
                  <select
                    value={editingPost.category}
                    onChange={(e) => updatePost({ ...editingPost, category: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                  >
                    {data.categories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#888] mb-2">Excerpt</label>
                <textarea
                  value={editingPost.excerpt}
                  onChange={(e) => updatePost({ ...editingPost, excerpt: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#888] mb-2">Content</label>
                <textarea
                  value={editingPost.content}
                  onChange={(e) => updatePost({ ...editingPost, content: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#888] mb-2">Author</label>
                  <input
                    type="text"
                    value={editingPost.author}
                    onChange={(e) => updatePost({ ...editingPost, author: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#888] mb-2">Date</label>
                  <input
                    type="date"
                    value={editingPost.date}
                    onChange={(e) => updatePost({ ...editingPost, date: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                  />
                </div>
              </div>
              <ImageUpload
                label="Featured Image"
                value={editingPost.image}
                onChange={(url) => updatePost({ ...editingPost, image: url })}
              />
              <ImageUpload
                label="Author Image"
                value={editingPost.authorImage}
                onChange={(url) => updatePost({ ...editingPost, authorImage: url })}
              />
              <div>
                <label className="block text-sm text-[#888] mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={editingPost.tags.join(", ")}
                  onChange={(e) =>
                    updatePost({
                      ...editingPost,
                      tags: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-[#888]">
                  <input
                    type="checkbox"
                    checked={editingPost.featured}
                    onChange={(e) => updatePost({ ...editingPost, featured: e.target.checked })}
                    className="w-4 h-4 accent-[#E63946]"
                  />
                  Featured Post
                </label>
                <label className="flex items-center gap-2 text-sm text-[#888]">
                  <input
                    type="checkbox"
                    checked={editingPost.published}
                    onChange={(e) => updatePost({ ...editingPost, published: e.target.checked })}
                    className="w-4 h-4 accent-[#E63946]"
                  />
                  Published
                </label>
              </div>
            </div>
          ) : (
            <div className="text-center text-[#666] py-12">Select a post to edit or add a new one</div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={saveData}
          disabled={saving}
          className="px-6 py-3 bg-[#E63946] text-white rounded-lg hover:bg-[#d62839] disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  )
}
