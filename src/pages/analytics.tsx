import { PageHeader } from "@/components/common/page-header"
import { BarRow } from "@/components/analytics/bar-row"
import { useEntries } from "@/hooks/use-entries"
import {
  computeLateNightStats,
  computeMonthlyHours,
  computeProjectDistribution,
  computeTagFrequency,
} from "@/lib/entries"

export function AnalyticsPage() {
  const { entries } = useEntries()
  const monthlyHours = computeMonthlyHours(entries).slice(-6)
  const projectDistribution = computeProjectDistribution(entries)
  const tagFrequency = computeTagFrequency(entries).slice(0, 8)
  const lateNight = computeLateNightStats(entries)

  const maxMonthlyHours = Math.max(...monthlyHours.map((m) => m.hours), 1)
  const maxTagCount = Math.max(...tagFrequency.map((t) => t.count), 1)

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Patterns across your logged work."
      />

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-medium text-foreground">
            Monthly hours
          </h2>
          <div>
            {monthlyHours.map((m) => (
              <BarRow
                key={m.month}
                label={m.month}
                value={`${m.hours}h`}
                fraction={m.hours / maxMonthlyHours}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-medium text-foreground">
            Work distribution
          </h2>
          <div>
            {projectDistribution.map((p) => (
              <BarRow
                key={p.project}
                label={p.project}
                value={`${p.percentage}%`}
                fraction={p.percentage / 100}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-medium text-foreground">
            Most common tags
          </h2>
          <div>
            {tagFrequency.map((t) => (
              <BarRow
                key={t.tag}
                label={t.tag}
                value={String(t.count)}
                fraction={t.count / maxTagCount}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-medium text-foreground">
            Late night sessions
          </h2>
          <div className="flex divide-x rounded-md border">
            <div className="flex-1 px-4 py-3">
              <div className="text-xs text-muted-foreground">Total sessions</div>
              <div className="mt-1 text-xl font-semibold text-foreground">
                {lateNight.totalSessions}
              </div>
            </div>
            <div className="flex-1 px-4 py-3">
              <div className="text-xs text-muted-foreground">Total hours</div>
              <div className="mt-1 text-xl font-semibold text-foreground">
                {Math.round((lateNight.totalMinutes / 60) * 10) / 10}h
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
