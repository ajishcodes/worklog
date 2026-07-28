import { NavLink } from "react-router-dom"
import { NotebookPen } from "lucide-react"
import { cn } from "@/lib/utils"
import { NAV_ITEMS } from "./nav-items"
import { ThemeToggle } from "./theme-toggle"
import { UserMenu } from "./user-menu"

export function Sidebar() {
  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r">
      <div className="flex h-14 items-center gap-2 px-4">
        <NotebookPen className="size-4 text-foreground" strokeWidth={1.75} />
        <span className="text-sm font-medium tracking-tight">Worklog</span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-2 py-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-accent text-accent-foreground font-medium",
              )
            }
          >
            <item.icon className="size-4" strokeWidth={1.75} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t px-2 py-2">
        <UserMenu />
        <ThemeToggle />
      </div>
    </aside>
  )
}
