import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

interface Props {
  value: number
  /** Text appended after the number, e.g. "+" */
  suffix?: string
  duration?: number
  className?: string
}

/** Counts from zero to `value` the first time it scrolls into view. */
export default function CountUp({ value, suffix = '', duration = 1.6, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduced = useReducedMotion()
  const [current, setCurrent] = useState(reduced ? value : 0)

  useEffect(() => {
    if (!inView || reduced) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000))
      // easeOutExpo: fast spin-up, slow settle, like a counter locking in
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setCurrent(Math.round(value * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, value, duration])

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {current.toLocaleString('en-US')}
      {suffix}
    </span>
  )
}
