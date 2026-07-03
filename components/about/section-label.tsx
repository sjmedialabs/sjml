export function SectionLabel({ children, fontSize = 11 }: { children: string; fontSize?: number }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span
        className="uppercase tracking-[0.22em] text-home-primary font-bold shrink-0"
        style={{ fontSize: `${fontSize}px` }}
      >
        {children}
      </span>
      <span className="h-px w-10 bg-home-primary shrink-0" aria-hidden="true" />
    </div>
  )
}
