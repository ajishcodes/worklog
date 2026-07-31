import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DurationInput } from "@/components/entries/duration-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  ENTRY_FORM_DEFAULTS,
  entryFormSchema,
  type EntryFormValues,
} from "@/lib/entry-schema"
import type { EntryStatus } from "@/types"

const STATUS_OPTIONS: { value: EntryStatus; label: string }[] = [
  { value: "completed", label: "Completed" },
  { value: "in-progress", label: "In progress" },
  { value: "review", label: "In review" },
  { value: "blocked", label: "Blocked" },
]

function FieldTooltip({
  value,
  children,
}: {
  value?: string
  children: React.ReactNode
}) {
  if (!value) return children

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="max-w-xs break-all">{value}</TooltipContent>
    </Tooltip>
  )
}

interface EntryFormProps {
  defaultValues?: EntryFormValues
  submitLabel: string
  onSubmit: (values: EntryFormValues) => void
  onCancel: () => void
}

export function EntryForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: EntryFormProps) {
  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entryFormSchema),
    defaultValues: defaultValues ?? ENTRY_FORM_DEFAULTS,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <FieldTooltip value={field.value}>
                  <Input placeholder="Fix flaky export pipeline test" {...field} />
                </FieldTooltip>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="durationMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <DurationInput
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="project"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <FormControl>
                  <FieldTooltip value={field.value}>
                    <Input placeholder="Worklog" {...field} />
                  </FieldTooltip>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <FieldTooltip value={field.value}>
                    <Input placeholder="bugfix, api, testing" {...field} />
                  </FieldTooltip>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="What did you work on?"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Anything else worth remembering?"
                  minHeightClassName="min-h-16"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="githubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repository URL</FormLabel>
                <FormControl>
                  <FieldTooltip value={field.value}>
                    <Input placeholder="https://github.com/..." {...field} />
                  </FieldTooltip>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pull request URL</FormLabel>
                <FormControl>
                  <FieldTooltip value={field.value}>
                    <Input placeholder="https://github.com/.../pull/1" {...field} />
                  </FieldTooltip>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="commitHash"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commit hash</FormLabel>
                <FormControl>
                  <FieldTooltip value={field.value}>
                    <Input placeholder="a1b2c3d" {...field} />
                  </FieldTooltip>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="workedAfterHours"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border px-4 py-3">
              <FormLabel className="!mt-0">Worked after hours</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={form.formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" loading={form.formState.isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
