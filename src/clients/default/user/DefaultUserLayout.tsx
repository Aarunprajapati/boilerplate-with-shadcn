"use client"

import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { PaginatedGrid } from "@/components/common/table/PaginatedGrid"

// ─────────────────────────────────────────────
// 1. Data type
// ─────────────────────────────────────────────

type Employee = {
  id: number
  name: string
  department: string
  role: string
  status: "Active" | "Inactive" | "On Leave"
  salary: number
  joinedYear: number
}

// ─────────────────────────────────────────────
// 2. Sample rows
// ─────────────────────────────────────────────

const INITIAL_DATA: Employee[] = [
  { id: 1,  name: "Alice Johnson",  department: "Engineering", role: "Frontend Dev",    status: "Active",   salary: 95000,  joinedYear: 2020 },
  { id: 2,  name: "Bob Smith",      department: "Engineering", role: "Backend Dev",     status: "Active",   salary: 102000, joinedYear: 2019 },
  { id: 3,  name: "Carol White",    department: "Design",      role: "UI/UX Designer",  status: "Active",   salary: 88000,  joinedYear: 2021 },
  { id: 4,  name: "David Lee",      department: "Marketing",   role: "SEO Specialist",  status: "Inactive", salary: 72000,  joinedYear: 2018 },
  { id: 5,  name: "Eve Martinez",   department: "Engineering", role: "DevOps",          status: "Active",   salary: 110000, joinedYear: 2017 },
  { id: 6,  name: "Frank Brown",    department: "HR",          role: "Recruiter",       status: "On Leave", salary: 65000,  joinedYear: 2022 },
  { id: 7,  name: "Grace Kim",      department: "Design",      role: "Graphic Designer",status: "Active",   salary: 78000,  joinedYear: 2020 },
  { id: 8,  name: "Henry Wilson",   department: "Marketing",   role: "Content Writer",  status: "Active",   salary: 68000,  joinedYear: 2021 },
  { id: 9,  name: "Isla Davis",     department: "Engineering", role: "QA Engineer",     status: "Inactive", salary: 83000,  joinedYear: 2019 },
  { id: 10, name: "Jack Thompson",  department: "HR",          role: "HR Manager",      status: "Active",   salary: 91000,  joinedYear: 2016 },
  { id: 11, name: "Karen Anderson", department: "Design",      role: "Motion Designer", status: "Active",   salary: 80000,  joinedYear: 2022 },
  { id: 12, name: "Liam Jackson",   department: "Engineering", role: "Full Stack Dev",  status: "On Leave", salary: 98000,  joinedYear: 2020 },
]

const STATUS_VARIANT: Record<Employee["status"], "default" | "secondary" | "destructive"> = {
  Active:     "default",
  Inactive:   "destructive",
  "On Leave": "secondary",
}

// ─────────────────────────────────────────────
// 3. Column definitions
//
//    KEY PATTERN:
//    - Add  meta: { editable: true }   to make a column editable
//    - Add  enableGrouping: true        to allow grouping on that column
//    - Add  size / minSize / maxSize    to control initial & clamped widths
//    - Add  enableResizing: false       to prevent resizing on a specific column
// ─────────────────────────────────────────────

const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 60,
    minSize: 50,
    enableSorting: true,
    enableGrouping: false,
    enableResizing: true,
    // NOT editable — no meta.editable
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 180,
    minSize: 120,
    enableSorting: true,
    enableGrouping: false,
    enableResizing: true,
    meta: { editable: true },         // ✅ column-wise editable
  },
  {
    accessorKey: "department",
    header: "Department",
    size: 160,
    minSize: 100,
    enableSorting: true,
    enableGrouping: true,             // ✅ groupable
    enableResizing: true,
    meta: { editable: true },         // ✅ editable too
  },
  {
    accessorKey: "role",
    header: "Role",
    size: 180,
    minSize: 120,
    enableSorting: true,
    enableGrouping: false,
    enableResizing: true,
    meta: { editable: true },         // ✅ editable
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    minSize: 90,
    enableSorting: true,
    enableGrouping: true,             // ✅ groupable
    enableResizing: true,
    // Custom renderer — NOT editable (status should use a Select, not free text)
    cell: ({ getValue }) => {
      const s = getValue<Employee["status"]>()
      return <Badge variant={STATUS_VARIANT[s]}>{s}</Badge>
    },
  },
  {
    accessorKey: "salary",
    header: "Salary",
    size: 130,
    minSize: 90,
    enableSorting: true,
    enableGrouping: false,
    enableResizing: true,
    meta: { editable: true },         // ✅ editable (user types a new number)
    cell: ({ getValue }) =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
        getValue<number>()
      ),
    aggregationFn: "mean",
    aggregatedCell: ({ getValue }) =>
      `Avg: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
        getValue<number>()
      )}`,
  },
  {
    accessorKey: "joinedYear",
    header: "Year Joined",
    size: 120,
    minSize: 80,
    enableSorting: true,
    enableGrouping: true,             // ✅ groupable
    enableResizing: true,
  },
]

// ─────────────────────────────────────────────
// 4. Page component
// ─────────────────────────────────────────────

const DefaultUserLayout = () => {
  const [tableData, setTableData] = React.useState<Employee[]>(INITIAL_DATA)
  const [selected, setSelected]   = React.useState<Employee[]>([])

  /**
   * onCellValueChange
   * rowIndex  — position in the `data` array passed to the grid
   * columnId  — the accessorKey of the column that was edited
   * value     — the new value (always a string from the text input)
   */
  const handleCellChange = (rowIndex: number, columnId: string, value: unknown) => {
    setTableData((prev) => {
      const next = [...prev]
      next[rowIndex] = { ...next[rowIndex], [columnId]: value }
      return next
    })
  }

  return (
    // <div className="p-6 space-y-4">
    //   <div>
    //     <h1 className="text-2xl font-bold">Employee Directory</h1>
    //     <p className="text-muted-foreground text-sm mt-1">
    //       Click a <span className="text-primary/80">✎</span>-marked cell to edit it inline.
    //       Use <strong>Group</strong> to group rows by department, status, or year.
    //       Drag column edges to resize.
    //     </p>
    //   </div>

    //   {selected.length > 0 && (
    //     <div className="rounded-md border p-3 bg-muted/30 text-sm">
    //       <span className="font-semibold">Selected: </span>
    //       {selected.map((e) => e.name).join(", ")}
    //     </div>
    //   )}

    //   <PaginatedGrid<Employee>
    //     data={tableData}
    //     columns={columns}

    //     // ── Inline editing (column-wise via meta.editable) ─────────────────
    //     onCellValueChange={handleCellChange}

    //     // ── Row selection ─────────────────────────────────────────────────
    //     onRowSelectionChange={setSelected}

    //     // ── Row grouping ──────────────────────────────────────────────────
    //     enableGrouping={true}
    //     groupableColumns={["department", "status", "joinedYear"]}

    //     // ── Column resizing ───────────────────────────────────────────────
    //     enableColumnResizing={true}

    //     // ── Pagination ────────────────────────────────────────────────────
    //     defaultPageSize={5}
    //     pageSizeOptions={[5, 10, 20]}

    //     // ── Toolbar ───────────────────────────────────────────────────────
    //     enableSearch={true}
    //     enableColumnToggle={true}
    //   />
    // </div>
    <div className="w-999 border h-10 bg-red-500"></div>
  )
}

export default DefaultUserLayout