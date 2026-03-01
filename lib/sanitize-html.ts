/**
 * Allowlist sanitizer for rich text HTML from admin.
 * Keeps only safe tags; strips scripts and event handlers.
 */
const ALLOWED = new Set(
  "p,br,strong,b,em,i,u,h2,h3,h4,ul,ol,li,a,blockquote,span,div".split(",")
)

export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== "string") return ""
  let out = html
  // Remove script and style tags and their content
  out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  out = out.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
  // Remove event handlers and javascript: in href
  out = out.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "")
  out = out.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, "")
  out = out.replace(/href\s*=\s*["']\s*javascript:[^"']*["']/gi, "href=\"\"")
  // Process tags: remove disallowed, strip dangerous attrs from allowed
  out = out.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (full, tagName, rest) => {
    const tag = tagName.toLowerCase()
    if (!ALLOWED.has(tag)) return ""
    if (full.startsWith("</")) return `</${tag}>`
    const safeAttrs: string[] = []
    if (tag === "a") {
      const hrefMatch = rest.match(/href\s*=\s*["']([^"']*)["']/i)
      const href = hrefMatch?.[1]?.trim() ?? ""
      if (href && !/^\s*javascript\s*:/i.test(href)) {
        safeAttrs.push(`href="${href.replace(/"/g, "&quot;")}"`)
      }
    }
    return `<${tag}${safeAttrs.length ? " " + safeAttrs.join(" ") : ""}>`
  })
  return out
}
