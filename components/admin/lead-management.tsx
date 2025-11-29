"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Eye, Trash2, Download, RefreshCw, Filter, Plus } from "lucide-react"

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  source: string
  createdAt: string
  status: string
  campaign?: string
  adSet?: string
  adName?: string
  platform?: string
}

interface LeadManagementProps {
  token: string
}

export function LeadManagement({ token }: LeadManagementProps) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showAddManual, setShowAddManual] = useState(false)
  const [manualLead, setManualLead] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    source: "manual",
    platform: "",
    campaign: "",
  })

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/leads", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setLeads(data)
        setFilteredLeads(data)
      }
    } catch (error) {
      console.error("Error fetching leads:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [token])

  useEffect(() => {
    let filtered = [...leads]

    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.phone?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === statusFilter)
    }

    if (sourceFilter !== "all") {
      filtered = filtered.filter((lead) => lead.source === sourceFilter)
    }

    setFilteredLeads(filtered)
  }, [leads, searchTerm, statusFilter, sourceFilter])

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        setLeads(leads.map((lead) => (lead.id === id ? { ...lead, status } : lead)))
      }
    } catch (error) {
      console.error("Error updating lead:", error)
    }
  }

  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        setLeads(leads.filter((lead) => lead.id !== id))
      }
    } catch (error) {
      console.error("Error deleting lead:", error)
    }
  }

  const addManualLead = async () => {
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualLead),
      })
      if (response.ok) {
        fetchLeads()
        setShowAddManual(false)
        setManualLead({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          source: "manual",
          platform: "",
          campaign: "",
        })
      }
    } catch (error) {
      console.error("Error adding lead:", error)
    }
  }

  const exportLeads = () => {
    const csv = [
      ["Name", "Email", "Phone", "Subject", "Source", "Platform", "Campaign", "Status", "Date"].join(","),
      ...filteredLeads.map((lead) =>
        [
          lead.name,
          lead.email,
          lead.phone || "",
          lead.subject || "",
          lead.source,
          lead.platform || "",
          lead.campaign || "",
          lead.status,
          new Date(lead.createdAt).toLocaleDateString(),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case "website_popup":
        return "bg-blue-500/20 text-blue-400"
      case "contact_form":
        return "bg-green-500/20 text-green-400"
      case "meta_ads":
        return "bg-purple-500/20 text-purple-400"
      case "google_ads":
        return "bg-yellow-500/20 text-yellow-400"
      case "manual":
        return "bg-gray-500/20 text-gray-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-[#E63946]/20 text-[#E63946]"
      case "contacted":
        return "bg-blue-500/20 text-blue-400"
      case "qualified":
        return "bg-green-500/20 text-green-400"
      case "converted":
        return "bg-emerald-500/20 text-emerald-400"
      case "lost":
        return "bg-gray-500/20 text-gray-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const formatSource = (source: string) => {
    switch (source) {
      case "website_popup":
        return "Website Popup"
      case "contact_form":
        return "Contact Form"
      case "meta_ads":
        return "Meta Ads"
      case "google_ads":
        return "Google Ads"
      case "manual":
        return "Manual Entry"
      default:
        return source
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total Leads</p>
          <p className="text-2xl font-bold text-white">{leads.length}</p>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <p className="text-gray-400 text-sm">New</p>
          <p className="text-2xl font-bold text-[#E63946]">{leads.filter((l) => l.status === "new").length}</p>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <p className="text-gray-400 text-sm">Contacted</p>
          <p className="text-2xl font-bold text-blue-400">{leads.filter((l) => l.status === "contacted").length}</p>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <p className="text-gray-400 text-sm">Qualified</p>
          <p className="text-2xl font-bold text-green-400">{leads.filter((l) => l.status === "qualified").length}</p>
        </div>
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
          <p className="text-gray-400 text-sm">Converted</p>
          <p className="text-2xl font-bold text-emerald-400">{leads.filter((l) => l.status === "converted").length}</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#1a1a1a] border-[#333] text-white w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-[#1a1a1a] border-[#333] text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#333]">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-44 bg-[#1a1a1a] border-[#333] text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#333]">
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="website_popup">Website Popup</SelectItem>
              <SelectItem value="contact_form">Contact Form</SelectItem>
              <SelectItem value="meta_ads">Meta Ads</SelectItem>
              <SelectItem value="google_ads">Google Ads</SelectItem>
              <SelectItem value="manual">Manual Entry</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLeads}
            className="border-[#333] text-gray-300 hover:bg-[#222] bg-transparent"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportLeads}
            className="border-[#333] text-gray-300 hover:bg-[#222] bg-transparent"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            size="sm"
            onClick={() => setShowAddManual(true)}
            className="bg-[#E63946] hover:bg-[#d32f3d] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Info about Meta/Google Ads integration */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-400 font-medium mb-2">Meta & Google Ads Integration</h4>
        <p className="text-gray-400 text-sm">
          To fetch leads from Meta Ads and Google Ads campaigns, you need to set up webhook integrations. Configure your
          ad platforms to send lead data to:{" "}
          <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#E63946]">/api/leads/webhook</code>
        </p>
        <p className="text-gray-400 text-sm mt-2">
          For now, you can manually add leads from ad campaigns using the "Add Lead" button and selecting the
          appropriate source.
        </p>
      </div>

      {/* Leads Table */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading leads...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No leads found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[#333] hover:bg-transparent">
                <TableHead className="text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400">Contact</TableHead>
                <TableHead className="text-gray-400">Source</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Date</TableHead>
                <TableHead className="text-gray-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="border-[#333] hover:bg-[#222]">
                  <TableCell>
                    <div>
                      <p className="text-white font-medium">{lead.name}</p>
                      {lead.subject && <p className="text-gray-500 text-sm truncate max-w-[200px]">{lead.subject}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-gray-300 text-sm">{lead.email}</p>
                      {lead.phone && <p className="text-gray-500 text-sm">{lead.phone}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getSourceBadgeColor(lead.source)}`}>
                      {formatSource(lead.source)}
                    </span>
                    {lead.campaign && <p className="text-gray-500 text-xs mt-1">{lead.campaign}</p>}
                  </TableCell>
                  <TableCell>
                    <Select value={lead.status} onValueChange={(value) => updateLeadStatus(lead.id, value)}>
                      <SelectTrigger className={`w-32 h-8 text-xs border-0 ${getStatusBadgeColor(lead.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-[#333]">
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLead(lead)}
                        className="text-gray-400 hover:text-white hover:bg-[#333]"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLead(lead.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-[#333]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Lead Detail Modal */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="bg-[#1a1a1a] border-[#333] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white">{selectedLead.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white">{selectedLead.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Source</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getSourceBadgeColor(selectedLead.source)}`}>
                    {formatSource(selectedLead.source)}
                  </span>
                </div>
              </div>
              {selectedLead.subject && (
                <div>
                  <p className="text-gray-400 text-sm">Subject</p>
                  <p className="text-white">{selectedLead.subject}</p>
                </div>
              )}
              <div>
                <p className="text-gray-400 text-sm">Message</p>
                <p className="text-white bg-[#0d0d0d] p-3 rounded-lg">{selectedLead.message}</p>
              </div>
              {(selectedLead.campaign || selectedLead.adSet || selectedLead.adName) && (
                <div className="border-t border-[#333] pt-4">
                  <p className="text-gray-400 text-sm mb-2">Campaign Info</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {selectedLead.platform && (
                      <div>
                        <span className="text-gray-500">Platform:</span>{" "}
                        <span className="text-white">{selectedLead.platform}</span>
                      </div>
                    )}
                    {selectedLead.campaign && (
                      <div>
                        <span className="text-gray-500">Campaign:</span>{" "}
                        <span className="text-white">{selectedLead.campaign}</span>
                      </div>
                    )}
                    {selectedLead.adSet && (
                      <div>
                        <span className="text-gray-500">Ad Set:</span>{" "}
                        <span className="text-white">{selectedLead.adSet}</span>
                      </div>
                    )}
                    {selectedLead.adName && (
                      <div>
                        <span className="text-gray-500">Ad Name:</span>{" "}
                        <span className="text-white">{selectedLead.adName}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="text-gray-500 text-sm">Created: {new Date(selectedLead.createdAt).toLocaleString()}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Manual Lead Modal */}
      <Dialog open={showAddManual} onOpenChange={setShowAddManual}>
        <DialogContent className="bg-[#1a1a1a] border-[#333] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Lead Manually</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Full Name*"
                value={manualLead.name}
                onChange={(e) => setManualLead({ ...manualLead, name: e.target.value })}
                className="bg-[#0d0d0d] border-[#333] text-white"
              />
              <Input
                type="email"
                placeholder="Email*"
                value={manualLead.email}
                onChange={(e) => setManualLead({ ...manualLead, email: e.target.value })}
                className="bg-[#0d0d0d] border-[#333] text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Phone"
                value={manualLead.phone}
                onChange={(e) => setManualLead({ ...manualLead, phone: e.target.value })}
                className="bg-[#0d0d0d] border-[#333] text-white"
              />
              <Input
                placeholder="Subject"
                value={manualLead.subject}
                onChange={(e) => setManualLead({ ...manualLead, subject: e.target.value })}
                className="bg-[#0d0d0d] border-[#333] text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={manualLead.source}
                onValueChange={(value) => setManualLead({ ...manualLead, source: value })}
              >
                <SelectTrigger className="bg-[#0d0d0d] border-[#333] text-white">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#333]">
                  <SelectItem value="manual">Manual Entry</SelectItem>
                  <SelectItem value="meta_ads">Meta Ads</SelectItem>
                  <SelectItem value="google_ads">Google Ads</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Campaign Name (optional)"
                value={manualLead.campaign}
                onChange={(e) => setManualLead({ ...manualLead, campaign: e.target.value })}
                className="bg-[#0d0d0d] border-[#333] text-white"
              />
            </div>
            <Textarea
              placeholder="Message/Notes"
              value={manualLead.message}
              onChange={(e) => setManualLead({ ...manualLead, message: e.target.value })}
              className="bg-[#0d0d0d] border-[#333] text-white"
              rows={4}
            />
            <Button
              onClick={addManualLead}
              disabled={!manualLead.name || !manualLead.email}
              className="w-full bg-[#E63946] hover:bg-[#d32f3d] text-white"
            >
              Add Lead
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
