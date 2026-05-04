import React, { useEffect, useMemo, useCallback } from "react"

import Dropdown from "./Dropdown"
import { useLazyGetDropdownValuesQuery } from "@/common/CommonApi"

type DropdownProps = React.ComponentProps<typeof Dropdown>

export interface ApiItem {
  id: string | number
  name: string
}

// NetworkDropdown.tsx
type NetworkDropdownProps = DropdownProps & {
  url?: string
}

const NetworkDropdown = ({ url, ...props }: NetworkDropdownProps) => {
  const [getDropdownValues, { data, isFetching }] = useLazyGetDropdownValuesQuery()

  const fetchDropdownData = useCallback(async () => {
    try {
      await getDropdownValues(url).unwrap()
    } catch (error) {
      console.error("NetworkDropdown error:", error)
    }
  }, [url, getDropdownValues])

  useEffect(() => {
    if (url) {
      fetchDropdownData()
    }
  }, [url, fetchDropdownData])

  const options = useMemo(() => {
    return (data ?? []).map((item: ApiItem) => ({
      label: item.name,
      value: item.id,
    }))
  }, [data])

  return (
    <Dropdown
      {...props}
      options={options}
      placeholder={isFetching ? "Loading..." : props.placeholder}
      disabled={props.disabled || isFetching}
    />
  )
}

export default NetworkDropdown