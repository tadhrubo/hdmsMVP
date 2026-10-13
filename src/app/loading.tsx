import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] gap-3 text-muted-foreground animate-in fade-in duration-150">
      <Loader2 className="size-6 animate-spin text-[var(--color-ink-tertiary)]" />
      <span className="text-[11px] font-medium tracking-widest uppercase text-[var(--color-ink-tertiary)] select-none">
        Loading HDMS…
      </span>
    </div>
  )
}
