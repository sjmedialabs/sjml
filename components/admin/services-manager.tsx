"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"
import { ImageUpload } from "@/components/admin/image-upload"

interface Service {
  id: string
  title: string
  description: string
  icon: string
  image: string
  slug?: string
  linkText?: string
  isActive?: boolean
}

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services?all=true")
      if (res.ok) {
        const data = await res.json()
        setServices(data || [])
      }
    } catch (error) {
      console.error("Failed to fetch services:", error)
    }
    setLoading(false)
  }

  const addService = () => {
    setServices([...services, { id: Date.now().toString(), title: "", description: "", icon: "", image: "" }])
  }

  const updateService = (id: string, field: keyof Service, value: string) => {
    setServices(services.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const removeService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return
    
    const token = localStorage.getItem("adminToken")
    try {
      if (id && id.length > 5) {
        // Delete from database if it exists
        await fetch(`/api/services/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      setServices(services.filter((s) => s.id !== id))
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete service")
    }
  }

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken")
    
    // Save each service individually
    try {
      const promises = services.map(async (service) => {
        if (service.id && service.id.length > 5) {
          // Update existing service
          return fetch(`/api/services/${service.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(service),
          })
        } else {
          // Create new service
          return fetch("/api/services", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(service),
          })
        }
      })
      
      await Promise.all(promises)
      alert("Services saved successfully!")
      await fetchServices() // Refresh data after save
    } catch (error) {
      console.error("Save error:", error)
      alert("Failed to save services")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#E63946]/30 border-t-[#E63946] rounded-full animate-spin" />
      </div>
    )
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
                <Label className="text-white">Slug (URL)</Label>
                <Input
                  value={service.slug || ""}
                  onChange={(e) => updateService(service.id, "slug", e.target.value)}
                  placeholder="e.g., digital-marketing"
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
              <div className="space-y-2">
                <Label className="text-white">Service Icon</Label>
                <ImageUpload
                  value={service.icon}
                  onChange={(url) => updateService(service.id, "icon", url)}
                  label=""
                  maxSizeMB={1}
                  maxWidth={512}
                  maxHeight={512}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Service Image</Label>
                <ImageUpload
                  value={service.image}
                  onChange={(url) => updateService(service.id, "image", url)}
                  label=""
                  maxSizeMB={2}
                  maxWidth={1920}
                  maxHeight={1080}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
