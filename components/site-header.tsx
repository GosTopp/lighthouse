import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ReactNode } from "react"

export function SiteHeader({ 
  title = "Documents", 
  children 
}: { 
  title?: string
  children?: ReactNode
}) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          {children || (
            <div className="hidden sm:flex items-center group">
              <div className="relative overflow-hidden">
                <span className="text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  Lighthouse Studio
                </span>
                <span className="text-sm text-muted-foreground ml-1 animate-fade-in">
                  See what matters in the noise.
                </span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500/30 to-purple-600/30 transform translate-y-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
