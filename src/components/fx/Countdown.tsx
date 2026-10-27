import { useEffect, useState } from 'react'

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

/**
 * Parses the start moment out of display strings like
 * ("Nov 1–3, 2026", "72 hours") or ("Oct 22, 2026", "5:30 PM – 8:30 PM").
 */
export function parseEventStart(date: string, time: string): Date | null {
  const d = date.match(/([A-Z][a-z]{2})\s+(\d{1,2})(?:[–-]\d{1,2})?,\s*(\d{4})/)
  if (!d || MONTHS[d[1]] === undefined) return null
  let hours = 0
  let minutes = 0
  const t = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (t) {
    hours = (Number(t[1]) % 12) + (t[3].toUpperCase() === 'PM' ? 12 : 0)
    minutes = Number(t[2])
  }
  return new Date(Number(d[3]), MONTHS[d[1]], Number(d[2]), hours, minutes)
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Live T-minus readout ticking down to an event's start. */
export default function Countdown({ date, time }: { date: string; time: string }) {
  const start = parseEventStart(date, time)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!start) return null

  const diff = start.getTime() - now
  if (diff <= 0) {
    return (
      <div className="font-mono text-[11px] text-muted-fg uppercase tracking-widest">
        status: <span className="text-fg/70">underway or concluded</span>
      </div>
    )
  }

  const s = Math.floor(diff / 1000)
  const units = [
    { v: Math.floor(s / 86400), l: 'D' },
    { v: Math.floor((s % 86400) / 3600), l: 'H' },
    { v: Math.floor((s % 3600) / 60), l: 'M' },
    { v: s % 60, l: 'S' },
  ]

  return (
    <div className="relative overflow-hidden border border-primary/25 bg-primary/5 px-3 py-2 font-mono">
      <span className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-primary/10 to-transparent signal-sweep pointer-events-none" />
      <div className="relative flex items-baseline justify-between gap-3">
        <span className="text-[10px] text-muted-fg uppercase tracking-[0.2em]">T-minus</span>
        <span className="flex items-baseline gap-2 text-primary tabular-nums">
          {units.map(u => (
            <span key={u.l} className="text-sm font-bold">
              {pad(u.v)}
              <span className="text-[9px] text-muted-fg ml-0.5 font-normal">{u.l}</span>
            </span>
          ))}
        </span>
      </div>
    </div>
  )
}
