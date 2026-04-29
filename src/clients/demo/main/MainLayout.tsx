import { Outlet } from 'react-router-dom'

import { SideMenuPage } from '@/pages'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import HeaderNav from './components/HeaderNav'

interface MainLayoutProps {
  isOpen: boolean
  handleLogout: () => void
  onClose: () => void
}

const SIDEBAR_WIDTH = "14rem"
const SIDEBAR_WIDTH_MOBILE = "16rem"

const MainLayout = (props: MainLayoutProps) => {
  const {  handleLogout } = props

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
        } as React.CSSProperties
      }
    >
      <SideMenuPage variant='inset' />
      <SidebarInset>
        <HeaderNav onLogout={handleLogout}/>
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default MainLayout
