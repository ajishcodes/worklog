interface StatTileProps {
  label: string
  value: string
  hint?: string
}

export function StatTile({ label, value, hint }: StatTileProps) {
  return (
    <div className="border-r px-5 py-4 last:border-r-0">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  )
}
