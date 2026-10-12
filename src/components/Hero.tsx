import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TextReveal } from './ui/cascade-text'
import { ShinyButton } from './ui/shiny-button'

interface HeroProps {
  onJoinClick?: () => void
}

export default function Hero({ onJoinClick }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showContent, setShowContent] = useState(false)
  const [titleText, setTitleText] = useState('')
  const animRef = useRef<number>(0)

  // Looping Typewriter effect cycling through: OPENCODE -> OPEN SOURCE -> CYBERSEC
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setTitleText('OPENCODE')
      setShowContent(true)
      return
    }

    const PHRASES = ['OPENCODE', 'OPENSOURCE', 'CYBERSEC']
    let isMounted = true
    let timeoutId: ReturnType<typeof setTimeout>
    let phraseIndex = 0
    let charIndex = 0
    let isDeleting = false

    function tick() {
      if (!isMounted) return

      const currentTarget = PHRASES[phraseIndex]

      if (!isDeleting) {
        // Typing forward
        charIndex++
        setTitleText(currentTarget.slice(0, charIndex))

        if (charIndex === currentTarget.length) {
          setShowContent(true)
          // Hold for 1.5s when word is completely typed
          isDeleting = true
          timeoutId = setTimeout(tick, 1500)
          return
        }
        timeoutId = setTimeout(tick, 100)
      } else {
        // Backspacing smoothly
        charIndex--
        setTitleText(currentTarget.slice(0, charIndex))

        if (charIndex === 0) {
          // Switch to next phrase in loop
          isDeleting = false
          phraseIndex = (phraseIndex + 1) % PHRASES.length
          timeoutId = setTimeout(tick, 350)
          return
        }
        timeoutId = setTimeout(tick, 50)
      }
    }

    timeoutId = setTimeout(tick, 200)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [])

  // Interactive particle network canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let nodes: Node[] = []
    let mouseX = -9999
    let mouseY = -9999

    interface Node {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string
    }

    function resize() {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
      initNodes()
    }

    function initNodes() {
      const count = Math.min(Math.floor((width * height) / 12000), 70)
      nodes = []
      const colors = ['#00ff41', '#00d4ff', '#39ff14', '#00ffaa']
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, width, height)

      if (prefersReduced) return

      // Draw connections
      const maxDist = 120
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.2
            ctx.strokeStyle = `rgba(0, 255, 65, ${alpha})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1

        // Mouse repulse
        const mdx = node.x - mouseX
        const mdy = node.y - mouseY
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mdist < 100) {
          node.x += (mdx / mdist) * 1.5
          node.y += (mdy / mdist) * 1.5
        }

        ctx.fillStyle = node.color
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(() => resize())
    ro.observe(canvas)
    resize()
    draw()

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden grid-bg pt-20 pb-16">
      {/* Particle network background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.65 }}
        aria-hidden="true"
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 35%, var(--bg) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Main Hero Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
        {/* Sub-badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-primary/30 bg-primary/10 font-mono text-xs text-primary"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>National Institute of Technology, Rourkela</span>
        </motion.div>

        {/* Typewriter Title */}
        <h1 className="font-mono text-6xl md:text-8xl lg:text-9xl font-black text-primary tracking-tight mb-6 glow-text min-h-[1.15em] flex items-center justify-center select-none">
          <span>{titleText}</span>
          <span className="cursor-blink text-primary ml-1">_</span>
        </h1>

        {/* Subtitle and CTAs revealed on completion */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="font-mono text-muted-fg text-base md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span className="text-accent font-bold">&gt;</span>
            <TextReveal
              as="span"
              text="Open Source & Cybersecurity Club."
              fontSize="1.15rem"
              hoverColor="#00ff41"
              className="normal-case font-mono font-medium"
              staggerDelay={20}
              duration={260}
            />
            <TextReveal
              as="span"
              text="Systems hackers, kernel contributors, CTF finalists, and researchers."
              fontSize="1.05rem"
              hoverColor="#00d4ff"
              className="normal-case font-mono font-normal opacity-90"
              staggerDelay={12}
              duration={240}
            />
          </div>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-3.5 relative z-10">
            {/* Primary Join Button */}
            <ShinyButton
              label="JOIN OPENCODE"
              onClick={onJoinClick}
              accentColor="#00ff41"
              accentSoftColor="#80ff9f"
              fillColor="#041207"
              labelColor="#00ff41"
              cornerRadius={24}
              sweepDuration={2.6}
              arcWidth={7}
              className="!py-3 !px-8 font-mono text-sm font-bold shadow-[0_0_20px_rgba(0,255,65,0.22)] hover:shadow-[0_0_35px_rgba(0,255,65,0.45)] transition-shadow cursor-pointer select-none"
            />

            {/* Secondary Buttons Row */}
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <motion.a
                href="#domains"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-7 py-3.5 font-mono text-sm border border-accent/60 text-accent hover:border-accent hover:bg-accent/15 transition-colors rounded-sm font-bold"
              >
                explore domains
              </motion.a>
              <motion.a
                href="https://github.com/nullsec-collective"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-6 py-3.5 font-mono text-sm border border-borderc text-muted-fg hover:text-fg hover:border-fg/40 transition-colors rounded-sm flex items-center gap-2"
              >
                <GithubIcon />
                github org ↗
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none hidden sm:flex"
        >
          <span className="font-mono text-[10px] text-muted-fg uppercase tracking-widest">scroll</span>
          <div className="w-4 h-7 border border-muted-fg/40 rounded-full flex items-start justify-center pt-1">
            <div className="w-1 h-1.5 bg-muted-fg/60 rounded-full scroll-dot" />
          </div>
        </motion.div>
      )}
    </section>
  )
}

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}
