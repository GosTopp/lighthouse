import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { UnderDevelopment } from "@/components/under-development"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function SearchPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Search" />
        <UnderDevelopment pageName="Search" />
      </SidebarInset>
    </SidebarProvider>
  )
} 