import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { SettingsSidebar } from "./settings-sidebar";

export default function SettingsLayout() {
  return (
    <SidebarProvider>
      <SettingsSidebar />
      <SidebarInset>
        {/* <SidebarTrigger /> */}
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
