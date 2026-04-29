import { Mainlayout } from "@/clients";
import { RouterKeys } from "@/config/router/RouterKeys";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const MainPage = () => {
    const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(RouterKeys.COMMON.LOGIN);
  };

  const props = {
    isOpen: sidebarOpen,
    onClose: handleMenuClick,
    handleLogout
  };

  return (
      <Mainlayout {...props} />
  );
};

export default MainPage;
