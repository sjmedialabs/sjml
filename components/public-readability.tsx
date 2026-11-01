"use client"

import { useLayoutEffect } from "react"
import { usePathname } from "next/navigation"

const MIN_TEXT = 14

function flattenSvgShapes() {
  document.querySelectorAll("svg").forEach((node, index) => {
    const svg = node as SVGSVGElement
    if (svg.dataset.flat === "1") return
    if (svg.closest(".admin-content-area, .admin-sidebar")) return
    const kids = [...svg.children].filter((el) => el.tagName.toLowerCase() !== "defs")
    if (kids.length < 2) return
    const id = `icon-flat-${index}-${Math.random().toString(36).slice(2, 7)}`
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g")
    group.setAttribute("id", id)
    kids.forEach((el) => group.appendChild(el))
    defs.appendChild(group)
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use")
    use.setAttribute("href", `#${id}`)
    svg.appendChild(defs)
    svg.appendChild(use)
    svg.dataset.flat = "1"
  })
}

function unifyControlHeights() {
  document.querySelectorAll("a, button").forEach((node) => {
    const el = node as HTMLElement
    if (el.closest(".admin-content-area, .admin-sidebar")) return
    const cs = getComputedStyle(el)
    if (cs.display === "none" || cs.visibility === "hidden") return
    const height = el.getBoundingClientRect().height
    if (height < 16 || height > 96) return
    const bg = cs.backgroundColor
    const filled = bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent"
    const cls = typeof el.className === "string" ? el.className : ""
    const named = /cta|btn|button/i.test(cls) || el.getAttribute("data-slot") === "button"
    if (!filled && !named && el.tagName !== "BUTTON") return
    el.style.setProperty("height", "44px", "important")
    el.style.setProperty("min-height", "44px", "important")
    el.style.setProperty("max-height", "44px", "important")
    el.style.setProperty("padding-top", "0", "important")
    el.style.setProperty("padding-bottom", "0", "important")
    el.style.setProperty("box-sizing", "border-box", "important")
  })
}

function enforceReadableType() {
  document.querySelectorAll("main, footer, header").forEach((root) => {
    root.querySelectorAll("p, span, a, li, label, button, h1, h2, h3, h4, h5, h6, input, textarea, select").forEach((node) => {
      const el = node as HTMLElement
      if (el.closest("svg")) return
      const hasText = [...el.childNodes].some(
        (child) => child.nodeType === Node.TEXT_NODE && (child.textContent || "").trim().length > 0,
      )
      if (!hasText) return
      const size = parseFloat(getComputedStyle(el).fontSize)
      const heading = /^H[1-6]$/.test(el.tagName)
      if (!heading && Math.round(size) === 15) el.style.fontSize = `${MIN_TEXT}px`
      else if (size > 0 && size < MIN_TEXT) el.style.fontSize = `${MIN_TEXT}px`
    })
  })

  const h1 = [...document.querySelectorAll("main h1")].find((el) => el.getClientRects().length) as HTMLElement | undefined
  if (!h1) return
  const h1Size = parseFloat(getComputedStyle(h1).fontSize)
  document.querySelectorAll("main h2").forEach((node) => {
    const h2 = node as HTMLElement
    if (!h2.getClientRects().length) return
    const h2Size = parseFloat(getComputedStyle(h2).fontSize)
    if (Math.abs(h2Size - h1Size) > 1) return
    const next = Math.max(MIN_TEXT, Math.round(h1Size * 0.72))
    if (next < h1Size) h2.style.fontSize = `${next}px`
  })

  const h1After = parseFloat(getComputedStyle(h1).fontSize)
  const tooClose = [...document.querySelectorAll("main h2")].some((node) => {
    const h2 = node as HTMLElement
    if (!h2.getClientRects().length) return false
    return parseFloat(getComputedStyle(h2).fontSize) >= h1After - 1
  })
  if (tooClose) h1.style.fontSize = `${Math.round(h1After * 1.35)}px`
}

/** Keeps body copy at least 14px and gives h2 a smaller size when it matches h1. */
export function PublicReadability() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return
    const apply = () => {
      flattenSvgShapes()
      enforceReadableType()
      unifyControlHeights()
    }
    apply()
    const timer = window.setTimeout(apply, 400)
    return () => window.clearTimeout(timer)
  }, [pathname])

  return null
}
