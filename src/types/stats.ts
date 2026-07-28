export interface DashboardStats {
  hoursThisWeek: number
  entriesToday: number
  lateNightSessionsThisWeek: number
  currentStreakDays: number
}

export interface MonthlyHours {
  month: string
  hours: number
}

export interface TagFrequency {
  tag: string
  count: number
}

export interface ProjectDistribution {
  project: string
  hours: number
  percentage: number
}

export interface LateNightStats {
  totalSessions: number
  totalMinutes: number
  byMonth: { month: string; sessions: number }[]
}
