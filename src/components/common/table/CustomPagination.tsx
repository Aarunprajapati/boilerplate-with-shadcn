import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { ESearchParams, type IPaginatedData } from "@/common/common.enum"
import { cn } from "@/lib/utils"

type PageItem = number | "..."

interface CustomPaginationProps {
  data: IPaginatedData<unknown[]>
  onPaginationChange?: (page: number, pageSize: number) => void
  className?: string
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

function getPageNumbers(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages: PageItem[] = [1]

  if (currentPage > 3) {
    pages.push("...")
  }

  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  for (let page = start; page <= end; page++) {
    pages.push(page)
  }

  if (currentPage < totalPages - 2) {
    pages.push("...")
  }

  pages.push(totalPages)

  return pages
}

function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(page, 1), totalPages)
}

const CustomPagination = ({
  data,
  onPaginationChange,
  className,
}: CustomPaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const total = data?.total ?? 0

  const pageSize =
    data?.limit ?? (Number(searchParams.get(ESearchParams.Limit)) || 10)

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const currentPage = clampPage(
    data?.page ?? (Number(searchParams.get(ESearchParams.Page)) || 1),
    totalPages,
  )

  const pageNumbers = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages],
  )

  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages

  const updatePagination = (page: number, size: number) => {
    const nextPage = clampPage(page, Math.max(1, Math.ceil(total / size)))

    if (onPaginationChange) {
      onPaginationChange(nextPage, size)
      return
    }

    setSearchParams(
      (prevParams) => {
        const params = new URLSearchParams(prevParams)

        params.set(ESearchParams.Page, String(nextPage))
        params.set(ESearchParams.Limit, String(size))

        return params
      },
      { replace: true },
    )
  }

  const handlePageChange = (page: number) => {
    updatePagination(page, pageSize)
  }

  const handlePageSizeChange = (value: string) => {
    updatePagination(1, Number(value))
  }

  const handlePrev = () => {
    if (canPrev) {
      handlePageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (canNext) {
      handlePageChange(currentPage + 1)
    }
  }

  return (
    <div
      className={cn(
        "-mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        "rounded-b-md border border-t-0 p-2 pt-4",
        className,
      )}
    >
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>Total {total} items</span>

        <div className="flex items-center gap-1.5">
          <span className="whitespace-nowrap">Rows per page</span>

          <Select
            value={String(pageSize)}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-7 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem
                  key={size}
                  value={String(size)}
                  className="text-xs"
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={!canPrev}
              className={cn(!canPrev && "pointer-events-none opacity-50")}
              onClick={(event) => {
                event.preventDefault()
                handlePrev()
              }}
            />
          </PaginationItem>

          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={(event) => {
                    event.preventDefault()
                    handlePageChange(page)
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={!canNext}
              className={cn(!canNext && "pointer-events-none opacity-50")}
              onClick={(event) => {
                event.preventDefault()
                handleNext()
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default CustomPagination