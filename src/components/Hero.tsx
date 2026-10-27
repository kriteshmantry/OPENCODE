import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShinyButton } from './ui/shiny-button'

interface HeroProps {
  onJoinClick?: () => void
  theme?: 'green' | 'blue'
  /** False while the boot screen still covers the page; the intro waits for it */
  ready?: boolean
}

/** Editor line height in px; the gutter, cursor line and status bar all share it */
const LINE = 24
const CHAR = 8.4

// The kind of code the club actually writes, scrolling behind the wordmark
const SOURCE = `// opencode/core/src/lib.rs
pub mod kernel;
pub mod exploit;
use std::sync::{Arc, Mutex};

#[derive(Debug, Clone)]
pub struct Member { handle: String, track: Track, commits: u64 }

impl Member {
    pub fn ship(&mut self, patch: Patch) -> Result<Merged, Review> {
        patch.sign_off(&self.handle)?.send_upstream()
    }
}

/* drivers/net/opencode_nic.c */
static int oc_probe(struct pci_dev *pdev, const struct pci_device_id *id)
{
    int err = pci_enable_device(pdev);
    if (err)
        return dev_err_probe(&pdev->dev, err, "enable failed\\n");
    return 0;
}

# exploit/ret2libc.py
from pwn import *
elf  = ELF("./vuln"); libc = ELF("./libc.so.6")
rop  = ROP(elf)
rop.call("puts", [elf.got["puts"]])
payload = flat({ 72: rop.chain() })
io.sendlineafter(b"> ", payload)

SEC("tracepoint/syscalls/sys_enter_execve")
int trace_execve(struct trace_event_raw_sys_enter *ctx) {
    bpf_printk("exec by pid %d\\n", bpf_get_current_pid_tgid() >> 32);
    return 0;
}

$ git clone https://github.com/OpencodeNIT-R/vulnscan.git
$ git checkout -b fix/heap-overflow
$ git commit -s -m "mm: bound check before memcpy in parser"
$ git push origin fix/heap-overflow

fn verify(proof: &Proof, vk: &VerifyingKey) -> bool {
    pairing(proof.a, proof.b) == pairing(vk.alpha, vk.beta) * pairing(proof.c, vk.delta)
}

flag = bytes(a ^ b for a, b in zip(cipher, key))   # FLAG{0p3n_th3_c0d3}
`

const TICKER = [
  '200+ MEMBERS',
  '12 OPEN-SOURCE TOOLS',
  '148 UPSTREAM PRs',
  'RUST',
  'LINUX KERNEL',
  'eBPF',
  'REVERSE ENGINEERING',
  'CTF',
  'APPLIED CRYPTOGRAPHY',
  'DISTRIBUTED SYSTEMS',
  'MIT LICENSED',
  'EST. 2019',
]

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFX$%&'

/**
 * Letters churn through glyphs and settle left to right, as if the word is
 * being decompiled. Hovering the word runs it again.
 */
function ScrambleWord({ text, run, delay = 0, className, style }: {
  text: string
  run: boolean
  delay?: number
  className?: string
  style?: React.CSSProperties
}) {
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(() =>
    reduced ? text : text.replace(/./g, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]),
  )
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const scramble = (startDelay: number) => {
    if (reduced) return
    if (timer.current) clearInterval(timer.current)
    let frame = -Math.round(startDelay / 30)
    timer.current = setInterval(() => {
      frame++
      if (frame < 0) return
      setShown(
        text
          .split('')
          .map((ch, i) => (frame > 6 + i * 3 ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(''),
      )
      if (frame > 6 + text.length * 3) {
        clearInterval(timer.current!)
        timer.current = null
        setShown(text)
      }
    }, 30)
  }

  useEffect(() => {
    if (run) scramble(delay)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])

  return (
    <span className={className} style={style} onMouseEnter={() => scramble(0)}>
      {shown}
    </span>
  )
}

export default function Hero({ onJoinClick, theme = 'green', ready = true }: HeroProps) {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const cursorLineRef = useRef<HTMLDivElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)
  const lnColRef = useRef<HTMLSpanElement>(null)
  const [opened, setOpened] = useState(false)
  const [settled, setSettled] = useState(false)

  // Intro: braces appear shut, then part to let the name out
  useEffect(() => {
    if (!ready) return
    if (reduced) {
      setOpened(true)
      setSettled(true)
      return
    }
    const a = setTimeout(() => setOpened(true), 650)
    const b = setTimeout(() => setSettled(true), 1500)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [ready, reduced])

  // Scrolling away lifts the wordmark out while the code wall stays put
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -160])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  // Pointer drives the spotlight, the editor's current line and the Ln/Col readout.
  // Written straight to the DOM so moving the mouse never re-renders the hero.
  const handlePointer = (e: React.PointerEvent) => {
    const section = sectionRef.current
    const body = bodyRef.current
    if (!section || !body) return
    const s = section.getBoundingClientRect()
    section.style.setProperty('--mx', `${e.clientX - s.left}px`)
    section.style.setProperty('--my', `${e.clientY - s.top}px`)

    const b = body.getBoundingClientRect()
    const y = e.clientY - b.top
    if (y < 0 || y > b.height) return
    const line = Math.floor(y / LINE)
    const col = Math.max(1, Math.floor((e.clientX - b.left) / CHAR) + 1)
    if (cursorLineRef.current) cursorLineRef.current.style.transform = `translateY(${line * LINE}px)`
    if (gutterRef.current) {
      gutterRef.current.querySelector('.is-current')?.classList.remove('is-current', 'text-primary')
      gutterRef.current.children[line]?.classList.add('is-current', 'text-primary')
    }
    if (lnColRef.current) lnColRef.current.textContent = `Ln ${line + 1}, Col ${col}`
  }

  const isBlue = theme === 'blue'
  const wordSize = 'text-[clamp(2.6rem,11.5vw,10rem)]'

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointer}
      className="relative min-h-[100svh] flex flex-col overflow-hidden bg-bg pt-16"
      style={{ '--mx': '50%', '--my': '45%' } as React.CSSProperties}
    >
      <style>{`
        @keyframes code-scroll { to { transform: translateY(-50%); } }
        @keyframes ticker-run { to { transform: translateX(-50%); } }
        .code-scroll { animation: code-scroll 90s linear infinite; }
        .ticker-run { animation: ticker-run 40s linear infinite; }
        .hero-spotlight {
          -webkit-mask-image: radial-gradient(circle 240px at var(--mx) var(--my), #000 0%, rgba(0,0,0,.35) 45%, transparent 75%);
                  mask-image: radial-gradient(circle 240px at var(--mx) var(--my), #000 0%, rgba(0,0,0,.35) 45%, transparent 75%);
        }
        @media (prefers-reduced-motion: reduce) {
          .code-scroll, .ticker-run { animation: none; }
        }
      `}</style>

      {/* ── Code wall: dim everywhere, lit where the pointer looks ── */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <CodeLayer className="text-muted-fg/35" />
        <div className="absolute inset-0 hero-spotlight">
          <CodeLayer className="text-primary/70" />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 50%, var(--bg) 25%, transparent 80%), linear-gradient(to bottom, var(--bg) 0%, transparent 18%, transparent 80%, var(--bg) 100%)',
          }}
        />
      </div>

      {/* ── Editor tab bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex items-stretch h-9 border-y border-borderc bg-card/80 backdrop-blur-sm font-mono text-[11px]"
      >
        <div className="flex items-center gap-2 px-4 border-r border-borderc border-t-2 border-t-primary bg-bg text-fg">
          <span className="text-warning">◆</span> opencode.rs
          <span className="text-muted-fg ml-1">×</span>
        </div>
        <div className="hidden sm:flex items-center px-4 border-r border-borderc text-muted-fg">README.md</div>
        <div className="hidden md:flex items-center px-4 border-r border-borderc text-muted-fg">LICENSE</div>
        <div className="ml-auto hidden lg:flex items-center gap-4 px-4 text-muted-fg tracking-widest">
          <span>NIT ROURKELA</span>
          <span className="text-primary/70">22.2532°N 84.9010°E</span>
        </div>
      </motion.div>

      {/* ── Editor body ── */}
      <div ref={bodyRef} className="relative z-10 flex-1 flex">
        {/* Current line highlight */}
        <div
          ref={cursorLineRef}
          className="absolute left-0 right-0 top-0 h-6 bg-primary/[0.04] border-y border-primary/10 pointer-events-none transition-transform duration-75"
          aria-hidden="true"
        />

        {/* Line-number gutter */}
        <div
          ref={gutterRef}
          className="hidden sm:block absolute top-0 bottom-0 left-0 w-12 border-r border-borderc bg-bg/60 font-mono text-[11px] text-muted-fg/50 text-right pr-3 overflow-hidden select-none"
          aria-hidden="true"
        >
          {Array.from({ length: 60 }, (_, i) => (
            <div key={i} className="h-6 leading-6 transition-colors">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Centrepiece */}
        <motion.div
          className="flex-1 flex flex-col items-center justify-center px-5 sm:pl-16 py-10 text-center"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={settled ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="font-mono text-[11px] sm:text-xs text-muted-fg tracking-[0.25em] uppercase mb-6"
          >
            <span className="text-accent">//</span> open source &amp; cybersecurity club · est. 2019
          </motion.p>

          {/* Wordmark: a code block that opens */}
          <h1 className={`font-mono font-black leading-none tracking-tight ${wordSize} flex items-center justify-center select-none`}>
            <span className="sr-only">OpenCode</span>
            <motion.span
              layout
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={ready ? { opacity: 1, scale: 1 } : {}}
              transition={{ layout: { duration: 0.8, ease: [0.7, 0, 0.2, 1] }, duration: 0.4 }}
              className="font-light text-accent"
            >
              {'{'}
            </motion.span>

            {opened && (
              <motion.span
                aria-hidden="true"
                initial={reduced ? false : { clipPath: 'inset(0 50% 0 50%)' }}
                animate={{ clipPath: 'inset(0 0% 0 0%)' }}
                transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
                className="flex px-[0.08em]"
              >
                <ScrambleWord
                  text="OPEN"
                  run={opened}
                  delay={150}
                  className="text-transparent cursor-default"
                  style={{ WebkitTextStroke: `clamp(1px, 0.25vw, 2.5px) var(--primary)` }}
                />
                <ScrambleWord
                  text="CODE"
                  run={opened}
                  delay={350}
                  className={`text-primary cursor-default ${settled ? 'glow-text' : ''}`}
                />
              </motion.span>
            )}

            <motion.span
              layout
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={ready ? { opacity: 1, scale: 1 } : {}}
              transition={{ layout: { duration: 0.8, ease: [0.7, 0, 0.2, 1] }, duration: 0.4 }}
              className="font-light text-accent"
            >
              {'}'}
            </motion.span>
          </h1>

          {/* Underline rule that extends from the centre once the block is open */}
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={settled ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
            className="h-px w-full max-w-3xl mt-6 mb-8 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          />

          <motion.div
            initial="hidden"
            animate={settled ? 'show' : 'hidden'}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            className="flex flex-col items-center"
          >
            <motion.p
              variants={RISE}
              className="font-mono text-sm md:text-lg text-fg max-w-2xl leading-relaxed"
            >
              We read the source. We write the patch.{' '}
              <span className="text-primary">We break it before anyone else does.</span>
            </motion.p>
            <motion.p variants={RISE} className="font-mono text-xs md:text-sm text-muted-fg mt-3 mb-10">
              Systems hackers, kernel contributors, CTF finalists, and researchers at NIT Rourkela.
            </motion.p>

            <motion.div variants={RISE} className="flex flex-col sm:flex-row items-center gap-3">
              <ShinyButton
                label="JOIN OPENCODE"
                onClick={onJoinClick}
                accentColor={isBlue ? '#1C6DFD' : '#00ff41'}
                accentSoftColor={isBlue ? '#93c5fd' : '#80ff9f'}
                fillColor={isBlue ? '#051026' : '#041207'}
                labelColor={isBlue ? '#1C6DFD' : '#00ff41'}
                cornerRadius={0}
                sweepDuration={2.6}
                arcWidth={7}
                className={`!py-3.5 !px-8 font-mono text-sm font-bold transition-shadow cursor-pointer select-none ${
                  isBlue
                    ? 'shadow-[0_0_20px_rgba(28,109,253,0.3)] hover:shadow-[0_0_35px_rgba(28,109,253,0.55)]'
                    : 'shadow-[0_0_20px_rgba(0,255,65,0.22)] hover:shadow-[0_0_35px_rgba(0,255,65,0.45)]'
                }`}
              />
              <a
                href="#domains"
                className="group relative overflow-hidden px-6 py-3.5 font-mono text-sm font-bold border border-primary/50 text-primary hover:text-bg transition-colors duration-300 flex items-center gap-2"
              >
                <span className="absolute inset-0 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                <span className="relative opacity-70">&gt;</span>
                <span className="relative">explore domains</span>
              </a>
              <Link
                to="/github"
                className="group relative overflow-hidden px-6 py-3.5 font-mono text-sm font-bold border border-borderc text-fg hover:border-primary/50 hover:text-bg transition-colors duration-300 flex items-center gap-2"
              >
                <span className="absolute inset-0 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                <span className="relative"><GithubIcon /></span>
                <span className="relative">git clone opencode</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Ticker ── */}
      <div className="relative z-10 border-t border-borderc bg-card/80 backdrop-blur-sm overflow-hidden h-9 flex items-center" aria-hidden="true">
        <div className="ticker-run flex shrink-0 whitespace-nowrap font-mono text-[11px] tracking-[0.25em] text-muted-fg">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center">
              <span className={i % 3 === 0 ? 'text-fg' : undefined}>{t}</span>
              <span className="mx-6 text-primary">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className="relative z-10 h-7 flex items-center justify-between bg-primary text-bg font-mono text-[11px] font-bold px-3">
        <div className="flex items-center gap-4">
          <span>⎇ main</span>
          <span className="hidden sm:inline">✓ 0 problems</span>
          <span className="hidden md:inline">● OPEN SOURCE</span>
        </div>
        <div className="flex items-center gap-4">
          <span ref={lnColRef} className="tabular-nums">Ln 1, Col 1</span>
          <span className="hidden sm:inline">UTF-8</span>
          <span className="hidden sm:inline">MIT</span>
        </div>
      </div>
    </section>
  )
}

const RISE = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

/** Two stacked copies of the source scrolling upward in a seamless loop */
function CodeLayer({ className }: { className: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className={`code-scroll font-mono text-[13px] leading-6 whitespace-pre pl-16 sm:pl-24 ${className}`}>
        {SOURCE}
        {'\n'}
        {SOURCE}
      </div>
    </div>
  )
}

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}
