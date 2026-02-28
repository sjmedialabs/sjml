"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for saved theme preference (unified key for both admin and website)
    const savedTheme = localStorage.getItem("site-theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Set default to light mode
      setTheme("light")
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      const root = document.documentElement
      if (theme === "light") {
        root.classList.add("light")
        root.classList.remove("dark")
      } else {
        root.classList.add("dark")
        root.classList.remove("light")
      }
      localStorage.setItem("site-theme", theme)
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

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
