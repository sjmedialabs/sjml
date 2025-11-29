"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save } from "lucide-react"

export function FooterManager() {
  const [footerData, setFooterData] = useState({
    address: "Studio Office, Building 18\n123 Innovation Way, 2nd Floor, Suite 450\nPalo Alto, CA 94301",
    phone: "123-456-7890",
    email: "support@sjmedialabs.com",
    copyright: "© 2025 sjmedialabs All Rights Reserved",
    newsletterText: "Subscribe for the latest news, insights and exclusive updates from our agency.",
  })

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken")
    try {
      await fetch("/api/content/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(footerData),
      })
      alert("Footer saved successfully!")
    } catch (error) {
      alert("Failed to save footer")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Footer</h1>
          <p className="text-[#888]">Manage footer content and contact information.</p>
        </div>
        <Button onClick={handleSave} className="bg-[#E63946] hover:bg-[#d32f3d] text-white">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-[#111] border-[#222]">
          <CardHeader>
            <CardTitle className="text-white">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Address</Label>
              <Textarea
                value={footerData.address}
                onChange={(e) => setFooterData({ ...footerData, address: e.target.value })}
                className="bg-[#1a1a1a] border-[#333] text-white min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Phone</Label>
              <Input
                value={footerData.phone}
                onChange={(e) => setFooterData({ ...footerData, phone: e.target.value })}
                className="bg-[#1a1a1a] border-[#333] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Email</Label>
              <Input
                value={footerData.email}
                onChange={(e) => setFooterData({ ...footerData, email: e.target.value })}
                className="bg-[#1a1a1a] border-[#333] text-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-[#222]">
          <CardHeader>
            <CardTitle className="text-white">Other Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Copyright Text</Label>
              <Input
                value={footerData.copyright}
                onChange={(e) => setFooterData({ ...footerData, copyright: e.target.value })}
                className="bg-[#1a1a1a] border-[#333] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Newsletter Description</Label>
              <Textarea
                value={footerData.newsletterText}
                onChange={(e) => setFooterData({ ...footerData, newsletterText: e.target.value })}
                className="bg-[#1a1a1a] border-[#333] text-white"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
