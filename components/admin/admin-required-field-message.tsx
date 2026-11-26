export function AdminRequiredFieldMessage({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <p className="mt-1 text-xs text-red-500" role="alert">
      Required field is missing.
    </p>
  )
}
