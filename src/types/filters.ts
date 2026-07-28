import type { EntryStatus } from "./entry"

export interface EntryFilters {
  search: string
  projects: string[]
  tags: string[]
  statuses: EntryStatus[]
  dateFrom?: string
  dateTo?: string
  afterHoursOnly: boolean
}

export const EMPTY_ENTRY_FILTERS: EntryFilters = {
  search: "",
  projects: [],
  tags: [],
  statuses: [],
  afterHoursOnly: false,
}

export type EntrySortField = "date" | "duration" | "title" | "updatedAt"
export type SortDirection = "asc" | "desc"

export interface EntrySort {
  field: EntrySortField
  direction: SortDirection
}

export const DEFAULT_ENTRY_SORT: EntrySort = {
  field: "date",
  direction: "desc",
}
