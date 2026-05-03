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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Kbd } from '@/components/ui/kbd'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MenuItem {
  id: string
  label: string
  icon: ElementType
  path: string
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userDetails: JwtPayload | null
  menuItems: MenuItem[]
  handleMenuClick: (path: string) => void
  // shortcutMap: path → label  e.g. { '/users': 'Ctrl+U' }
  shortcutMap?: Record<string, string>
}

// ─── ShortcutBadge ────────────────────────────────────────────────────────────

const ShortcutBadge = ({ label }: { label: string }) => {
  const parts = label.split('+')
  return (
    <span className="ml-auto flex items-center gap-0.5">
      {parts.map((part, i) => (
        <Kbd
          key={i}
          className={cn(
            'inline-flex items-center justify-center',
            'rounded border border-border bg-muted',
            'px-1 py-px font-mono text-[10px] leading-none text-muted-foreground',
            'shadow-[0_1px_0_0_hsl(var(--border))]',
          )}
        >
          {part === 'Ctrl' ? '⌘' : part === 'Cmd' ? '⌘' : part}
        </Kbd>
      ))}
    </span>
  )
}

// ─── SideBarMenu ──────────────────────────────────────────────────────────────

const SideBarMenu = ({
  userDetails,
  menuItems,
  handleMenuClick,
  shortcutMap = {},
  ...props
}: AppSidebarProps) => {
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

                // ✅ Fix: normalise both sides so '/users' === '/users' always
                const normPath    = `/${item.path}`.replace(/\/+/g, '/')
                const isActive    =
                  pathname === normPath ||
                  pathname.startsWith(normPath + '/')

                // shortcut badge for this item (undefined → no badge)
                const shortcut = shortcutMap[normPath]

                return (
                  <SidebarMenuItem key={item.id} className="cursor-pointer!">
                    <SidebarMenuButton
                      tooltip={item.label}
                      isActive={isActive}
                      onClick={() => handleMenuClick(item.path)}
                      className={cn(
                        'w-full transition-colors',
                        isActive &&
                          'bg-sidebar-accent! text-sidebar-accent-foreground! font-medium shadow-md',
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {shortcut && <ShortcutBadge label={shortcut} />}
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
                    <AvatarFallback className="rounded-lg">
                      {userDetails?.name?.[0]?.toUpperCase() ?? 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{userDetails?.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {userDetails?.email}
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