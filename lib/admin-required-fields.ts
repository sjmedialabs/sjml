export type AdminRequiredField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export function getFirstMissingAdminRequiredField(container: ParentNode | null) {
  if (!container) return null

  const fields = container.querySelectorAll<AdminRequiredField>(
    "input[required], select[required], textarea[required]",
  )
  return Array.from(fields).find((field) => !field.value.trim()) ?? null
}

export function scrollToAdminRequiredField(field: AdminRequiredField) {
  field.scrollIntoView({ behavior: "smooth", block: "center" })
  field.focus({ preventScroll: true })
}
