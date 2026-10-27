import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface Props {
  lines: ReactNode[]
  className?: string
  /** Seconds between consecutive lines */
  stagger?: number
  delay?: number
}

/**
 * Prints terminal/code lines one after another as the block scrolls into view,
 * with a block cursor parked on the last line.
 */
export default function TypedLines({ lines, className = '', stagger = 0.14, delay = 0.2 }: Props) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {lines.map((line, i) => (
        <motion.div
          key={i}
          className="whitespace-pre"
          variants={
            reduced
              ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
              : {
                  hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
                  show: {
                    opacity: 1,
                    clipPath: 'inset(0 0% 0 0)',
                    transition: { duration: 0.35, ease: 'linear' },
                  },
                }
          }
        >
          {line}
          {i === lines.length - 1 && (
            <span className="cursor-blink ml-0.5 inline-block w-[0.55em] h-[1.05em] align-text-bottom bg-primary/80" />
          )}
          {line === '' && ' '}
        </motion.div>
      ))}
    </motion.div>
  )
}
