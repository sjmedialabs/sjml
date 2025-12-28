"use client"

import { Suspense } from "react"
import AdminDashboardContent from "./dashboard-content"

interface DashboardWrapperProps {
  section?: string
}

export default function DashboardWrapper({ section }: DashboardWrapperProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#E63946]/30 border-t-[#E63946] rounded-full animate-spin" />
        </div>
      }
    >
      <AdminDashboardContent initialSection={section} />
    </Suspense>
  )
}
