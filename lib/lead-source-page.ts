export function getLeadSourcePage(request: Request): string | undefined {
  const referrer = request.headers.get("referer")
  if (!referrer) return undefined

  try {
    return new URL(referrer).pathname.slice(0, 500)
  } catch {
    return undefined
  }
}
