import { createContext, useEffect, useMemo, useState } from "react"
import type { WorkEntry, WorkEntryDraft } from "@/types"
import { api } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

interface EntriesContextValue {
  entries: WorkEntry[]
  isLoading: boolean
  addEntry: (draft: WorkEntryDraft) => Promise<WorkEntry>
  updateEntry: (id: string, draft: WorkEntryDraft) => Promise<WorkEntry>
  deleteEntry: (id: string) => Promise<void>
}

export const EntriesContext = createContext<EntriesContextValue | null>(null)

export function EntriesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [entries, setEntries] = useState<WorkEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setEntries([])
      return
    }

    let cancelled = false
    setIsLoading(true)

    api
      .get<WorkEntry[]>("/entries")
      .then((data) => {
        if (!cancelled) setEntries(data)
      })
      .catch((err: unknown) => {
        console.error("Failed to load entries", err)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user])

  const value = useMemo<EntriesContextValue>(
    () => ({
      entries,
      isLoading,
      addEntry: async (draft) => {
        const entry = await api.post<WorkEntry>("/entries", draft)
        setEntries((prev) => [entry, ...prev])
        return entry
      },
      updateEntry: async (id, draft) => {
        const entry = await api.put<WorkEntry>(`/entries/${id}`, draft)
        setEntries((prev) => prev.map((e) => (e.id === id ? entry : e)))
        return entry
      },
      deleteEntry: async (id) => {
        await api.del(`/entries/${id}`)
        setEntries((prev) => prev.filter((e) => e.id !== id))
      },
    }),
    [entries, isLoading],
  )

  return (
    <EntriesContext.Provider value={value}>
      {children}
    </EntriesContext.Provider>
  )
}
