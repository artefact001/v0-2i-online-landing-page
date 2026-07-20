"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface TablePaginationProps {
  currentPage: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  itemLabel?: string
}

export function TablePagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = "éléments",
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, totalItems)

  // Build a compact list of page numbers around the current page
  const pages: (number | "...")[] = []
  const push = (p: number | "...") => pages.push(p)
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) push(i)
  } else {
    push(1)
    if (currentPage > 3) push("...")
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) push(i)
    if (currentPage < totalPages - 2) push("...")
    push(totalPages)
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.08)] pt-4 sm:flex-row">
      <p className="text-sm text-[rgba(255,255,255,0.5)]">
        {from}–{to} sur {totalItems} {itemLabel}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Page précédente"
          className="h-8 w-8 border-[rgba(255,255,255,0.15)] text-white hover:bg-[rgba(255,255,255,0.06)] disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-sm text-[rgba(255,255,255,0.4)]">
              …
            </span>
          ) : (
            <Button
              key={p}
              variant="outline"
              size="icon"
              onClick={() => onPageChange(p)}
              aria-current={p === currentPage ? "page" : undefined}
              className={
                p === currentPage
                  ? "h-8 w-8 border-[#C9A227] bg-[#C9A227] text-[#0a0a1a] hover:bg-[#C9A227]"
                  : "h-8 w-8 border-[rgba(255,255,255,0.15)] text-white hover:bg-[rgba(255,255,255,0.06)]"
              }
            >
              {p}
            </Button>
          ),
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Page suivante"
          className="h-8 w-8 border-[rgba(255,255,255,0.15)] text-white hover:bg-[rgba(255,255,255,0.06)] disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
