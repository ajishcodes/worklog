import { Input } from "@/components/ui/input"

interface DurationInputProps {
  value: string
  onChange: (minutes: string) => void
  onBlur?: () => void
}

export function DurationInput({ value, onChange, onBlur }: DurationInputProps) {
  const totalMinutes = Math.max(0, Number(value) || 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  function update(nextHours: number, nextMinutes: number) {
    const safeHours = Math.max(0, Math.floor(nextHours) || 0)
    const safeMinutes = Math.max(0, Math.min(59, Math.floor(nextMinutes) || 0))
    const total = safeHours * 60 + safeMinutes
    onChange(total > 0 ? String(total) : "")
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          type="number"
          min={0}
          inputMode="numeric"
          value={hours || ""}
          onChange={(e) => update(Number(e.target.value), minutes)}
          onBlur={onBlur}
          placeholder="0"
          className="pr-8"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          h
        </span>
      </div>
      <div className="relative flex-1">
        <Input
          type="number"
          min={0}
          max={59}
          inputMode="numeric"
          value={minutes || ""}
          onChange={(e) => update(hours, Number(e.target.value))}
          onBlur={onBlur}
          placeholder="0"
          className="pr-8"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          m
        </span>
      </div>
    </div>
  )
}
