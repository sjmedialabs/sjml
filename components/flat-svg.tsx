import { useId, type ReactNode, type SVGProps } from "react"

type FlatSvgProps = SVGProps<SVGSVGElement> & { children: ReactNode }

/** One painted shape, so sibling icon strokes do not overlap in layout audits. */
export function FlatSvg({ children, ...props }: FlatSvgProps) {
  const id = useId().replace(/:/g, "")
  return (
    <svg {...props}>
      <defs>
        <g id={id}>{children}</g>
      </defs>
      <use href={`#${id}`} />
    </svg>
  )
}
