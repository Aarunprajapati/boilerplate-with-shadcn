import { getUserDetailsFromToken } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Box, LayoutDashboard } from "lucide-react";
import { RouterKeys } from "@/config/router/RouterKeys";
import { SideBarMenu } from "@/clients";
import type { Sidebar } from "@/components/ui/sidebar";


const SideBarMenuPage = ({ ...rest }: React.ComponentProps<typeof Sidebar>) => {
  const navigate = useNavigate();
  const userDetails = getUserDetailsFromToken();

  const handleMenuClick = (path: string) => {
    navigate(path);
  };
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: RouterKeys.DASHBOARD,
    },
    {
      id: "dashboard-alt",
      label: "Dashboard",
      icon: Box,
      path: "#",
    },
    {
      id: "lifecycle",
      label: "Lifecycle",
      icon: Box,
      path: "#",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: Box,
      path: "#",
    },
    {
      id: "projects",
      label: "Projects",
      icon: Box,
      path: "#",
    },
  ];

  return (
    <SideBarMenu
      userDetails={userDetails}
      menuItems={menuItems}
      handleMenuClick={handleMenuClick}
      {...rest}
    />
  );
};

export default SideBarMenuPage;