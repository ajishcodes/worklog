import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, SlidersHorizontal } from "lucide-react"
import { PageHeader } from "@/components/common/page-header"
import { EntryListItem } from "@/components/entries/entry-list-item"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEntries } from "@/hooks/use-entries"

const PAGE_SIZE = 30

export function EntriesPage() {
  const { entries } = useEntries()
  const [search, setSearch] = useState("")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const sorted = useMemo(
    () => [...entries].sort((a, b) => b.date.localeCompare(a.date)),
    [entries],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return sorted
    return sorted.filter(
      (entry) =>
        entry.title.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.project?.toLowerCase().includes(q) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(q)),
    )
  }, [sorted, search])

  const visible = filtered.slice(0, visibleCount)

  return (
    <div>
      <PageHeader
        title="Entries"
        description={`${filtered.length} entries logged`}
        action={
          <Button asChild size="sm" className="gap-1.5">
            <Link to="/entries/new">
              <Plus className="size-4" />
              New entry
            </Link>
          </Button>
        }
      />

      <div className="mb-6 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setVisibleCount(PAGE_SIZE)
            }}
            placeholder="Search entries, projects, tags..."
            className="pl-8"
          />
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground">
          <SlidersHorizontal className="size-3.5" />
          Filters
        </Button>
      </div>

      {visible.length === 0 ? (
        <p className="border-b py-3 text-sm text-muted-foreground">
          No entries match your search.
        </p>
      ) : (
        <div>
          {visible.map((entry) => (
            <EntryListItem key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {visibleCount < filtered.length && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  )
}
