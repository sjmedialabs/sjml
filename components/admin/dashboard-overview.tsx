import { FileText, Users, Eye, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  { label: "Total Pages", value: "12", icon: FileText, change: "+2 this month" },
  { label: "Case Studies", value: "24", icon: Users, change: "+5 this month" },
  { label: "Page Views", value: "12.4K", icon: Eye, change: "+18% from last month" },
  { label: "Conversion Rate", value: "3.2%", icon: TrendingUp, change: "+0.4% from last month" },
]

const recentActivity = [
  { action: "Updated Hero Section", time: "2 hours ago", user: "Admin" },
  { action: "Added new Case Study", time: "5 hours ago", user: "Admin" },
  { action: "Modified Services content", time: "1 day ago", user: "Admin" },
  { action: "Updated Testimonial", time: "2 days ago", user: "Admin" },
]

export function DashboardOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-[#888]">Welcome back! Here's what's happening with your website.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="bg-[#111] border-[#222]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#888]">{stat.label}</CardTitle>
                <Icon className="w-4 h-4 text-[#E63946]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-[#666] mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Content Sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="bg-[#111] border-[#222]">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {["Edit Hero Section", "Add Case Study", "Update Services", "Manage Blog Posts"].map((action, index) => (
              <button
                key={index}
                className="p-4 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-lg text-white text-sm text-left transition-colors"
              >
                {action}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-[#111] border-[#222]">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivity.map((activity, index) => (
                <li key={index} className="flex items-center justify-between border-b border-[#222] pb-3 last:border-0">
                  <div>
                    <p className="text-white text-sm">{activity.action}</p>
                    <p className="text-[#666] text-xs">{activity.user}</p>
                  </div>
                  <span className="text-[#888] text-xs">{activity.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
