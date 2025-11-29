"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"

export function HeroManager() {
  const [heroData, setHeroData] = useState({
    title: "Transform Your Brand Into a",
    description:
      "Strategic brand development, identity design, and brand management to create memorable brand experiences.",
    primaryButtonText: "Start a Project",
    secondaryButtonText: "See Our works",
    rotatingWords: ["Success Story", "Digital Experience", "Market Leader", "Creative Force"],
  })

  const [newWord, setNewWord] = useState("")

  const addRotatingWord = () => {
    if (newWord.trim()) {
      setHeroData({
        ...heroData,
        rotatingWords: [...heroData.rotatingWords, newWord.trim()],
      })
      setNewWord("")
    }
  }

  const removeRotatingWord = (index: number) => {
    setHeroData({
      ...heroData,
      rotatingWords: heroData.rotatingWords.filter((_, i) => i !== index),
    })
  }

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken")
    try {
      await fetch("/api/content/hero", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(heroData),
      })
      alert("Hero section saved successfully!")
    } catch (error) {
      alert("Failed to save hero section")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Hero Section</h1>
          <p className="text-[#888]">Manage the hero section content on your homepage.</p>
        </div>
        <Button onClick={handleSave} className="bg-[#E63946] hover:bg-[#d32f3d] text-white">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Main Content */}
        <Card className="bg-[#111] border-[#222]">
          <CardHeader>
            <CardTitle className="text-white">Main Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Headline</Label>
              <Input
                value={heroData.title}
                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                className="bg-[#1a1a1a] border-[#333] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Description</Label>
              <Textarea
                value={heroData.description}
                onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                className="bg-[#1a1a1a] border-[#333] text-white min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Primary Button</Label>
                <Input
                  value={heroData.primaryButtonText}
                  onChange={(e) => setHeroData({ ...heroData, primaryButtonText: e.target.value })}
                  className="bg-[#1a1a1a] border-[#333] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Secondary Button</Label>
                <Input
                  value={heroData.secondaryButtonText}
                  onChange={(e) => setHeroData({ ...heroData, secondaryButtonText: e.target.value })}
                  className="bg-[#1a1a1a] border-[#333] text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rotating Words */}
        <Card className="bg-[#111] border-[#222]">
          <CardHeader>
            <CardTitle className="text-white">Rotating Words</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="Add new rotating word"
                className="bg-[#1a1a1a] border-[#333] text-white"
                onKeyPress={(e) => e.key === "Enter" && addRotatingWord()}
              />
              <Button onClick={addRotatingWord} className="bg-[#E63946] hover:bg-[#d32f3d]">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <ul className="space-y-2">
              {heroData.rotatingWords.map((word, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3"
                >
                  <span className="text-white">{word}</span>
                  <button onClick={() => removeRotatingWord(index)} className="text-[#888] hover:text-[#E63946]">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
