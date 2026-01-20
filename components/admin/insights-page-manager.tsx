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
        <h1 className="text-2xl font-bold admin-text-primary mb-2">Insights / Blog</h1>
        <p className="admin-text-secondary">Manage your blog posts and articles</p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{message}</div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold admin-text-primary">Blog Posts ({data.posts.length})</h2>
          <p className="admin-text-secondary text-sm">Manage blog posts and articles</p>
        </div>
        <button
          onClick={addPost}
          className="px-4 py-2 bg-[#E63946] admin-text-primary rounded-lg hover:bg-[#d62839]"
        >
          + Add Post
        </button>
      </div>

      {/* Posts Table */}
      <div className="admin-card border admin-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b admin-border">
              <th className="text-left p-4 admin-text-secondary font-medium">Title</th>
              <th className="text-left p-4 admin-text-secondary font-medium">Category</th>
              <th className="text-left p-4 admin-text-secondary font-medium">Author</th>
              <th className="text-left p-4 admin-text-secondary font-medium">Date</th>
              <th className="text-left p-4 admin-text-secondary font-medium">Status</th>
              <th className="text-right p-4 admin-text-secondary font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center admin-text-muted">
                  No blog posts yet
                </td>
              </tr>
            ) : (
              data.posts.map((post) => (
                <tr key={post.id} className="border-b admin-border hover:admin-bg-secondary">
                  <td className="p-4">
                    <div className="admin-text-primary font-medium">{post.title}</div>
                    <div className="admin-text-muted text-sm">{post.slug}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
                      {post.category}
                    </span>
                  </td>
                  <td className="p-4 admin-text-secondary">{post.author || "-"}</td>
                  <td className="p-4 admin-text-secondary text-sm">{post.date}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        post.published
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 admin-text-secondary"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingPost(post)}
                        className="admin-text-secondary hover:admin-text-primary px-2 py-1 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-red-400 hover:text-red-300 px-2 py-1 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="admin-card border admin-border rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold admin-text-primary">Edit Blog Post</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => deletePost(editingPost.id)}
                  className="text-red-500 hover:text-red-400 text-sm px-3 py-1"
                >
                  Delete
                </button>
                <button
                  onClick={() => setEditingPost(null)}
                  className="admin-text-secondary hover:admin-text-primary text-sm px-3 py-1"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Title</label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => updatePost({ ...editingPost, title: e.target.value })}
                  className="w-full px-4 py-3 admin-input rounded-lg  focus:outline-none focus:border-[#E63946]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm admin-text-secondary mb-2">Slug</label>
                  <input
                    type="text"
                    value={editingPost.slug}
                    onChange={(e) => updatePost({ ...editingPost, slug: e.target.value })}
                    className="w-full px-4 py-3 admin-input rounded-lg  focus:outline-none focus:border-[#E63946]"
                  />
                </div>
                <div>
                  <label className="block text-sm admin-text-secondary mb-2">Category</label>
                  <select
                    value={editingPost.category}
                    onChange={(e) => updatePost({ ...editingPost, category: e.target.value })}
                    className="w-full px-4 py-3 admin-input rounded-lg  focus:outline-none focus:border-[#E63946]"
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
                <label className="block text-sm admin-text-secondary mb-2">Excerpt</label>
                <textarea
                  value={editingPost.excerpt}
                  onChange={(e) => updatePost({ ...editingPost, excerpt: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 admin-input rounded-lg  focus:outline-none focus:border-[#E63946]"
                />
              </div>
              <div>
                <label className="block text-sm admin-text-secondary mb-2">Content</label>
                <textarea
                  value={editingPost.content}
                  onChange={(e) => updatePost({ ...editingPost, content: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 admin-input rounded-lg  focus:outline-none focus:border-[#E63946]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm admin-text-secondary mb-2">Author</label>
                  <input
                    type="text"
                    value={editingPost.author}
                    onChange={(e) => updatePost({ ...editingPost, author: e.target.value })}
                    className="w-full px-4 py-3 admin-input rounded-lg  focus:outline-none focus:border-[#E63946]"
                  />
                </div>
                <div>
                  <label className="block text-sm admin-text-secondary mb-2">Date</label>
                  <input
                    type="date"
                    value={editingPost.date}
                    onChange={(e) => updatePost({ ...editingPost, date: e.target.value })}
                    className="w-full px-4 py-3 admin-input rounded-lg  focus:outline-none focus:border-[#E63946]"
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
                <label className="block text-sm admin-text-secondary mb-2">Tags (comma separated)</label>
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
                  className="w-full px-4 py-3 admin-input rounded-lg  focus:outline-none focus:border-[#E63946]"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm admin-text-secondary">
                  <input
                    type="checkbox"
                    checked={editingPost.featured}
                    onChange={(e) => updatePost({ ...editingPost, featured: e.target.checked })}
                    className="w-4 h-4 accent-[#E63946]"
                  />
                  Featured Post
                </label>
                <label className="flex items-center gap-2 text-sm admin-text-secondary">
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
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={saveData}
          disabled={saving}
          className="px-6 py-3 bg-[#E63946] admin-text-primary rounded-lg hover:bg-[#d62839] disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  )
}
