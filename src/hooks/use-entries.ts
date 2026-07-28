import { useContext } from "react"
import { EntriesContext } from "@/components/entries-provider"

export function useEntries() {
  const ctx = useContext(EntriesContext)
  if (!ctx) throw new Error("useEntries must be used within an EntriesProvider")
  return ctx
}
