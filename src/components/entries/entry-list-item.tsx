import { Link } from "react-router-dom"
import { Moon, GitPullRequest } from "lucide-react"
import type { WorkEntry } from "@/types"
import { Badge } from "@/components/ui/badge"
import { formatDateShort, formatDuration } from "@/lib/format"

export function EntryListItem({ entry }: { entry: WorkEntry }) {
  return (
    <Link
      to={`/entries/${entry.id}`}
      className="flex items-center justify-between gap-4 border-b px-1 py-3 text-sm transition-colors last:border-b-0 hover:bg-accent/50"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium text-foreground">
            {entry.title}
          </span>
          {entry.workedAfterHours && (
            <Moon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          )}
          {entry.prUrl && (
            <GitPullRequest className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {entry.project && <span>{entry.project}</span>}
          {entry.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-sm px-1.5 py-0 text-[11px] font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="shrink-0 text-right text-xs text-muted-foreground">
        <div>{formatDateShort(entry.date)}</div>
        <div className="mt-1">{formatDuration(entry.durationMinutes)}</div>
      </div>
    </Link>
  )
}
