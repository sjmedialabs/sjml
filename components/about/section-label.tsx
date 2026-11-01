export function SectionLabel({ children, fontSize = 14 }: { children: string; fontSize?: number }) {
  const size = Math.max(14, fontSize)
  return (
    <div className="flex items-center gap-3 mb-4 min-w-0 max-w-full">
      <span
        className="uppercase tracking-[0.08em] sm:tracking-[0.16em] text-home-primary font-bold min-w-0"
        style={{ fontSize: `${size}px`, overflowWrap: "anywhere" }}
      >
        {children}
      </span>
      <span className="h-px w-10 bg-home-primary shrink-0" aria-hidden="true" />
    </div>
  )
}
