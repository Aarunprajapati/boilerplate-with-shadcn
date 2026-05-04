"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
  type GroupingState,
  type ExpandedState,
  type ColumnSizingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import TableWrapper from "@/components/common/table/TableWrapper"
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
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Columns,
  Group,
  ListFilter,
  X,
} from "lucide-react"
import CustomPagination from "./CustomPagination"
import type { IPaginatedData } from "@/common/common.enum"

// ─────────────────────────────────────────────
// ColumnMeta — extend per-column ColumnDef
// ─────────────────────────────────────────────

/**
 * Add `meta` to any ColumnDef to control per-column features:
 *
 *   {
 *     accessorKey: "name",
 *     header: "Name",
 *     meta: { editable: true },       // enable inline editing for this column
 *   }
 */
export interface PaginatedGridColumnMeta {
  /** Allow click-to-edit on cells in this column */
  editable?: boolean
}


// Augment TanStack's ColumnMeta type so TypeScript is happy
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    editable?: boolean
  }
}

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

export interface PaginatedGridProps<TData extends object, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[]
  data:  IPaginatedData<unknown[]>
  tableLoading?: boolean
  heightRow?: number
  widthRow?: number | string
  showPagination?: boolean
  removeBottomPadding?: boolean
  onPaginationChange?: (page: number, pageSize: number) => void
  /**
   * Fired when an editable cell is committed.
   * @param rowIndex  Index in the original `data` array
   * @param columnId  Column accessor key
   * @param value     New value (always string when coming from the text input)
   */
  onCellValueChange?: (rowIndex: number, columnId: string, value: unknown) => void
  /** Fired with the full data objects of currently-selected rows */
  onRowSelectionChange?: (selectedRows: TData[]) => void
  /** Column ids that appear in the "Group by" dropdown */
  groupableColumns?: string[]
  defaultPageSize?: number
  pageSizeOptions?: number[]
  enableSearch?: boolean
  enableColumnToggle?: boolean
  enableColumnFilters?: boolean
  enableGrouping?: boolean
  flexColumnId?: string
  /** Show resize handles on column headers */
  enableColumnResizing?: boolean
}

const SELECT_COLUMN_SIZE = 40

function isPaginatedData<TData extends object>(
  data: TData[] | IPaginatedData<TData[]>,
): data is IPaginatedData<TData[]> {
  return !Array.isArray(data) && Array.isArray(data.items)
}

// ─────────────────────────────────────────────
// Editable cell
// ─────────────────────────────────────────────

interface EditableCellProps {
  value: unknown
  rowIndex: number
  columnId: string
  editable: boolean
  onCellValueChange?: (r: number, c: string, v: unknown) => void
}

function EditableCell({ value: init, rowIndex, columnId, editable, onCellValueChange }: EditableCellProps) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(init)

  React.useEffect(() => { setDraft(init) }, [init])

  const commit = () => {
    setEditing(false)
    if (draft !== init) onCellValueChange?.(rowIndex, columnId, draft)
  }

  if (!editable || !onCellValueChange) {
    return <span className="truncate">{String(init ?? "")}</span>
  }

  if (editing) {
    return (
      <Input
        autoFocus
        value={String(draft ?? "")}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit()
          if (e.key === "Escape") { setDraft(init); setEditing(false) }
        }}
        className="h-7 px-2 py-0 text-sm w-full"
      />
    )
  }

  return (
    <span
      onClick={() => setEditing(true)}
      title="Click to edit"
      className="block w-full cursor-text rounded px-1 truncate hover:bg-muted/70 transition-colors min-h-[1.25rem]"
    >
      {String(init ?? "\u00A0")}
    </span>
  )
}

// ─────────────────────────────────────────────
// Column resize handle
// ─────────────────────────────────────────────

function ResizeHandle({ onMouseDown, onTouchStart }: {
  onMouseDown: (e: React.MouseEvent) => void
  onTouchStart: (e: React.TouchEvent) => void
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className="
        absolute right-0 top-0 h-full w-1.5
        cursor-col-resize select-none touch-none z-10
        bg-transparent hover:bg-primary/40 active:bg-primary
        transition-colors
      "
    />
  )
}

// ─────────────────────────────────────────────
// Shadcn pagination page-number builder
// ─────────────────────────────────────────────

function buildPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | "…")[] = [1]
  if (current > 3) pages.push("…")
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }
  if (current < total - 2) pages.push("…")
  pages.push(total)
  return pages
}

// ─────────────────────────────────────────────
// PaginatedGrid
// ─────────────────────────────────────────────

export function PaginatedGrid<TData extends object, TValue = unknown>({
  columns,
  data,
  tableLoading = false,
  heightRow,
  widthRow,
  showPagination = true,
  removeBottomPadding = false,
  onPaginationChange,
  onCellValueChange,
  onRowSelectionChange,
  groupableColumns = [],
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  enableSearch = false,
  enableColumnToggle = false,
  enableColumnFilters = false,
  enableGrouping = false,
  flexColumnId = "name",
  enableColumnResizing = false,
}: PaginatedGridProps<TData, TValue>) {

  // ── state ──────────────────────────────────
  const tableFrameRef = React.useRef<HTMLDivElement>(null)
  const [tableFrameWidth, setTableFrameWidth] = React.useState(0)
  const paginatedData = isPaginatedData(data) ? data : undefined
  const tableData: TData[] = Array.isArray(data) ? data : data.items
  const manualPagination = Boolean(paginatedData && onPaginationChange)
  const [sorting, setSorting]                   = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters]       = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter]         = React.useState("")
  const [rowSelection, setRowSelection]         = React.useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [grouping, setGrouping]                 = React.useState<GroupingState>([])
  const [expanded, setExpanded]                 = React.useState<ExpandedState>({})
  const [columnSizing, setColumnSizing]         = React.useState<ColumnSizingState>({})
  const [pagination, setPagination]             = React.useState({ pageIndex: 0, pageSize: defaultPageSize })

  // ── inject editable cell renderer per-column ─
  const wrappedColumns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    return columns.map((col) => {
      const isEditable = col.meta?.editable ?? false
      if (!isEditable || !onCellValueChange) return col
      return {
        ...col,
        cell: (ctx) => (
          <EditableCell
            value={ctx.getValue()}
            rowIndex={ctx.row.index}
            columnId={ctx.column.id}
            editable={isEditable}
            onCellValueChange={onCellValueChange}
          />
        ),
      }
    })
  }, [columns, onCellValueChange])

  // ── table instance ─────────────────────────
  const table = useReactTable({
    data: tableData,
    columns: wrappedColumns,
    state: {
      sorting, columnFilters, globalFilter,
      rowSelection, columnVisibility,
      grouping, expanded,
      columnSizing, pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: (updater) => {
      const next = typeof updater === "function" ? updater(rowSelection) : updater
      setRowSelection(next)
      if (onRowSelectionChange) {
        const idxs = Object.keys(next).filter((k) => next[k]).map(Number)
        onRowSelectionChange(idxs.map((i) => tableData[i]).filter(Boolean))
      }
    },
    onColumnVisibilityChange: setColumnVisibility,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    onColumnSizingChange: setColumnSizing,
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater(pagination) : updater
      setPagination(next)
      onPaginationChange?.(next.pageIndex + 1, next.pageSize)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    enableRowSelection: true,
    enableColumnFilters,
    manualPagination,
    pageCount: paginatedData?.totalPages,
    columnResizeMode: "onChange",
    groupedColumnMode: false,
  })

  React.useEffect(() => {
    const tableFrame = tableFrameRef.current
    if (!tableFrame) return

    const updateWidth = () => setTableFrameWidth(tableFrame.clientWidth)
    updateWidth()

    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(tableFrame)

    return () => resizeObserver.disconnect()
  }, [])

  React.useEffect(() => {
    if (!paginatedData) return

    setPagination((current) => ({
      pageIndex: Math.max((paginatedData.page ?? current.pageIndex + 1) - 1, 0),
      pageSize: paginatedData.pageSize ?? current.pageSize,
    }))
  }, [paginatedData?.page, paginatedData?.pageSize])

  // ── derived ────────────────────────────────
  const selectedCount = Object.values(rowSelection).filter(Boolean).length
  const pageCount     = Math.max(table.getPageCount(), 1)
  const currentPage   = pagination.pageIndex + 1
  const pageNumbers   = buildPageNumbers(currentPage, pageCount)
  const totalRows = paginatedData?.totalItems ?? paginatedData?.totalCount ?? paginatedData?.total ?? table.getFilteredRowModel().rows.length
  const tableHeight = heightRow ? heightRow * 11 : undefined
  const leafCols      = table.getAllLeafColumns().filter((c) => c.id !== "select")
  const visibleLeafCols = table.getVisibleLeafColumns()
  const fixedColumnsWidth = visibleLeafCols
    .filter((column) => column.id !== flexColumnId)
    .reduce((width, column) => width + column.getSize(), SELECT_COLUMN_SIZE)
  const flexColumnBaseWidth = table.getColumn(flexColumnId)?.getSize() ?? 0
  const flexColumnWidth = Math.max(flexColumnBaseWidth, tableFrameWidth - fixedColumnsWidth)
  const tableWidth = Math.max(tableFrameWidth, fixedColumnsWidth + flexColumnWidth)
  const getColumnWidth = (columnId: string, fallbackWidth: number) =>
    columnId === flexColumnId ? flexColumnWidth : fallbackWidth

  // ── render ─────────────────────────────────
  return (
    <div className="w-full min-w-0 space-y-3">

      {/* ── Toolbar ── */}
      <div className="flex min-w-0 flex-wrap items-center gap-2 justify-between">
        <div className="flex min-w-0 items-center gap-2 flex-wrap">

          {enableSearch && (
            <div className="relative">
              <Input
                placeholder="Search all columns…"
                value={globalFilter}
                onChange={(e) => {
                  setGlobalFilter(e.target.value)
                  setPagination((p) => ({ ...p, pageIndex: 0 }))
                }}
                className="max-w-xs pr-8"
              />
              {globalFilter && (
                <button
                  onClick={() => setGlobalFilter("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          {grouping.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-xs text-muted-foreground">Grouped by:</span>
              {grouping.map((colId) => (
                <Badge key={colId} variant="secondary" className="gap-1 text-xs">
                  {colId}
                  <button onClick={() => setGrouping((g) => g.filter((id) => id !== colId))}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setGrouping([])}>
                Clear all
              </Button>
            </div>
          )}

          {selectedCount > 0 && (
            <Badge variant="outline" className="text-xs">{selectedCount} selected</Badge>
          )}
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">

          {enableGrouping && groupableColumns.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Group className="h-3.5 w-3.5" /> Group
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs">Group by column</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {groupableColumns.map((colId) => (
                  <DropdownMenuCheckboxItem
                    key={colId}
                    checked={grouping.includes(colId)}
                    onCheckedChange={(checked) =>
                      setGrouping((g) => checked ? [...g, colId] : g.filter((id) => id !== colId))
                    }
                  >
                    {colId}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {enableColumnToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Columns className="h-3.5 w-3.5" /> Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs">Toggle visibility</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {leafCols.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={(v) => col.toggleVisibility(!!v)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <TableWrapper
        loading={tableLoading}
        style={{
          height: tableHeight,
          width: widthRow,
          ...(removeBottomPadding ? {} : { paddingBottom: 16 }),
        }}
      >
      <div ref={tableFrameRef} className="h-full w-full max-w-full min-w-0 overflow-auto">
        <Table style={{ width: tableWidth, tableLayout: "fixed" }}>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <React.Fragment key={hg.id}>
              <TableRow>

                {/* Select-all */}
                <TableHead style={{ width: SELECT_COLUMN_SIZE }} className="relative shrink-0">
                  <Checkbox
                    checked={
                      table.getIsAllPageRowsSelected()
                        ? true
                        : table.getIsSomePageRowsSelected()
                        ? "indeterminate"
                        : false
                    }
                    onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                    aria-label="Select all"
                  />
                </TableHead>

                {hg.headers.map((header) => {
                  const sorted     = header.column.getIsSorted()
                  const isEditable = header.column.columnDef.meta?.editable
                  const headerWidth = getColumnWidth(header.column.id, header.getSize())

                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: headerWidth, position: "relative" }}
                      className="overflow-hidden"
                    >
                      <div
                        className={`flex items-center gap-1 ${header.column.getCanSort() ? "cursor-pointer select-none" : ""}`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span className="truncate">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>

                        {/* ✎ editable indicator */}
                        {isEditable && (
                          <span className="text-[10px] text-primary/60 shrink-0" title="Editable column">✎</span>
                        )}

                        {/* sort icon */}
                        {header.column.getCanSort() && (
                          <span className="text-muted-foreground shrink-0">
                            {sorted === "asc"  ? <ChevronUp   className="h-3.5 w-3.5" /> :
                             sorted === "desc" ? <ChevronDown className="h-3.5 w-3.5" /> :
                             <ChevronsUpDown className="h-3 w-3 opacity-40" />}
                          </span>
                        )}
                      </div>

                      {/* resize handle */}
                      {enableColumnResizing && header.column.getCanResize() && (
                        <ResizeHandle
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                        />
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>

              {enableColumnFilters && (
                <TableRow>
                  <TableHead style={{ width: SELECT_COLUMN_SIZE }}>
                    <ListFilter className="h-3.5 w-3.5 text-muted-foreground" />
                  </TableHead>

                  {hg.headers.map((header) => {
                    const filterValue = header.column.getFilterValue()

                    return (
                      <TableHead
                        key={`${header.id}-filter`}
                        style={{ width: getColumnWidth(header.column.id, header.getSize()) }}
                        className="p-1"
                      >
                        {header.column.getCanFilter() ? (
                          <Input
                            value={String(filterValue ?? "")}
                            onChange={(e) => {
                              header.column.setFilterValue(e.target.value)
                              setPagination((p) => ({ ...p, pageIndex: 0 }))
                            }}
                            placeholder={`Filter ${header.column.id}`}
                            className="h-7 w-full px-2 text-xs"
                          />
                        ) : null}
                      </TableHead>
                    )
                  })}
                </TableRow>
              )}
              </React.Fragment>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {

                /* ── grouped header row ── */
                if (row.getIsGrouped()) {
                  return (
                    <TableRow key={row.id} className="bg-muted/40 hover:bg-muted/60 font-medium">
                      <TableCell colSpan={wrappedColumns.length + 1}>
                        <button
                          onClick={row.getToggleExpandedHandler()}
                          className="flex items-center gap-2 text-sm w-full text-left"
                        >
                          {row.getIsExpanded()
                            ? <ChevronDown  className="h-4 w-4 shrink-0" />
                            : <ChevronRight className="h-4 w-4 shrink-0" />}
                          <span className="font-semibold capitalize">{row.groupingColumnId}:</span>
                          <span>{String(row.groupingValue ?? "—")}</span>
                          <Badge variant="secondary" className="text-xs ml-1">
                            {row.subRows.length} rows
                          </Badge>
                        </button>
                      </TableCell>
                    </TableRow>
                  )
                }

                /* ── data row ── */
                return (
                  <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>

                    <TableCell style={{ width: SELECT_COLUMN_SIZE }}>
                      <Checkbox
                        checked={row.getIsSelected()}
                        disabled={!row.getCanSelect()}
                        onCheckedChange={(v) => row.toggleSelected(!!v)}
                        aria-label="Select row"
                      />
                    </TableCell>

                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: getColumnWidth(cell.column.id, cell.column.getSize()),
                          maxWidth: getColumnWidth(cell.column.id, cell.column.getSize()),
                        }}
                        className="overflow-hidden p-2"
                      >
                        {cell.getIsGrouped() ? (
                          <button onClick={row.getToggleExpandedHandler()} className="flex items-center gap-1">
                            {row.getIsExpanded()
                              ? <ChevronDown  className="h-3.5 w-3.5" />
                              : <ChevronRight className="h-3.5 w-3.5" />}
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            <Badge variant="outline" className="ml-1 text-xs">{row.subRows.length}</Badge>
                          </button>
                        ) : cell.getIsAggregated() ? (
                          flexRender(
                            cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        ) : cell.getIsPlaceholder() ? null : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={wrappedColumns.length + 1} className="h-24 text-center text-muted-foreground">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </TableWrapper>

      {/* ── Footer ── */}
        {showPagination && (
          <div className="">
            <CustomPagination data={data} onPaginationChange={onPaginationChange} />
          </div>
        )}
    </div>
  )
}
