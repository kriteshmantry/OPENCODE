import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FLAG = 'FLAG{h4ck_th3_pl4n3t_0xDEADBEEF}'

const HELP_TEXT = `Available commands:
  help       — show this message
  whoami     — club info
  ls         — list projects
  members    — team roster
  events     — upcoming CTFs & workshops
  cat flag.txt — 🏴 you know what you're looking for
  clear      — clear terminal
  exit       — close terminal`

const RESPONSES: Record<string, string> = {
  help: HELP_TEXT,
  whoami: `NullSec Collective — est. 2019
  Members: 214 active hackers
  Specialties: red team, CTF, vuln research, OSINT
  GitHub: github.com/nullsec-collective
  IRC: #nullsec @ libera.chat`,
  ls: `drwxr-xr-x  MemVault/        memory forensics toolkit
drwxr-xr-x  NullTrace/       network anonymizer
drwxr-xr-x  BruteForge/      password audit framework
drwxr-xr-x  CryptoMesh/      p2p encrypted messaging
drwxr-xr-x  VulnScan/        auto vulnerability scanner
drwxr-xr-x  PhishKit/        phishing simulation platform`,
  members: `root@nullsec ~ $ cat /etc/members
  [REDACTED] — Team Lead, pwn specialist
  0xAl1ce    — RE & malware analysis
  n3tw0rk_b  — network & OSINT
  cr4ckm3    — crypto & steganography
  gh0stwr1tr — web exploitation
  bl4ckh4t   — social engineering
  vuln_v1ctor — defensive security
  0day_0mar  — zero-day research`,
  events: `Upcoming events:
  [2026-10-15] NullCTF 2026 — 48h competition
  [2026-10-22] Workshop: Reverse Engineering 101
  [2026-11-01] BreakIn Hackathon (72h)
  [2026-11-10] Talk: Zero-Day Disclosure Ethics`,
  'cat flag.txt': `Decrypting... ████████████████ 100%

  🏴 ${FLAG}

  Congratulations. You found the Easter egg.
  Submit this to claim your exclusive NullSec sticker!`,
  clear: '__CLEAR__',
  exit: '__EXIT__',
  quit: '__EXIT__',
}

interface Line {
  type: 'input' | 'output' | 'error'
  text: string
}

const BOOT_LINES = [
  'NullSec Terminal v2.6.0',
  'Type "help" to list commands.',
  '─────────────────────────',
]

interface Props {
  onClose: () => void
}

export default function TerminalOverlay({ onClose }: Props) {
  const [lines, setLines] = useState<Line[]>(
    BOOT_LINES.map(text => ({ type: 'output', text }))
  )
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const submit = useCallback(() => {
    const cmd = input.trim().toLowerCase()
    if (!cmd) return

    setHistory(h => [cmd, ...h])
    setHistIdx(-1)
    setInput('')

    const newLine: Line = { type: 'input', text: `nullsec@terminal:~$ ${input.trim()}` }

    const response = RESPONSES[cmd]
    if (response === '__CLEAR__') {
      setLines(BOOT_LINES.map(text => ({ type: 'output', text })))
      return
    }
    if (response === '__EXIT__') {
      onClose()
      return
    }

    if (response) {
      setLines(l => [...l, newLine, { type: 'output', text: response }])
    } else {
      setLines(l => [
        ...l,
        newLine,
        { type: 'error', text: `bash: ${cmd}: command not found. Try "help".` },
      ])
    }
  }, [input, onClose])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(idx)
      setInput(history[idx] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = Math.max(histIdx - 1, -1)
      setHistIdx(idx)
      setInput(idx === -1 ? '' : history[idx])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className="w-full max-w-2xl bg-[#060a0b] border border-primary/30 rounded-sm shadow-2xl shadow-primary/10 overflow-hidden scanlines"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted border-b border-borderc">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-primary/70" />
            </div>
            <span className="text-xs text-muted-fg">nullsec-terminal — bash</span>
            <button
              onClick={onClose}
              className="text-muted-fg hover:text-fg text-xs transition-colors"
              aria-label="Close terminal"
            >
              ✕
            </button>
          </div>

          {/* Output */}
          <div
            className="h-80 overflow-y-auto p-4 text-sm leading-relaxed"
            onClick={() => inputRef.current?.focus()}
          >
            {lines.map((line, i) => (
              <div
                key={i}
                className={`whitespace-pre-wrap mb-1 ${
                  line.type === 'input'
                    ? 'text-primary'
                    : line.type === 'error'
                    ? 'text-warning'
                    : 'text-fg/80'
                }`}
              >
                {line.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input line */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-borderc">
            <span className="text-primary text-sm flex-shrink-0">nullsec@terminal:~$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              className="flex-1 bg-transparent text-primary text-sm outline-none caret-primary"
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal input"
            />
            <span className="cursor-blink text-primary text-sm">█</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
