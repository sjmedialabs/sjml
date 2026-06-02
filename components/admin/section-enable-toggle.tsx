interface SectionEnableToggleProps {
  id: string
  enabled: boolean
  onChange: (enabled: boolean) => void
}

export function SectionEnableToggle({ id, enabled, onChange }: SectionEnableToggleProps) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm admin-text-primary shrink-0">
      <input
        type="checkbox"
        id={id}
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded admin-border-light"
      />
      Enabled
    </label>
  )
}
