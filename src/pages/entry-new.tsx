import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { PageHeader } from "@/components/common/page-header"
import { EntryForm } from "@/components/entries/entry-form"
import { useEntries } from "@/hooks/use-entries"
import { formValuesToDraft } from "@/lib/entry-schema"
import { toISODate } from "@/lib/format"

export function EntryNewPage() {
  const navigate = useNavigate()
  const { addEntry } = useEntries()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="max-w-2xl">
      <Link
        to="/entries"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to entries
      </Link>

      <PageHeader title="New entry" description="Log a new piece of work." />

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <EntryForm
        defaultValues={{
          title: "",
          description: "",
          date: toISODate(new Date()),
          durationMinutes: "30",
          project: "",
          tags: "",
          githubUrl: "",
          prUrl: "",
          commitHash: "",
          workedAfterHours: false,
          status: "completed",
          notes: "",
        }}
        submitLabel="Create entry"
        onCancel={() => navigate("/entries")}
        onSubmit={async (values) => {
          setError(null)
          try {
            const entry = await addEntry(formValuesToDraft(values))
            navigate(`/entries/${entry.id}`)
          } catch {
            setError("Could not create the entry. Please try again.")
          }
        }}
      />
    </div>
  )
}
