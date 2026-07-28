import { Link } from "react-router-dom"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/common/page-header"
import { StatTile } from "@/components/dashboard/stat-tile"
import { EntryListItem } from "@/components/entries/entry-list-item"
import { Button } from "@/components/ui/button"
import { useEntries } from "@/hooks/use-entries"
import {
  computeDashboardStats,
  getRecentEntries,
  getTodayEntries,
} from "@/lib/entries"

export function DashboardPage() {
  const { entries } = useEntries()
  const stats = computeDashboardStats(entries)
  const todayEntries = getTodayEntries(entries)
  const recentEntries = getRecentEntries(entries, 8)

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A quick look at where things stand."
        action={
          <Button asChild size="sm" className="gap-1.5">
            <Link to="/entries/new">
              <Plus className="size-4" />
              New entry
            </Link>
          </Button>
        }
      />

      <div className="mb-10 flex divide-x rounded-md border">
        <StatTile label="Hours this week" value={`${stats.hoursThisWeek}h`} />
        <StatTile label="Entries today" value={String(stats.entriesToday)} />
        <StatTile
          label="Late night sessions"
          value={String(stats.lateNightSessionsThisWeek)}
          hint="this week"
        />
        <StatTile
          label="Current streak"
          value={`${stats.currentStreakDays}d`}
        />
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <section>
          <h2 className="mb-2 text-sm font-medium text-foreground">
            Today
          </h2>
          {todayEntries.length === 0 ? (
            <p className="border-b py-3 text-sm text-muted-foreground">
              Nothing logged yet today.
            </p>
          ) : (
            <div>
              {todayEntries.map((entry) => (
                <EntryListItem key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-sm font-medium text-foreground">
            Recent entries
          </h2>
          <div>
            {recentEntries.map((entry) => (
              <EntryListItem key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
