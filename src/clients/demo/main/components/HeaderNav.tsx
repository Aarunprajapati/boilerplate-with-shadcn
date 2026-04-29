import { Button } from "@/components/ui/button";
import { useThemeMode } from "@/config/BaseThemeProvider";
import { SidebarTrigger } from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, Moon, Sun, User } from "lucide-react";

export interface IHeaderNavProps {
  onLogout: () => void;
}

const HeaderNav = (props: IHeaderNavProps) => {
  const { onLogout } = props;
  const { mode, toggleMode } = useThemeMode();
  const isDarkMode = mode === "dark";

  return (
    <header className="sticky! top-0! z-30 border-b py-2 pr-4 ">
      <div className="flex w-full items-center justify-between">
        
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleMode}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
              >
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={onLogout}
                className=" cursor-pointer"
              >
                <LogOutIcon className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  );
};

export default HeaderNav;

