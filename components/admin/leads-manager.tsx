"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Download, RefreshCw, Filter, Plus, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  subject?: string
  message: string
  source: string
  status: "new" | "contacted" | "qualified" | "converted" | "lost"
  createdAt: string
  notes?: string
  campaign?: string
  adSet?: string
  adName?: string
  platform?: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [message, setMessage] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    source: "manual",
    campaign: "",
    platform: "",
  })

  useEffect(() => {
    fetchLeads()
  }, [pagination.page, filter, sourceFilter])

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      let url = `/api/leads?page=${pagination.page}&limit=${pagination.limit}`
      if (filter !== "all") url += `&status=${filter}`
      if (sourceFilter !== "all") url += `&source=${sourceFilter}`

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setLeads(data.leads || [])
        setPagination(data.pagination || pagination)
      }
    } catch (error) {
      console.error("Failed to fetch leads")
    }
    setLoading(false)
  }

  const updateLeadStatus = async (id: string, status: Lead["status"]) => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)))
        if (selectedLead?.id === id) {
          setSelectedLead({ ...selectedLead, status })
        }
        setMessage("Lead status updated!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch {
      setMessage("Failed to update lead")
    }
  }

  const updateLeadNotes = async (id: string, notes: string) => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes }),
      })
      if (res.ok) {
        setLeads(leads.map((l) => (l.id === id ? { ...l, notes } : l)))
        setMessage("Notes saved!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch {
      setMessage("Failed to save notes")
    }
  }

  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setLeads(leads.filter((l) => l.id !== id))
        setSelectedLead(null)
        setMessage("Lead deleted!")
        setTimeout(() => setMessage(""), 3000)
        fetchLeads()
      }
    } catch {
      setMessage("Failed to delete lead")
    }
  }

  const addLead = async () => {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      })
      if (res.ok) {
        fetchLeads()
        setShowAddModal(false)
        setNewLead({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          source: "manual",
          campaign: "",
          platform: "",
        })
        setMessage("Lead added successfully!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch {
      setMessage("Failed to add lead")
    }
  }

  const exportLeads = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/leads?all=true", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        const allLeads = data.leads || data

        const csv = [
          ["Name", "Email", "Phone", "Subject", "Source", "Platform", "Campaign", "Status", "Date"].join(","),
          ...allLeads.map((lead: Lead) =>
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
    } catch (error) {
      setMessage("Failed to export leads")
    }
  }

  // Filter leads by search term locally
  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const statusColors: Record<Lead["status"], string> = {
    new: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    contacted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    qualified: "bg-purple-500/20 text-purple-400 border-purple-500/50",
    converted: "bg-green-500/20 text-green-400 border-green-500/50",
    lost: "bg-red-500/20 text-red-400 border-red-500/50",
  }

  const sourceColors: Record<string, string> = {
    website_popup: "bg-blue-500/20 text-blue-400",
    contact_form: "bg-green-500/20 text-green-400",
    meta_ads: "bg-purple-500/20 text-purple-400",
    google_ads: "bg-yellow-500/20 text-yellow-400",
    manual: "bg-gray-500/20 text-gray-400",
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
        return "Manual"
      default:
        return source
    }
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Leads Management</h1>
          <p className="text-[#888]">Track and manage leads from website, Meta Ads, and Google Ads</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLeads}
            className="border-[#333] text-gray-300 hover:bg-[#222] bg-transparent"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportLeads}
            className="border-[#333] text-gray-300 hover:bg-[#222] bg-transparent"
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="bg-[#E63946] hover:bg-[#d32f3d] text-white"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Lead
          </Button>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{message}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-[#111] border border-[#222] rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{pagination.total}</div>
          <div className="text-sm text-[#888]">Total Leads</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-400">{leads.filter((l) => l.status === "new").length}</div>
          <div className="text-sm text-[#888]">New</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-xl p-4">
          <div className="text-2xl font-bold text-yellow-400">
            {leads.filter((l) => l.status === "contacted").length}
          </div>
          <div className="text-sm text-[#888]">Contacted</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-xl p-4">
          <div className="text-2xl font-bold text-purple-400">
            {leads.filter((l) => l.status === "qualified").length}
          </div>
          <div className="text-sm text-[#888]">Qualified</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-xl p-4">
          <div className="text-2xl font-bold text-green-400">
            {leads.filter((l) => l.status === "converted").length}
          </div>
          <div className="text-sm text-[#888]">Converted</div>
        </div>
      </div>

      {/* Integration Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
        <h4 className="text-blue-400 font-medium mb-2">Meta & Google Ads Integration</h4>
        <p className="text-gray-400 text-sm">
          To automatically receive leads from ad campaigns, configure webhooks to send data to:{" "}
          <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#E63946]">/api/leads/webhook</code>
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#1a1a1a] border-[#333] text-white w-64"
          />
        </div>
        <div className="flex gap-2">
          {["all", "new", "contacted", "qualified", "converted", "lost"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status)
                setPagination((p) => ({ ...p, page: 1 }))
              }}
              className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                filter === status ? "bg-[#E63946] text-white" : "bg-[#1a1a1a] text-[#888] hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <Select
          value={sourceFilter}
          onValueChange={(v) => {
            setSourceFilter(v)
            setPagination((p) => ({ ...p, page: 1 }))
          }}
        >
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
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads Table */}
      <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#222]">
              <th className="text-left p-4 text-[#888] font-medium">Name</th>
              <th className="text-left p-4 text-[#888] font-medium">Email</th>
              <th className="text-left p-4 text-[#888] font-medium">Phone</th>
              <th className="text-left p-4 text-[#888] font-medium">Source</th>
              <th className="text-left p-4 text-[#888] font-medium">Status</th>
              <th className="text-left p-4 text-[#888] font-medium">Date</th>
              <th className="text-right p-4 text-[#888] font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-[#E63946]/30 border-t-[#E63946] rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#666]">
                  No leads found
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-[#222] hover:bg-[#1a1a1a]">
                  <td className="p-4">
                    <div className="text-white font-medium">{lead.name}</div>
                    {lead.company && <div className="text-[#666] text-sm">{lead.company}</div>}
                  </td>
                  <td className="p-4">
                    <a href={`mailto:${lead.email}`} className="text-[#888] hover:text-[#E63946]">
                      {lead.email}
                    </a>
                  </td>
                  <td className="p-4 text-[#888]">{lead.phone || "-"}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${sourceColors[lead.source] || "bg-gray-500/20 text-gray-400"}`}
                    >
                      {formatSource(lead.source)}
                    </span>
                  </td>
                  <td className="p-4">
                    <Select value={lead.status} onValueChange={(value) => updateLeadStatus(lead.id, value as Lead["status"])}>
                      <SelectTrigger className={`w-32 h-8 text-xs border ${statusColors[lead.status]}`}>
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
                  </td>
                  <td className="p-4 text-[#888] text-sm">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLead(lead)}
                        className="text-gray-400 hover:text-white"
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLead(lead.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-[#222]">
            <div className="text-sm text-[#888]">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                className="border-[#333] text-gray-300 hover:bg-[#222] bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-3 py-1 text-white">
                {pagination.page} / {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                className="border-[#333] text-gray-300 hover:bg-[#222] bg-transparent"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Lead Details Modal */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="bg-[#111] border-[#222] text-white max-w-3xl">
          {selectedLead && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-white">{selectedLead.name}</DialogTitle>
                <p className="text-[#888] text-sm">Submitted on {new Date(selectedLead.createdAt).toLocaleDateString()}</p>
              </DialogHeader>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#0a0a0a] rounded-lg">
                  <div className="text-xs text-[#666] mb-1">Email</div>
                  <a href={`mailto:${selectedLead.email}`} className="text-white hover:text-[#E63946]">
                    {selectedLead.email}
                  </a>
                </div>
                <div className="p-4 bg-[#0a0a0a] rounded-lg">
                  <div className="text-xs text-[#666] mb-1">Phone</div>
                  <a href={`tel:${selectedLead.phone}`} className="text-white hover:text-[#E63946]">
                    {selectedLead.phone || "Not provided"}
                  </a>
                </div>
                <div className="p-4 bg-[#0a0a0a] rounded-lg">
                  <div className="text-xs text-[#666] mb-1">Source</div>
                  <span
                    className={`px-2 py-1 rounded text-sm ${sourceColors[selectedLead.source] || "bg-gray-500/20 text-gray-400"}`}
                  >
                    {formatSource(selectedLead.source)}
                  </span>
                </div>
                <div className="p-4 bg-[#0a0a0a] rounded-lg">
                  <div className="text-xs text-[#666] mb-1">Subject</div>
                  <div className="text-white">{selectedLead.subject || "Not provided"}</div>
                </div>
              </div>

              {/* Campaign Info */}
              {(selectedLead.campaign || selectedLead.platform) && (
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <div className="text-xs text-purple-400 mb-2 font-medium">Campaign Information</div>
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
                  </div>
                </div>
              )}

              {/* Message */}
              <div className="p-4 bg-[#0a0a0a] rounded-lg">
                <div className="text-xs text-[#666] mb-2">Message</div>
                <p className="text-white whitespace-pre-wrap">{selectedLead.message}</p>
              </div>

              {/* Status */}
              <div>
                <div className="text-sm text-[#888] mb-2">Status</div>
                <div className="flex gap-2 flex-wrap">
                  {(["new", "contacted", "qualified", "converted", "lost"] as Lead["status"][]).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateLeadStatus(selectedLead.id, status)
                        setSelectedLead({ ...selectedLead, status })
                      }}
                      className={`px-4 py-2 rounded-lg text-sm capitalize border transition-colors ${
                        selectedLead.status === status
                          ? statusColors[status]
                          : "border-[#333] text-[#888] hover:text-white hover:border-[#555]"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <div className="text-sm text-[#888] mb-2">Internal Notes</div>
                <Textarea
                  value={selectedLead.notes || ""}
                  onChange={(e) => setSelectedLead({ ...selectedLead, notes: e.target.value })}
                  onBlur={() => selectedLead.notes && updateLeadNotes(selectedLead.id, selectedLead.notes)}
                  className="bg-[#0a0a0a] border-[#333] text-white"
                  placeholder="Add internal notes about this lead..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => deleteLead(selectedLead.id)}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                >
                  Delete Lead
                </Button>
                <Button onClick={() => setSelectedLead(null)} className="bg-[#E63946] hover:bg-[#d32f3d]">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Lead Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-[#111] border-[#222] text-white">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Name *"
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                className="bg-[#0a0a0a] border-[#333] text-white"
              />
              <Input
                placeholder="Email *"
                type="email"
                value={newLead.email}
                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                className="bg-[#0a0a0a] border-[#333] text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Phone"
                value={newLead.phone}
                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                className="bg-[#0a0a0a] border-[#333] text-white"
              />
              <Select value={newLead.source} onValueChange={(v) => setNewLead({ ...newLead, source: v })}>
                <SelectTrigger className="bg-[#0a0a0a] border-[#333] text-white">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#333]">
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="meta_ads">Meta Ads</SelectItem>
                  <SelectItem value="google_ads">Google Ads</SelectItem>
                  <SelectItem value="contact_form">Contact Form</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Subject"
              value={newLead.subject}
              onChange={(e) => setNewLead({ ...newLead, subject: e.target.value })}
              className="bg-[#0a0a0a] border-[#333] text-white"
            />
            <Textarea
              placeholder="Message"
              value={newLead.message}
              onChange={(e) => setNewLead({ ...newLead, message: e.target.value })}
              className="bg-[#0a0a0a] border-[#333] text-white"
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Platform (e.g., Facebook)"
                value={newLead.platform}
                onChange={(e) => setNewLead({ ...newLead, platform: e.target.value })}
                className="bg-[#0a0a0a] border-[#333] text-white"
              />
              <Input
                placeholder="Campaign Name"
                value={newLead.campaign}
                onChange={(e) => setNewLead({ ...newLead, campaign: e.target.value })}
                className="bg-[#0a0a0a] border-[#333] text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
                className="border-[#333] text-gray-300 hover:bg-[#222] bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={addLead}
                disabled={!newLead.name || !newLead.email}
                className="bg-[#E63946] hover:bg-[#d32f3d]"
              >
                Add Lead
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
