"use client"

import { AdminThemeProvider } from "@/hooks/use-admin-theme"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminThemeProvider>
      {children}
    </AdminThemeProvider>
  )
}
