import AppSelect from "@/components/custom/AppSelect"
import React from "react"

type DropdownProps = React.ComponentProps<typeof AppSelect>

const Dropdown = (props: DropdownProps) => {
  return <AppSelect {...props} />
}

export default Dropdown