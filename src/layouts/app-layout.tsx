import { Outlet } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Sidebar } from "@/components/layout/sidebar"

export function AppLayout() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-svh w-full overflow-hidden">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl px-8 py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}
