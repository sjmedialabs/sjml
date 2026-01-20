"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"

interface Insight {
  id: string
  title: string
  description: string
  image: string
  date: string
  category: string
}

export function InsightsManager() {
  const [insights, setInsights] = useState<Insight[]>([
    {
      id: "1",
      title: "The Ultimate Guide to Brand Strategy in 2024",
      description: "Discover the essential elements that make up a successful brand strategy.",
      image: "",
      date: "Dec 15, 2024",
      category: "Brand Strategy",
    },
    {
      id: "2",
      title: "10 Digital Marketing Trends You Can't Ignore",
      description: "Top digital marketing trends that will shape how brands connect with audiences.",
      image: "",
      date: "Dec 12, 2024",
      category: "Digital Marketing",
    },
  ])

  const addInsight = () => {
    setInsights([
      ...insights,
      { id: Date.now().toString(), title: "", description: "", image: "", date: "", category: "" },
    ])
  }

  const updateInsight = (id: string, field: keyof Insight, value: string) => {
    setInsights(insights.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

  const removeInsight = (id: string) => {
    setInsights(insights.filter((i) => i.id !== id))
  }

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken")
    try {
      await fetch("/api/content/insights", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ insights }),
      })
      alert("Insights saved successfully!")
    } catch (error) {
      alert("Failed to save insights")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold admin-text-primary mb-2">Insights / Blog</h1>
          <p className="admin-text-secondary">Manage blog posts and articles.</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={addInsight}
            variant="outline"
            className="admin-border-light admin-text-primary hover:admin-bg-secondary bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Insight
          </Button>
          <Button onClick={handleSave} className="bg-[#E63946] hover:bg-[#d32f3d] admin-text-primary">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {insights.map((insight) => (
          <Card key={insight.id} className="admin-card admin-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="admin-text-primary">{insight.title || "New Insight"}</CardTitle>
              <button onClick={() => removeInsight(insight.id)} className="admin-text-secondary hover:text-[#E63946]">
                <Trash2 className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="admin-text-primary">Title</Label>
                  <Input
                    value={insight.title}
                    onChange={(e) => updateInsight(insight.id, "title", e.target.value)}
                    className="admin-bg-secondary admin-border-light admin-text-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="admin-text-primary">Image URL</Label>
                  <Input
                    value={insight.image}
                    onChange={(e) => updateInsight(insight.id, "image", e.target.value)}
                    className="admin-bg-secondary admin-border-light admin-text-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="admin-text-primary">Description</Label>
                <Textarea
                  value={insight.description}
                  onChange={(e) => updateInsight(insight.id, "description", e.target.value)}
                  className="admin-bg-secondary admin-border-light admin-text-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="admin-text-primary">Date</Label>
                  <Input
                    value={insight.date}
                    onChange={(e) => updateInsight(insight.id, "date", e.target.value)}
                    placeholder="e.g., Dec 15, 2024"
                    className="admin-bg-secondary admin-border-light admin-text-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="admin-text-primary">Category</Label>
                  <Input
                    value={insight.category}
                    onChange={(e) => updateInsight(insight.id, "category", e.target.value)}
                    placeholder="e.g., Brand Strategy"
                    className="admin-bg-secondary admin-border-light admin-text-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
