"use client"

import { createContext, useContext } from "react"
import type { NormalizedHeaderContent } from "@/lib/header-content"

const HeaderContentContext = createContext<NormalizedHeaderContent | null>(null)

export function HeaderProvider({
  value,
  children,
}: {
  value: NormalizedHeaderContent
  children: React.ReactNode
}) {
  return <HeaderContentContext.Provider value={value}>{children}</HeaderContentContext.Provider>
}

export function useProvidedHeader() {
  return useContext(HeaderContentContext)
}
