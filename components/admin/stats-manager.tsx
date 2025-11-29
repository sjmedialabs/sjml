"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save, GripVertical } from "lucide-react"

interface Stat {
  id: string
  value: string
  label: string
}

export function StatsManager() {
  const [stats, setStats] = useState<Stat[]>([
    { id: "1", value: "500+", label: "Projects Completed" },
    { id: "2", value: "95%", label: "Client NPS Score" },
    { id: "3", value: "12+", label: "Years in Business" },
    { id: "4", value: "40+", label: "Countries Served" },
  ])

  const addStat = () => {
    setStats([...stats, { id: Date.now().toString(), value: "", label: "" }])
  }

  const updateStat = (id: string, field: "value" | "label", newValue: string) => {
    setStats(stats.map((stat) => (stat.id === id ? { ...stat, [field]: newValue } : stat)))
  }

  const removeStat = (id: string) => {
    setStats(stats.filter((stat) => stat.id !== id))
  }

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken")
    try {
      await fetch("/api/content/stats", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stats }),
      })
      alert("Statistics saved successfully!")
    } catch (error) {
      alert("Failed to save statistics")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Statistics</h1>
          <p className="text-[#888]">Manage the statistics displayed on your homepage.</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={addStat}
            variant="outline"
            className="border-[#333] text-white hover:bg-[#1a1a1a] bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Stat
          </Button>
          <Button onClick={handleSave} className="bg-[#E63946] hover:bg-[#d32f3d] text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <Card key={stat.id} className="bg-[#111] border-[#222]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-[#666] cursor-grab" />
                <CardTitle className="text-white text-lg">Statistic</CardTitle>
              </div>
              <button onClick={() => removeStat(stat.id)} className="text-[#888] hover:text-[#E63946]">
                <Trash2 className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Value</Label>
                <Input
                  value={stat.value}
                  onChange={(e) => updateStat(stat.id, "value", e.target.value)}
                  placeholder="e.g., 500+"
                  className="bg-[#1a1a1a] border-[#333] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Label</Label>
                <Input
                  value={stat.label}
                  onChange={(e) => updateStat(stat.id, "label", e.target.value)}
                  placeholder="e.g., Projects Completed"
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
