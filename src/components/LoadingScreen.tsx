import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const BOOT_SEQUENCE = [
  { text: 'BIOS v4.2.0 — OpenCode NIT Rourkela Hardware Interface', delay: 120 },
  { text: 'Initializing memory subsystem... OK', delay: 350 },
  { text: 'Loading kernel modules: crypto/net/exploit/foss... OK', delay: 600 },
  { text: 'Mounting encrypted volumes... OK', delay: 900 },
  { text: 'Establishing secure channel... ', delay: 1200 },
  { text: 'Establishing secure channel... CONNECTED', delay: 1500, replace: true },
  { text: 'Decrypting payload... ████████████████ 100%', delay: 1800 },
  { text: 'Running integrity checks... PASSED', delay: 2100 },
  { text: '', delay: 2300 },
  { text: 'ACCESS GRANTED // SYSTEM READY', delay: 2450, highlight: true },
]

interface BootLine {
  text: string
  highlight?: boolean
}

interface Props {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: Props) {
  const [bootLines, setBootLines] = useState<BootLine[]>([])
  const [bootDone, setBootDone] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return p + 5
      })
    }, 90)

    BOOT_SEQUENCE.forEach((item) => {
      timeouts.push(
        setTimeout(() => {
          setBootLines(prev => {
            if (item.replace && prev.length > 0) {
              return [...prev.slice(0, -1), { text: item.text, highlight: item.highlight }]
            }
            if (item.text === '') return [...prev, { text: '' }]
            return [...prev, { text: item.text, highlight: item.highlight }]
          })
        }, item.delay)
      )
    })

    // Enable ready state
    timeouts.push(
      setTimeout(() => {
        setBootDone(true)
      }, 2550)
    )

    // Keyboard listener: Enter, Space, Escape, or any key to enter
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape' || e.key.length === 1) {
        onComplete()
      }
    }
    window.addEventListener('keydown', handleKey)

    return () => {
      timeouts.forEach(clearTimeout)
      clearInterval(progressInterval)
      window.removeEventListener('keydown', handleKey)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      onClick={onComplete}
      className="fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center p-4 font-mono select-none cursor-pointer"
      style={{
        backgroundImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,255,65,0.08), transparent 80%)',
      }}
    >
      {/* Terminal Window */}
      <div
        className="w-full max-w-2xl rounded-sm border border-borderc overflow-hidden shadow-2xl relative"
        style={{ background: 'rgba(13,22,24,0.96)', backdropFilter: 'blur(12px)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-borderc bg-muted/70">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-primary/80" />
            <span className="ml-2 text-xs text-muted-fg font-bold">opencode — bash — 80×24</span>
          </div>
          <button
            onClick={onComplete}
            className="text-[11px] text-muted-fg hover:text-primary transition-colors cursor-pointer px-2 py-0.5 border border-borderc/60 rounded flex items-center gap-1"
          >
            <span>Skip</span>
            <span className="text-[10px] bg-muted px-1 rounded">↵</span>
          </button>
        </div>

        {/* Boot output text */}
        <div className="p-5 font-mono text-xs md:text-sm min-h-[240px] space-y-1.5 overflow-hidden">
          {bootLines.map((line, i) => (
            <div
              key={i}
              className={`leading-relaxed ${
                line.highlight
                  ? 'text-primary font-bold glow-text mt-3 text-sm md:text-base tracking-wide flex items-center gap-2'
                  : line.text === ''
                  ? 'h-2'
                  : 'text-fg/80'
              }`}
            >
              <span>{line.text}</span>
              {line.highlight && (
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping" />
              )}
            </div>
          ))}
          {!bootDone && (
            <span className="cursor-blink text-primary text-sm inline-block">█</span>
          )}
        </div>

        {/* Progress Bar at bottom */}
        <div className="h-1 w-full bg-muted/40 overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>
      </div>

      {/* Prominent Enter Button & Instructions */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <motion.button
          onClick={onComplete}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3.5 bg-primary text-bg font-bold font-mono text-sm rounded-sm hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 flex items-center gap-2.5 cursor-pointer border border-primary/50"
        >
          <span>$ ENTER OPENCODE PLATFORM</span>
          <span className="px-1.5 py-0.5 bg-bg text-primary text-xs rounded font-bold border border-primary/40">
            ↵ ENTER
          </span>
        </motion.button>

        <div className="text-xs text-muted-fg font-mono flex items-center gap-2">
          <span>Click anywhere or press</span>
          <kbd className="px-1.5 py-0.5 bg-card border border-borderc rounded text-[11px] text-fg font-bold">
            ENTER ↵
          </kbd>
          <span>to continue</span>
        </div>
      </div>
    </motion.div>
  )
}
