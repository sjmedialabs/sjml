import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export interface BreadcrumbItemType {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItemType[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (!items?.length) return null
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.flatMap((item, i) => [
          i > 0 ? <BreadcrumbSeparator key={`s-${i}`} /> : null,
          <BreadcrumbItem key={i}>
            {item.href != null && item.href !== "" ? (
              <BreadcrumbLink asChild>
                <Link href={item.href}>{item.label}</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            )}
          </BreadcrumbItem>,
        ]).filter(Boolean)}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
