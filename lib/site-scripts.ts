export const ALL_PAGES_ID = "all"
export const MAX_SCRIPT_CODE_LENGTH = 100_000
export const MAX_SCRIPTS = 50

export type ScriptPlacement = "header" | "footer"

export interface SitePageOption {
  id: string
  label: string
  path: string
}

export interface SiteScript {
  id: string
  name: string
  placement: ScriptPlacement
  pages: string[]
  code: string
  enabled: boolean
}

export interface ScriptsContent {
  pageKey: "scripts"
  scripts: SiteScript[]
}

export const SITE_PAGES: SitePageOption[] = [
  { id: ALL_PAGES_ID, label: "All pages", path: "*" },
  { id: "home", label: "Home", path: "/" },
  { id: "about", label: "About", path: "/about" },
  { id: "services", label: "Services", path: "/services" },
  { id: "industries", label: "Industries", path: "/industries" },
  { id: "work", label: "Work", path: "/work" },
  { id: "case-studies", label: "Case Studies", path: "/case-studies" },
  { id: "insights", label: "Insights", path: "/insights" },
  { id: "clients", label: "Clients", path: "/clients" },
  { id: "testimonials", label: "Testimonials", path: "/testimonials" },
  { id: "careers", label: "Careers", path: "/careers" },
  { id: "contact", label: "Contact", path: "/contact" },
  { id: "privacy", label: "Privacy", path: "/privacy" },
  { id: "terms", label: "Terms", path: "/terms" },
  { id: "cookies", label: "Cookies", path: "/cookies" },
  { id: "digital-marketing-form", label: "Digital Marketing Form", path: "/digital-marketing-requirement-form" },
  { id: "restaurant-marketing-form", label: "Restaurant Marketing Form", path: "/restaurant-marketing-requirement-form" },
]

const VALID_PAGE_IDS = new Set(SITE_PAGES.map((page) => page.id))
const PAGE_BY_ID = new Map(SITE_PAGES.map((page) => [page.id, page]))

export function getPageLabel(pageId: string): string {
  return PAGE_BY_ID.get(pageId)?.label ?? pageId
}

export function isValidPageId(pageId: string): boolean {
  return VALID_PAGE_IDS.has(pageId)
}

export function createEmptyScript(placement: ScriptPlacement): SiteScript {
  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `script-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

  return {
    id,
    name: "",
    placement,
    pages: [],
    code: "",
    enabled: true,
  }
}

export function normalizePages(pages: unknown): string[] {
  if (!Array.isArray(pages)) return []

  const unique: string[] = []
  for (const page of pages) {
    if (typeof page !== "string" || !isValidPageId(page) || unique.includes(page)) continue
    unique.push(page)
  }

  if (unique.includes(ALL_PAGES_ID)) return [ALL_PAGES_ID]
  return unique
}

export function normalizeScript(input: unknown, fallbackPlacement: ScriptPlacement = "header"): SiteScript | null {
  if (!input || typeof input !== "object") return null
  const raw = input as Record<string, unknown>
  const id = typeof raw.id === "string" && raw.id.trim() ? raw.id.trim() : createEmptyScript(fallbackPlacement).id
  const placement: ScriptPlacement = raw.placement === "footer" ? "footer" : "header"
  const code = typeof raw.code === "string" ? raw.code : ""

  return {
    id,
    name: typeof raw.name === "string" ? raw.name : "",
    placement,
    pages: normalizePages(raw.pages),
    code: code.slice(0, MAX_SCRIPT_CODE_LENGTH),
    enabled: raw.enabled !== false,
  }
}

export function normalizeScripts(input: unknown): SiteScript[] {
  const list = Array.isArray(input)
    ? input
    : input && typeof input === "object" && Array.isArray((input as { scripts?: unknown }).scripts)
      ? (input as { scripts: unknown[] }).scripts
      : []

  return list
    .map((item) => normalizeScript(item))
    .filter((item): item is SiteScript => Boolean(item))
    .slice(0, MAX_SCRIPTS)
}

export function getUsedPageIds(
  scripts: SiteScript[],
  placement: ScriptPlacement,
  excludeId?: string,
): Set<string> {
  const used = new Set<string>()
  for (const script of scripts) {
    if (script.placement !== placement) continue
    if (excludeId && script.id === excludeId) continue
    for (const pageId of script.pages) used.add(pageId)
  }
  return used
}

export function getAvailablePages(
  scripts: SiteScript[],
  placement: ScriptPlacement,
  excludeId?: string,
): SitePageOption[] {
  const used = getUsedPageIds(scripts, placement, excludeId)
  if (used.has(ALL_PAGES_ID)) return []

  const anySpecificTaken = SITE_PAGES.some((page) => page.id !== ALL_PAGES_ID && used.has(page.id))

  return SITE_PAGES.filter((page) => {
    if (page.id === ALL_PAGES_ID) return !anySpecificTaken
    return !used.has(page.id)
  })
}

export function getDropdownPages(
  scripts: SiteScript[],
  placement: ScriptPlacement,
  currentScriptId: string,
  currentPages: string[],
): SitePageOption[] {
  const available = getAvailablePages(scripts, placement, currentScriptId)
  const availableIds = new Set(available.map((page) => page.id))

  return SITE_PAGES.filter((page) => currentPages.includes(page.id) || availableIds.has(page.id))
}

export function canAddScript(scripts: SiteScript[], placement: ScriptPlacement): boolean {
  return getAvailablePages(scripts, placement).length > 0
}

export function scriptMatchesPath(script: SiteScript, pathname: string): boolean {
  if (!script.enabled || !script.code.trim()) return false
  if (script.pages.includes(ALL_PAGES_ID)) return true

  return script.pages.some((pageId) => {
    const page = PAGE_BY_ID.get(pageId)
    if (!page || page.id === ALL_PAGES_ID) return false
    if (page.path === "/") return pathname === "/"
    return pathname === page.path || pathname.startsWith(`${page.path}/`)
  })
}

export function validateScriptAssignments(scripts: SiteScript[]): string | null {
  if (scripts.length > MAX_SCRIPTS) {
    return `You can add at most ${MAX_SCRIPTS} scripts.`
  }

  for (const placement of ["header", "footer"] as const) {
    const seen = new Set<string>()
    let hasAll = false

    for (const script of scripts.filter((item) => item.placement === placement)) {
      if (script.code.length > MAX_SCRIPT_CODE_LENGTH) {
        return "One of the scripts is too large."
      }

      const pages = normalizePages(script.pages)
      if (pages.includes(ALL_PAGES_ID)) {
        if (hasAll || seen.size > 0) {
          return `All pages is already used by another ${placement} script.`
        }
        hasAll = true
        continue
      }

      if (hasAll && pages.length > 0) {
        return `All pages is already used by another ${placement} script.`
      }

      for (const pageId of pages) {
        if (seen.has(pageId)) {
          return `${getPageLabel(pageId)} is already assigned to another ${placement} script.`
        }
        seen.add(pageId)
      }
    }
  }

  return null
}

