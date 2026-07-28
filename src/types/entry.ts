export type EntryStatus = "completed" | "in-progress" | "blocked" | "review"

export interface WorkEntry {
  id: string
  date: string
  title: string
  description: string
  durationMinutes: number
  project?: string
  tags: string[]
  githubUrl?: string
  prUrl?: string
  commitHash?: string
  workedAfterHours: boolean
  status: EntryStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export type WorkEntryDraft = Omit<WorkEntry, "id" | "createdAt" | "updatedAt">
