import { LayoutDashboard, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { SideBarMenu } from '@/clients'
import { RouterKeys } from '@/config/router/RouterKeys'
import type { Sidebar } from '@/components/ui/sidebar'
import { getUserDetailsFromToken } from '@/lib/utils'
import useKeyboardShortcuts from '@/hooks/use-HotKeysShortcuts'

// ─── Nav items ────────────────────────────────────────────────────────────────
// Defined outside the component so the array reference is stable.

const MENU_ITEMS = [
  {
    id:    'dashboard',
    label: 'Dashboard',
    icon:  LayoutDashboard,
    path:  RouterKeys.DASHBOARD,   // e.g. 'dashboard'
  },
  {
    id:    'user',
    label: 'User',
    icon:  User,
    path:  RouterKeys.USER,        
  },
  {
    id:    'create-offer',
    label: 'CreateOffer',
    icon:  User,
    path:  RouterKeys.CREATE_OFFER,        
  },
]

// ─── SideBarMenuPage ──────────────────────────────────────────────────────────

const SideBarMenuPage = ({ ...rest }: React.ComponentProps<typeof Sidebar>) => {
  const navigate     = useNavigate()
  const userDetails  = getUserDetailsFromToken()

  const { ShortCutWithRoutes } = useKeyboardShortcuts()

  const handleMenuClick = (path: string) => navigate(path)

  return (
    <SideBarMenu
      userDetails={userDetails}
      menuItems={MENU_ITEMS}
      handleMenuClick={handleMenuClick}
      shortcutMap={ShortCutWithRoutes}  
      {...rest}
    />
  )
}

export default SideBarMenuPage