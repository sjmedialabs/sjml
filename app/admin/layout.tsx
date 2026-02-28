"use client"

// Admin layout doesn't need its own ThemeProvider anymore
// It inherits from the root layout's ThemeProvider
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
