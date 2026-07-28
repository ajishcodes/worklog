import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  ExternalLink,
  GitCommitHorizontal,
  GitPullRequest,
  Moon,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { PageHeader } from "@/components/common/page-header"
import { EntryForm } from "@/components/entries/entry-form"
import { useEntries } from "@/hooks/use-entries"
import { entryToFormValues, formValuesToDraft } from "@/lib/entry-schema"
import { formatDateLong, formatDuration, formatTime } from "@/lib/format"

const STATUS_LABEL: Record<string, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  blocked: "Blocked",
  review: "In review",
}

export function EntryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { entries, updateEntry, deleteEntry } = useEntries()
  const entry = entries.find((e) => e.id === id)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!entry) {
    return (
      <div>
        <Link
          to="/entries"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to entries
        </Link>
        <p className="text-sm text-muted-foreground">Entry not found.</p>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="max-w-2xl">
        <PageHeader title="Edit entry" />
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
        <EntryForm
          defaultValues={entryToFormValues(entry)}
          submitLabel="Save changes"
          onCancel={() => setIsEditing(false)}
          onSubmit={async (values) => {
            setError(null)
            try {
              await updateEntry(entry.id, formValuesToDraft(values))
              setIsEditing(false)
            } catch {
              setError("Could not save changes. Please try again.")
            }
          }}
        />
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <Link
        to="/entries"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to entries
      </Link>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {entry.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDateLong(entry.date)} &middot; {formatTime(entry.createdAt)}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="size-3.5" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove &ldquo;{entry.title}&rdquo; from
                  your worklog. This can&rsquo;t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={async () => {
                    try {
                      await deleteEntry(entry.id)
                      navigate("/entries")
                    } catch {
                      setError("Could not delete the entry. Please try again.")
                    }
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{STATUS_LABEL[entry.status]}</Badge>
        {entry.project && <Badge variant="outline">{entry.project}</Badge>}
        <Badge variant="outline">{formatDuration(entry.durationMinutes)}</Badge>
        {entry.workedAfterHours && (
          <Badge variant="outline" className="gap-1">
            <Moon className="size-3" />
            After hours
          </Badge>
        )}
        {entry.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="font-normal">
            {tag}
          </Badge>
        ))}
      </div>

      <section className="mb-8">
        <h2 className="mb-2 text-sm font-medium text-foreground">Description</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {entry.description}
        </p>
      </section>

      {entry.notes && (
        <section className="mb-8">
          <h2 className="mb-2 text-sm font-medium text-foreground">Notes</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {entry.notes}
          </p>
        </section>
      )}

      {(entry.githubUrl || entry.prUrl || entry.commitHash) && (
        <section>
          <h2 className="mb-2 text-sm font-medium text-foreground">Links</h2>
          <div className="flex flex-col gap-2 text-sm">
            {entry.githubUrl && (
              <a
                href={entry.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="size-3.5" />
                Repository
              </a>
            )}
            {entry.prUrl && (
              <a
                href={entry.prUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <GitPullRequest className="size-3.5" />
                Pull request
              </a>
            )}
            {entry.commitHash && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <GitCommitHorizontal className="size-3.5" />
                <code className="text-xs">{entry.commitHash}</code>
              </span>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
