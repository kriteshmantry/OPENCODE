import { motion, useScroll, useSpring } from 'framer-motion'

/** Thin read-progress bar pinned to the very top of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left bg-primary pointer-events-none"
      style={{ scaleX, boxShadow: '0 0 8px var(--primary)' }}
    />
  )
}
