"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"

interface Service {
  id: string
  title: string
  description: string
  icon: string
  image: string
}

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      title: "Research & Strategy",
      description: "In-depth market research and strategic planning.",
      icon: "Search",
      image: "",
    },
    {
      id: "2",
      title: "Branding",
      description: "Strategic brand development and identity design.",
      icon: "Palette",
      image: "",
    },
    {
      id: "3",
      title: "Web & Experience",
      description: "User-centered web design and digital experiences.",
      icon: "Globe",
      image: "",
    },
    {
      id: "4",
      title: "Digital Marketing",
      description: "Data-driven marketing strategies.",
      icon: "BarChart3",
      image: "",
    },
  ])

  const addService = () => {
    setServices([...services, { id: Date.now().toString(), title: "", description: "", icon: "", image: "" }])
  }

  const updateService = (id: string, field: keyof Service, value: string) => {
    setServices(services.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const removeService = (id: string) => {
    setServices(services.filter((s) => s.id !== id))
  }

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken")
    try {
      await fetch("/api/content/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ services }),
      })
      alert("Services saved successfully!")
    } catch (error) {
      alert("Failed to save services")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Services</h1>
          <p className="text-[#888]">Manage the services displayed on your homepage.</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={addService}
            variant="outline"
            className="border-[#333] text-white hover:bg-[#1a1a1a] bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
          <Button onClick={handleSave} className="bg-[#E63946] hover:bg-[#d32f3d] text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="bg-[#111] border-[#222]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white text-lg">{service.title || "New Service"}</CardTitle>
              <button onClick={() => removeService(service.id)} className="text-[#888] hover:text-[#E63946]">
                <Trash2 className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Title</Label>
                <Input
                  value={service.title}
                  onChange={(e) => updateService(service.id, "title", e.target.value)}
                  className="bg-[#1a1a1a] border-[#333] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Textarea
                  value={service.description}
                  onChange={(e) => updateService(service.id, "description", e.target.value)}
                  className="bg-[#1a1a1a] border-[#333] text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Icon Name</Label>
                  <Input
                    value={service.icon}
                    onChange={(e) => updateService(service.id, "icon", e.target.value)}
                    placeholder="e.g., Search, Palette"
                    className="bg-[#1a1a1a] border-[#333] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Image URL</Label>
                  <Input
                    value={service.image}
                    onChange={(e) => updateService(service.id, "image", e.target.value)}
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
