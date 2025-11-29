"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save, ImageIcon } from "lucide-react"

interface CaseStudy {
  id: string
  title: string
  description: string
  image: string
  duration: string
  team: string
}

export function CaseStudiesManager() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([
    {
      id: "1",
      title: "TechCorp Global Rebranding",
      description:
        "Complete brand overhaul for a Fortune 500 technology company, resulting in 40% increase in brand recognition.",
      image: "/placeholder.svg",
      duration: "6 Weeks",
      team: "8 People",
    },
    {
      id: "2",
      title: "MediCare+ Patient Platform",
      description: "Digital transformation for healthcare provider with patient portal and appointment system.",
      image: "/placeholder.svg",
      duration: "8 Weeks",
      team: "12 People",
    },
  ])

  const addCaseStudy = () => {
    setCaseStudies([
      ...caseStudies,
      { id: Date.now().toString(), title: "", description: "", image: "", duration: "", team: "" },
    ])
  }

  const updateCaseStudy = (id: string, field: keyof CaseStudy, value: string) => {
    setCaseStudies(caseStudies.map((cs) => (cs.id === id ? { ...cs, [field]: value } : cs)))
  }

  const removeCaseStudy = (id: string) => {
    setCaseStudies(caseStudies.filter((cs) => cs.id !== id))
  }

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken")
    try {
      await fetch("/api/content/case-studies", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ caseStudies }),
      })
      alert("Case studies saved successfully!")
    } catch (error) {
      alert("Failed to save case studies")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Case Studies</h1>
          <p className="text-[#888]">Manage your featured case studies.</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={addCaseStudy}
            variant="outline"
            className="border-[#333] text-white hover:bg-[#1a1a1a] bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Case Study
          </Button>
          <Button onClick={handleSave} className="bg-[#E63946] hover:bg-[#d32f3d] text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {caseStudies.map((caseStudy) => (
          <Card key={caseStudy.id} className="bg-[#111] border-[#222]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">{caseStudy.title || "New Case Study"}</CardTitle>
              <button onClick={() => removeCaseStudy(caseStudy.id)} className="text-[#888] hover:text-[#E63946]">
                <Trash2 className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Title</Label>
                  <Input
                    value={caseStudy.title}
                    onChange={(e) => updateCaseStudy(caseStudy.id, "title", e.target.value)}
                    className="bg-[#1a1a1a] border-[#333] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={caseStudy.image}
                      onChange={(e) => updateCaseStudy(caseStudy.id, "image", e.target.value)}
                      className="bg-[#1a1a1a] border-[#333] text-white"
                    />
                    <Button variant="outline" className="border-[#333] text-white bg-transparent">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Textarea
                  value={caseStudy.description}
                  onChange={(e) => updateCaseStudy(caseStudy.id, "description", e.target.value)}
                  className="bg-[#1a1a1a] border-[#333] text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Duration</Label>
                  <Input
                    value={caseStudy.duration}
                    onChange={(e) => updateCaseStudy(caseStudy.id, "duration", e.target.value)}
                    placeholder="e.g., 6 Weeks"
                    className="bg-[#1a1a1a] border-[#333] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Team Size</Label>
                  <Input
                    value={caseStudy.team}
                    onChange={(e) => updateCaseStudy(caseStudy.id, "team", e.target.value)}
                    placeholder="e.g., 8 People"
                    className="bg-[#1a1a1a] border-[#333] text-white"
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
