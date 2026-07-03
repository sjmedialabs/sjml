"use client"

import { createContext, useContext, useEffect } from "react"

type Theme = "light"

type ThemeContextType = {
  theme: Theme
}

const ThemeContext = createContext<ThemeContextType>({ theme: "light" })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add("light")
    root.classList.remove("dark")
    localStorage.setItem("site-theme", "light")
  }, [])

  return <ThemeContext.Provider value={{ theme: "light" }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
