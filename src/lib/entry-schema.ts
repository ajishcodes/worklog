import { z } from "zod"
import type { WorkEntry, WorkEntryDraft } from "@/types"
import { isHtmlContentEmpty, sanitizeHtml } from "@/lib/sanitize-html"

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine((val) => !val || /^https?:\/\/.+/.test(val), {
    message: "Must be a valid URL starting with http(s)://",
  })

export const entryFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z
    .string()
    .refine((val) => !isHtmlContentEmpty(val), "Description is required"),
  date: z.string().min(1, "Date is required"),
  durationMinutes: z
    .string()
    .min(1, "Duration is required")
    .refine((val) => Number.isInteger(Number(val)) && Number(val) > 0, {
      message: "Must be a whole number greater than 0",
    }),
  project: z.string().trim().optional(),
  tags: z.string().trim().optional(),
  githubUrl: optionalUrl,
  prUrl: optionalUrl,
  commitHash: z.string().trim().optional(),
  workedAfterHours: z.boolean(),
  status: z.enum(["completed", "in-progress", "blocked", "review"]),
  notes: z.string().trim().optional(),
})

export type EntryFormValues = z.infer<typeof entryFormSchema>

export const ENTRY_FORM_DEFAULTS: EntryFormValues = {
  title: "",
  description: "",
  date: "",
  durationMinutes: "30",
  project: "",
  tags: "",
  githubUrl: "",
  prUrl: "",
  commitHash: "",
  workedAfterHours: false,
  status: "completed",
  notes: "",
}

export function entryToFormValues(entry: WorkEntry): EntryFormValues {
  return {
    title: entry.title,
    description: entry.description,
    date: entry.date,
    durationMinutes: String(entry.durationMinutes),
    project: entry.project ?? "",
    tags: entry.tags.join(", "),
    githubUrl: entry.githubUrl ?? "",
    prUrl: entry.prUrl ?? "",
    commitHash: entry.commitHash ?? "",
    workedAfterHours: entry.workedAfterHours,
    status: entry.status,
    notes: entry.notes ?? "",
  }
}

export function formValuesToDraft(values: EntryFormValues): WorkEntryDraft {
  return {
    title: values.title,
    description: sanitizeHtml(values.description),
    date: values.date,
    durationMinutes: Number(values.durationMinutes),
    project: values.project || undefined,
    tags: values.tags
      ? values.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [],
    githubUrl: values.githubUrl || undefined,
    prUrl: values.prUrl || undefined,
    commitHash: values.commitHash || undefined,
    workedAfterHours: values.workedAfterHours,
    status: values.status,
    notes: values.notes && !isHtmlContentEmpty(values.notes)
      ? sanitizeHtml(values.notes)
      : undefined,
  }
}
