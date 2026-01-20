"use client"

import { useEffect, useState } from "react"
import { FileText, Users, Eye, TrendingUp, BarChart3, MessageSquare, Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardStats {
  totalPages: { value: string; change: string }
  caseStudies: { value: string; change: string }
  services: { value: string; change: string }
  leads: { value: string; change: string }
  insights: { value: string; change: string }
  testimonials: { value: string; change: string }
  conversionRate: { value: string; change: string }
}

interface Activity {
  action: string
  time: string
  user: string
}

const statIcons = {
  totalPages: FileText,
  caseStudies: Briefcase,
  services: BarChart3,
  leads: Users,
  insights: Eye,
  testimonials: MessageSquare,
  conversionRate: TrendingUp,
}

const statLabels = {
  totalPages: "Total Pages",
  caseStudies: "Case Studies",
  services: "Services",
  leads: "Total Leads",
  insights: "Insights",
  testimonials: "Testimonials",
  conversionRate: "Conversion Rate",
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchDashboardStats()
    }
  }, [mounted])

  const fetchDashboardStats = async () => {
    try {
      // Only access localStorage on client side
      if (typeof window === "undefined") {
        return
      }

      const token = localStorage.getItem("adminToken")
      if (!token) {
        setError("Not authenticated")
        setLoading(false)
        return
      }

      const response = await fetch("/api/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please login again.")
        } else {
          throw new Error("Failed to fetch dashboard stats")
        }
        setLoading(false)
        return
      }

      const data = await response.json()
      setStats(data.stats)
      setRecentActivity(data.recentActivity)
      setError(null)
    } catch (err) {
      console.error("Error fetching dashboard stats:", err)
      setError("Failed to load dashboard statistics")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted || loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold admin-text-primary mb-2">Dashboard Overview</h1>
          <p className="admin-text-secondary">Loading dashboard statistics...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="admin-card">
              <CardContent className="pt-6">
                <div className="h-20 bg-gray-800 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold admin-text-primary mb-2">Dashboard Overview</h1>
          <div className="admin-card p-6 mt-4">
            <p className="admin-text-secondary text-red-500 mb-4">{error}</p>
            {error.includes("authenticated") || error.includes("Session expired") ? (
              <button
                onClick={() => window.location.href = "/admin/login"}
                className="px-4 py-2 bg-[#E63946] text-white rounded-lg hover:bg-[#E63946]/90 transition-colors"
              >
                Go to Login
              </button>
            ) : (
              <button
                onClick={() => {
                  setLoading(true)
                  setError(null)
                  fetchDashboardStats()
                }}
                className="px-4 py-2 bg-[#E63946] text-white rounded-lg hover:bg-[#E63946]/90 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold admin-text-primary mb-2">Dashboard Overview</h1>
          <p className="admin-text-secondary text-yellow-500">No statistics available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold admin-text-primary mb-2">Dashboard Overview</h1>
        <p className="admin-text-secondary">Welcome back! Here's what's happening with your website.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(stats).map(([key, stat]) => {
          const Icon = statIcons[key as keyof typeof statIcons]
          const label = statLabels[key as keyof typeof statLabels]
          return (
            <Card key={key} className="admin-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium admin-text-secondary">{label}</CardTitle>
                <Icon className="w-4 h-4 text-[#E63946]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold admin-text-primary">{stat.value}</div>
                <p className="text-xs admin-text-muted mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Content Sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="admin-card-title">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {[
              { label: "Edit Hero Section", section: "home" },
              { label: "Add Case Study", section: "case-studies" },
              { label: "Update Services", section: "services" },
              { label: "Manage Leads", section: "leads" },
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  window.location.href = `/admin/dashboard?section=${action.section}`
                }}
                className="p-4 admin-bg-secondary hover:bg-opacity-80 border admin-border-light rounded-lg admin-text-primary text-sm text-left transition-colors"
              >
                {action.label}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="admin-card-title">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <ul className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between border-b admin-border pb-3 last:border-0"
                  >
                    <div>
                      <p className="admin-text-primary text-sm">{activity.action}</p>
                      <p className="admin-text-muted text-xs">{activity.user}</p>
                    </div>
                    <span className="admin-text-secondary text-xs">{activity.time}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-text-muted text-sm">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
