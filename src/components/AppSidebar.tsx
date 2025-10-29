import { Home, Upload, FileText, Shield } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import worldlineLogo from "@/assets/worldline-logo.svg";

const navItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Upload Contract", url: "/upload", icon: Upload },
  { title: "Policy Library", url: "/policies", icon: Shield },
  { title: "Analyses", url: "/analyses", icon: FileText },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          <img 
            src={worldlineLogo} 
            alt="Worldline" 
            className="h-8 w-auto"
          />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            Contract Derisking
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        isActive ? "bg-sidebar-accent" : ""
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
