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
          <h1 className="text-3xl font-bold text-white mb-2">Industries</h1>
          <p className="text-[#888]">Manage the industries section on your homepage.</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={addIndustry}
            variant="outline"
            className="border-[#333] text-white hover:bg-[#1a1a1a] bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Industry
          </Button>
          <Button onClick={handleSave} className="bg-[#E63946] hover:bg-[#d32f3d] text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industries.map((industry) => (
          <Card key={industry.id} className="bg-[#111] border-[#222]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white text-lg">{industry.title || "New Industry"}</CardTitle>
              <button onClick={() => removeIndustry(industry.id)} className="text-[#888] hover:text-[#E63946]">
                <Trash2 className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Title</Label>
                <Input
                  value={industry.title}
                  onChange={(e) => updateIndustry(industry.id, "title", e.target.value)}
                  className="bg-[#1a1a1a] border-[#333] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Input
                  value={industry.description}
                  onChange={(e) => updateIndustry(industry.id, "description", e.target.value)}
                  className="bg-[#1a1a1a] border-[#333] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Image URL</Label>
                <Input
                  value={industry.image}
                  onChange={(e) => updateIndustry(industry.id, "image", e.target.value)}
                  className="bg-[#1a1a1a] border-[#333] text-white"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
