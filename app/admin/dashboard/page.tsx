"use client"

import { Suspense } from "react"
import AdminDashboardContent from "./dashboard-content"

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#E63946]/30 border-t-[#E63946] rounded-full animate-spin" />
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  )
}
