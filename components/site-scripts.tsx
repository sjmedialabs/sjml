"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { scriptMatchesPath, type SiteScript } from "@/lib/site-scripts"

function looksLikeHtml(code: string): boolean {
  return /<[a-z!/?]/i.test(code)
}

function normalizeSnippet(code: string): string {
  const trimmed = code.trim()
  if (!trimmed) return ""
  return looksLikeHtml(trimmed) ? trimmed : `<script>${trimmed}</script>`
}

function injectSnippet(script: SiteScript): () => void {
  if (typeof document === "undefined") return () => {}

  const html = normalizeSnippet(script.code)
  if (!html) return () => {}

  const parent = script.placement === "header" ? document.head : document.body
  document.querySelectorAll(`[data-cms-script="${script.id}"]`).forEach((node) => node.remove())

  const template = document.createElement("template")
  template.innerHTML = html

  const created: Node[] = []

  const appendNode = (node: Node) => {
    if (node instanceof HTMLScriptElement) {
      const next = document.createElement("script")
      for (const attr of Array.from(node.attributes)) {
        next.setAttribute(attr.name, attr.value)
      }
      if (node.textContent) next.textContent = node.textContent
      next.setAttribute("data-cms-script", script.id)
      parent.appendChild(next)
      created.push(next)
      return
    }

    if (node instanceof Element) {
      node.setAttribute("data-cms-script", script.id)
      parent.appendChild(node)
      created.push(node)
      return
    }

    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      parent.appendChild(node)
      created.push(node)
    }
  }

  Array.from(template.content.childNodes).forEach((node) => appendNode(node))

  return () => {
    created.forEach((node) => {
      node.parentNode?.removeChild(node)
    })
  }
}

export function SiteScripts({ scripts }: { scripts: SiteScript[] }) {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return

    const matching = scripts.filter((script) => scriptMatchesPath(script, pathname))
    const cleanups = matching.map((script) => injectSnippet(script))

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [pathname, scripts])

  return null
}
