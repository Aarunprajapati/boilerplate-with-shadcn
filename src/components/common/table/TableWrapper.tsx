import * as React from "react"

import { cn } from "@/lib/utils"

interface TableWrapperProps extends React.ComponentProps<"div"> {
  loading?: boolean
}

export function TableWrapper({
  className,
  children,
  loading = false,
  ...props
}: TableWrapperProps) {
  return (
    <div
      className={cn("relative w-full min-w-0 overflow-auto rounded-md border bg-background", className)}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-[1px]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
      )}
      {children}
    </div>
  )
}

export default TableWrapper
