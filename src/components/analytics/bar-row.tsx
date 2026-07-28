interface BarRowProps {
  label: string
  value: string
  fraction: number
}

export function BarRow({ label, value, fraction }: BarRowProps) {
  return (
    <div className="flex items-center gap-3 py-1.5 text-sm">
      <span className="w-32 shrink-0 truncate text-muted-foreground">
        {label}
      </span>
      <div className="h-1.5 flex-1 rounded-full bg-muted">
        <div
          className="h-1.5 rounded-full bg-foreground/70"
          style={{ width: `${Math.max(fraction * 100, 3)}%` }}
        />
      </div>
      <span className="w-14 shrink-0 text-right text-foreground">{value}</span>
    </div>
  )
}
