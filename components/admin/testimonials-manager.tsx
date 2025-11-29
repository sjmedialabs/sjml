"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save, Star } from "lucide-react"

interface Testimonial {
  id: string
  quote: string
  author: string
  image: string
  rating: number
}

export function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: "1",
      quote: "This is due to their excellent service, competitive pricing and customer support.",
      author: "Archana, MediTravel",
      image: "",
      rating: 5,
    },
    {
      id: "2",
      quote: "Working with SJ Media Labs transformed our brand presence.",
      author: "Michael Chen, TechVentures",
      image: "",
      rating: 5,
    },
  ])

  const addTestimonial = () => {
    setTestimonials([...testimonials, { id: Date.now().toString(), quote: "", author: "", image: "", rating: 5 }])
  }

  const updateTestimonial = (id: string, field: keyof Testimonial, value: string | number) => {
    setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, [field]: value } : t)))
  }

  const removeTestimonial = (id: string) => {
    setTestimonials(testimonials.filter((t) => t.id !== id))
  }

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken")
    try {
      await fetch("/api/content/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ testimonials }),
      })
      alert("Testimonials saved successfully!")
    } catch (error) {
      alert("Failed to save testimonials")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Testimonials</h1>
          <p className="text-[#888]">Manage client testimonials displayed on your homepage.</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={addTestimonial}
            variant="outline"
            className="border-[#333] text-white hover:bg-[#1a1a1a] bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </Button>
          <Button onClick={handleSave} className="bg-[#E63946] hover:bg-[#d32f3d] text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="bg-[#111] border-[#222]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">{testimonial.author || "New Testimonial"}</CardTitle>
              <button onClick={() => removeTestimonial(testimonial.id)} className="text-[#888] hover:text-[#E63946]">
                <Trash2 className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Quote</Label>
                <Textarea
                  value={testimonial.quote}
                  onChange={(e) => updateTestimonial(testimonial.id, "quote", e.target.value)}
                  className="bg-[#1a1a1a] border-[#333] text-white min-h-[100px]"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Author Name & Company</Label>
                  <Input
                    value={testimonial.author}
                    onChange={(e) => updateTestimonial(testimonial.id, "author", e.target.value)}
                    placeholder="e.g., John Doe, Company"
                    className="bg-[#1a1a1a] border-[#333] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Image URL</Label>
                  <Input
                    value={testimonial.image}
                    onChange={(e) => updateTestimonial(testimonial.id, "image", e.target.value)}
                    className="bg-[#1a1a1a] border-[#333] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Rating (1-5)</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => updateTestimonial(testimonial.id, "rating", star)}
                        className={`p-1 ${star <= testimonial.rating ? "text-yellow-400" : "text-[#333]"}`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
