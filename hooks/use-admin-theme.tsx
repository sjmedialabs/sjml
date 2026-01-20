"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("admin-theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      const root = document.documentElement
      if (theme === "light") {
        root.classList.add("admin-light")
      } else {
        root.classList.remove("admin-light")
      }
      localStorage.setItem("admin-theme", theme)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useAdminTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider")
  }
  return context
}
