import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const BARS = 6

/**
 * On every route change, a stack of horizontal shutters retracts off the new
 * page while the shell prints the `cd` that got us here.
 */
export default function RouteTransition() {
  const { pathname } = useLocation()
  const reduced = useReducedMotion()
  const first = useRef(true)
  const [run, setRun] = useState<{ id: number; path: string } | null>(null)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (reduced) return
    setRun({ id: Date.now(), path: pathname })
    const t = setTimeout(() => setRun(null), 1100)
    return () => clearTimeout(t)
  }, [pathname, reduced])

  return (
    <AnimatePresence>
      {run && (
        <motion.div
          key={run.id}
          className="fixed inset-0 z-[70] pointer-events-none flex flex-col"
          aria-hidden="true"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          {Array.from({ length: BARS }).map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-bg border-b border-primary/20 origin-right"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 0.55, delay: 0.25 + i * 0.05, ease: [0.7, 0, 0.2, 1] }}
            />
          ))}
          <motion.div
            className="absolute inset-0 flex items-center justify-center font-mono text-sm md:text-base text-primary"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <span className="text-muted-fg mr-2">$</span>cd {run.path === '/' ? '~' : run.path}
            <span className="cursor-blink ml-1">_</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
