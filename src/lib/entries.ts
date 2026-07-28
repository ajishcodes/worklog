import type {
  DashboardStats,
  LateNightStats,
  MonthlyHours,
  ProjectDistribution,
  TagFrequency,
  WorkEntry,
} from "@/types"
import { formatMonthYear, toISODate } from "@/lib/format"

export function listProjects(entries: WorkEntry[]) {
  const set = new Set<string>()
  for (const e of entries) if (e.project) set.add(e.project)
  return [...set].sort()
}

export function listTags(entries: WorkEntry[]) {
  const set = new Set<string>()
  for (const e of entries) for (const t of e.tags) set.add(t)
  return [...set].sort()
}

export function getEntriesForDate(entries: WorkEntry[], iso: string) {
  return entries.filter((e) => e.date === iso)
}

export function getTodayEntries(entries: WorkEntry[]) {
  return getEntriesForDate(entries, toISODate(new Date()))
}

export function getRecentEntries(entries: WorkEntry[], limit = 8) {
  return [...entries]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
}

function startOfWeek(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function computeHoursThisWeek(entries: WorkEntry[], now = new Date()) {
  const start = startOfWeek(now)
  const startISO = toISODate(start)
  const minutes = entries
    .filter((e) => e.date >= startISO && e.date <= toISODate(now))
    .reduce((sum, e) => sum + e.durationMinutes, 0)
  return Math.round((minutes / 60) * 10) / 10
}

export function computeLateNightSessionsThisWeek(
  entries: WorkEntry[],
  now = new Date(),
) {
  const start = startOfWeek(now)
  const startISO = toISODate(start)
  return entries.filter(
    (e) => e.workedAfterHours && e.date >= startISO && e.date <= toISODate(now),
  ).length
}

export function computeCurrentStreak(entries: WorkEntry[], now = new Date()) {
  const datesWithEntries = new Set(entries.map((e) => e.date))
  let streak = 0
  const cursor = new Date(now)

  if (!datesWithEntries.has(toISODate(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  while (datesWithEntries.has(toISODate(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export function computeDashboardStats(
  entries: WorkEntry[],
  now = new Date(),
): DashboardStats {
  return {
    hoursThisWeek: computeHoursThisWeek(entries, now),
    entriesToday: getEntriesForDate(entries, toISODate(now)).length,
    lateNightSessionsThisWeek: computeLateNightSessionsThisWeek(entries, now),
    currentStreakDays: computeCurrentStreak(entries, now),
  }
}

export function computeMonthlyHours(entries: WorkEntry[]): MonthlyHours[] {
  const byMonth = new Map<string, number>()
  for (const e of entries) {
    const key = e.date.slice(0, 7)
    byMonth.set(key, (byMonth.get(key) ?? 0) + e.durationMinutes)
  }
  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, minutes]) => {
      const [year, month] = key.split("-").map(Number)
      return {
        month: formatMonthYear(new Date(year, month - 1, 1)),
        hours: Math.round((minutes / 60) * 10) / 10,
      }
    })
}

export function computeTagFrequency(entries: WorkEntry[]): TagFrequency[] {
  const counts = new Map<string, number>()
  for (const e of entries) {
    for (const tag of e.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export function computeProjectDistribution(
  entries: WorkEntry[],
): ProjectDistribution[] {
  const minutesByProject = new Map<string, number>()
  let totalMinutes = 0
  for (const e of entries) {
    if (!e.project) continue
    minutesByProject.set(
      e.project,
      (minutesByProject.get(e.project) ?? 0) + e.durationMinutes,
    )
    totalMinutes += e.durationMinutes
  }
  return [...minutesByProject.entries()]
    .map(([project, minutes]) => ({
      project,
      hours: Math.round((minutes / 60) * 10) / 10,
      percentage: totalMinutes
        ? Math.round((minutes / totalMinutes) * 1000) / 10
        : 0,
    }))
    .sort((a, b) => b.hours - a.hours)
}

export function computeLateNightStats(entries: WorkEntry[]): LateNightStats {
  const lateNight = entries.filter((e) => e.workedAfterHours)
  const byMonth = new Map<string, number>()
  for (const e of lateNight) {
    const key = e.date.slice(0, 7)
    byMonth.set(key, (byMonth.get(key) ?? 0) + 1)
  }
  return {
    totalSessions: lateNight.length,
    totalMinutes: lateNight.reduce((sum, e) => sum + e.durationMinutes, 0),
    byMonth: [...byMonth.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, sessions]) => {
        const [year, month] = key.split("-").map(Number)
        return {
          month: formatMonthYear(new Date(year, month - 1, 1)),
          sessions,
        }
      }),
  }
}
