import { Download, Upload } from "lucide-react"
import { PageHeader } from "@/components/common/page-header"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/use-theme"
import { useEntries } from "@/hooks/use-entries"
import type { WorkEntry, Theme } from "@/types"

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
]

function exportEntriesAsJSON(entries: WorkEntry[]) {
  const blob = new Blob([JSON.stringify(entries, null, 2)], {
    type: "application/json",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "worklog-export.json"
  link.click()
  URL.revokeObjectURL(url)
}

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { entries } = useEntries()

  return (
    <div className="max-w-xl">
      <PageHeader title="Settings" description="Preferences for Worklog." />

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-foreground">Appearance</h2>
        <div className="inline-flex rounded-md border p-0.5">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={cn(
                "rounded-sm px-3 py-1 text-sm text-muted-foreground transition-colors",
                theme === option.value &&
                  "bg-accent text-accent-foreground font-medium",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <Separator className="mb-8" />

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-foreground">Data</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => exportEntriesAsJSON(entries)}>
            <Download className="size-3.5" />
            Export as JSON
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" disabled>
            <Upload className="size-3.5" />
            Import
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Import is coming soon. Export downloads all entries currently loaded
          in this app.
        </p>
      </section>

      <Separator className="mb-8" />

      <section>
        <h2 className="mb-3 text-sm font-medium text-foreground">About</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Worklog is a personal work journal for developers &mdash; a place to
          remember what you worked on, without fighting a spreadsheet to do
          it. Everything currently runs on local mock data.
        </p>
      </section>
    </div>
  )
}
