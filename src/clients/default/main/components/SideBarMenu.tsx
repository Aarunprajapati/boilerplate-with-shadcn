import { SquareChevronDown } from 'lucide-react'
import type { ElementType } from 'react'
import { useLocation } from 'react-router-dom'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import type { JwtPayload } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface MenuItem {
  id: string
  label: string
  icon: ElementType
  path: string
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userDetails: JwtPayload | null
  menuItems: MenuItem[]
  handleMenuClick: (path: string) => void
}

const SideBarMenu = ({ userDetails, menuItems, handleMenuClick, ...props }: AppSidebarProps) => {
  const { pathname } = useLocation()


  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <SquareChevronDown className="size-5!" />
                <span className="text-base font-semibold">HRMS</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Nav items */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === `/${item.path}`

                console.log(pathname, item.path, isActive)

                return (
                  <SidebarMenuItem key={item.id} className='cursor-pointer!'>
                    <SidebarMenuButton
                      tooltip={item.label}
                      isActive={isActive}
                      onClick={() => handleMenuClick(item.path)}
                      className={cn(
                        'w-full transition-colors',
                        isActive &&
                        "bg-sidebar-accent! text-sidebar-accent-foreground! font-medium shadow-md"
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — user info */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg grayscale">
                    {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                    <AvatarFallback className="rounded-lg">A </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{userDetails?.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {userDetails?.email} arun.prajapati@punon.in
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default SideBarMenu