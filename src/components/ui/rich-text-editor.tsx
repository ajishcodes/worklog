import { useEffect, useRef } from "react"
import { Bold, Italic, Link as LinkIcon, List, ListOrdered, Underline } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  onBlur?: () => void
  placeholder?: string
  className?: string
  minHeightClassName?: string
}

const TOOLBAR_ACTIONS = [
  { command: "bold", icon: Bold, label: "Bold" },
  { command: "italic", icon: Italic, label: "Italic" },
  { command: "underline", icon: Underline, label: "Underline" },
  { command: "insertUnorderedList", icon: List, label: "Bulleted list" },
  { command: "insertOrderedList", icon: ListOrdered, label: "Numbered list" },
] as const

export function RichTextEditor({
  value,
  onChange,
  onBlur,
  placeholder,
  className,
  minHeightClassName = "min-h-24",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const isFocused = useRef(false)
  const isEmpty = !value || value === "<br>"

  useEffect(() => {
    const node = editorRef.current
    if (!node || isFocused.current) return
    if (node.innerHTML !== value) node.innerHTML = value || ""
  }, [value])

  function exec(command: string, arg?: string) {
    editorRef.current?.focus()
    document.execCommand(command, false, arg)
    onChange(editorRef.current?.innerHTML ?? "")
  }

  function handleLink() {
    const url = window.prompt("Link URL")
    if (url) exec("createLink", url)
  }

  return (
    <div
      className={cn(
        "rounded-md border border-input shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        className,
      )}
    >
      <div className="flex items-center gap-0.5 border-b px-1.5 py-1">
        {TOOLBAR_ACTIONS.map((action) => (
          <Button
            key={action.command}
            type="button"
            variant="ghost"
            size="icon-xs"
            title={action.label}
            aria-label={action.label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec(action.command)}
          >
            <action.icon />
          </Button>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          title="Insert link"
          aria-label="Insert link"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleLink}
        >
          <LinkIcon />
        </Button>
      </div>
      <div className="relative">
        {isEmpty && placeholder && (
          <span className="pointer-events-none absolute left-3 top-2 text-sm text-muted-foreground">
            {placeholder}
          </span>
        )}
        <div
          ref={editorRef}
          contentEditable
          role="textbox"
          aria-multiline="true"
          aria-label={placeholder}
          className={cn(
            "w-full overflow-y-auto px-3 py-2 text-sm outline-none",
            "[&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
            minHeightClassName,
          )}
          onFocus={() => {
            isFocused.current = true
          }}
          onBlur={() => {
            isFocused.current = false
            onBlur?.()
          }}
          onInput={() => onChange(editorRef.current?.innerHTML ?? "")}
        />
      </div>
    </div>
  )
}
