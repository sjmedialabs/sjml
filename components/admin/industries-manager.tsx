"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"

interface Industry {
  id: string
  title: string
  description: string
  image: string
}

export function IndustriesManager() {
  const [industries, setIndustries] = useState<Industry[]>([
    { id: "1", title: "Technology", description: "SaaS, Cloud, AI/ML + Software Development", image: "" },
    { id: "2", title: "Finance & Banking", description: "Fintech, Banking, Insurance + Investments", image: "" },
    { id: "3", title: "Healthcare", description: "Hospitals, Pharma, and Health services", image: "" },
    { id: "4", title: "Retail & E-commerce", description: "DTC brands, Marketplaces, and Retail chains", image: "" },
    { id: "5", title: "Education", description: "EdTech, Universities, and Corporate Training", image: "" },
    { id: "6", title: "Real Estate", description: "Property Development and Management", image: "" },
  ])

  const addIndustry = () => {
    setIndustries([...industries, { id: Date.now().toString(), title: "", description: "", image: "" }])
  }

  const updateIndustry = (id: string, field: keyof Industry, value: string) => {
    setIndustries(industries.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

  const removeIndustry = (id: string) => {
    setIndustries(industries.filter((i) => i.id !== id))
  }

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken")
    try {
      await fetch("/api/content/industries", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ industries }),
      })
      alert("Industries saved successfully!")
    } catch (error) {
      alert("Failed to save industries")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold admin-text-primary mb-2">Industries</h1>
          <p className="admin-text-secondary">Manage the industries section on your homepage.</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={addIndustry}
            variant="outline"
            className="admin-border-light admin-text-primary hover:admin-bg-secondary bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Industry
          </Button>
          <Button onClick={handleSave} className="bg-[#E63946] hover:bg-[#d32f3d] admin-text-primary">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industries.map((industry) => (
          <Card key={industry.id} className="admin-card admin-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="admin-text-primary text-lg">{industry.title || "New Industry"}</CardTitle>
              <button onClick={() => removeIndustry(industry.id)} className="admin-text-secondary hover:text-[#E63946]">
                <Trash2 className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="admin-text-primary">Title</Label>
                <Input
                  value={industry.title}
                  onChange={(e) => updateIndustry(industry.id, "title", e.target.value)}
                  className="admin-bg-secondary admin-border-light admin-text-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="admin-text-primary">Description</Label>
                <Input
                  value={industry.description}
                  onChange={(e) => updateIndustry(industry.id, "description", e.target.value)}
                  className="admin-bg-secondary admin-border-light admin-text-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="admin-text-primary">Image URL</Label>
                <Input
                  value={industry.image}
                  onChange={(e) => updateIndustry(industry.id, "image", e.target.value)}
                  className="admin-bg-secondary admin-border-light admin-text-primary"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
