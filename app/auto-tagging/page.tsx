import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AutoTaggingForm, TaskList } from "@/components/auto-tagging"

export default function AutoTaggingPage() {
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
        <SiteHeader title="Auto Tagging" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <Tabs defaultValue="settings" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="settings">Auto Tagging Settings</TabsTrigger>
                    <TabsTrigger value="tasks">Task List</TabsTrigger>
                  </TabsList>
                  <TabsContent value="settings">
                    <AutoTaggingForm />
                  </TabsContent>
                  <TabsContent value="tasks">
                    <TaskList />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 