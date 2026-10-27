import { useRef, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  /** Direction the scan travels while uncovering the content */
  from?: 'left' | 'top'
  /** Re-run each time the element scrolls back into view */
  repeat?: boolean
}

const HIDDEN = {
  left: 'inset(0% 100% 0% 0%)',
  top: 'inset(0% 0% 100% 0%)',
}

/**
 * Uncovers its content with a clip-path wipe led by a bright scan bar,
 * like a screen line being redrawn.
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  duration = 0.9,
  from = 'left',
  repeat = false,
}: Props) {
  const reduced = useReducedMotion()
  // Observe an unclipped wrapper: a fully clipped element never reports as visible
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: !repeat, amount: 0.25 })
  if (reduced) return <div className={className}>{children}</div>

  const horizontal = from === 'left'

  return (
    <div ref={ref} className={`relative ${className}`}>
    <motion.div
      className="relative"
      initial={{ clipPath: HIDDEN[from] }}
      animate={{ clipPath: inView ? 'inset(0% 0% 0% 0%)' : HIDDEN[from] }}
      transition={{ duration, delay, ease: [0.7, 0, 0.2, 1] }}
    >
      {children}
      <motion.span
        aria-hidden="true"
        className={`pointer-events-none absolute z-20 bg-primary ${
          horizontal ? 'top-0 bottom-0 w-[2px]' : 'left-0 right-0 h-[2px]'
        }`}
        style={{ boxShadow: '0 0 12px var(--primary), 0 0 24px var(--primary)' }}
        initial={horizontal ? { left: '0%', opacity: 1 } : { top: '0%', opacity: 1 }}
        animate={
          inView
            ? horizontal ? { left: '100%', opacity: 0 } : { top: '100%', opacity: 0 }
            : horizontal ? { left: '0%', opacity: 1 } : { top: '0%', opacity: 1 }
        }
        transition={{
          duration,
          delay,
          ease: [0.7, 0, 0.2, 1],
          opacity: { duration: 0.2, delay: delay + duration - 0.1 },
        }}
      />
    </motion.div>
    </div>
  )
}
