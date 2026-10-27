import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import DecryptText from '../components/DecryptText'
import { Link } from 'react-router-dom'
import CountUp from '../components/fx/CountUp'

interface TeamPageProps {
  onJoinClick?: () => void
}

type Track = 'Faculty' | 'Cybersecurity' | 'Open Source'
type Filter = 'all' | 'sec' | 'oss'

interface Person {
  pid: number
  handle: string
  name: string
  role: string
  track: Track
  specialty: string
  avatar: string
  github?: string
  cves: number
  clearance: number
  detail?: string
}

const PEOPLE: Person[] = [
  {
    pid: 1,
    handle: 'root',
    name: 'Dr. S. K. Rath / Dr. B. Majhi',
    role: 'Faculty Advisor & Mentor',
    track: 'Faculty',
    specialty: 'Information Security, Cryptography, Distributed Systems',
    detail: 'Department of Computer Science & Engineering, National Institute of Technology, Rourkela',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&h=320&fit=crop&auto=format',
    cves: 0,
    clearance: 5,
  },
  {
    pid: 101,
    handle: 'r00t_k1ng',
    name: 'Kira Osei',
    role: 'Overall Club President & Red Team Lead',
    track: 'Cybersecurity',
    specialty: 'Binary exploitation, kernel pwn, CTF strategy',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=320&h=320&fit=crop&auto=format',
    github: 'r00t_k1ng',
    cves: 3,
    clearance: 4,
  },
  {
    pid: 102,
    handle: 'n3tw0rk_b',
    name: 'Ben Nakamura',
    role: 'Vice President & Open Source Track Lead',
    track: 'Open Source',
    specialty: 'Rust compiler contributor, Linux networking, systems',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=320&h=320&fit=crop&auto=format',
    github: 'n3tw0rk_b',
    cves: 0,
    clearance: 4,
  },
  {
    pid: 203,
    handle: '0xAl1ce',
    name: 'Alice Marchetti',
    role: 'CTF Captain & Malware Analysis Lead',
    track: 'Cybersecurity',
    specialty: 'Reverse engineering, threat intel, Ghidra mastery',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=320&h=320&fit=crop&auto=format',
    github: '0xAl1ce',
    cves: 1,
    clearance: 3,
  },
  {
    pid: 204,
    handle: 'cr4ckm3',
    name: 'Dara Okonkwo',
    role: 'Applied Cryptography & Privacy Lead',
    track: 'Cybersecurity',
    specialty: 'Custom cipher analysis, ZKP research, CTF top-10',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=320&h=320&fit=crop&auto=format',
    github: 'cr4ckm3',
    cves: 2,
    clearance: 3,
  },
  {
    pid: 205,
    handle: 'gh0stwr1tr',
    name: 'Santiago Reyes',
    role: 'Web Application Security Lead',
    track: 'Cybersecurity',
    specialty: 'SSRF, prototype pollution, auth bypass, bounty hunting',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=320&h=320&fit=crop&auto=format',
    github: 'gh0stwr1tr',
    cves: 0,
    clearance: 3,
  },
  {
    pid: 306,
    handle: 'k3rn3l_d',
    name: 'Yuki Tanaka',
    role: 'Linux Subsystems & Drivers Lead',
    track: 'Open Source',
    specialty: 'Upstream Linux kernel contributor, eBPF telemetry, C',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&h=320&fit=crop&auto=format',
    github: 'k3rn3l_d',
    cves: 1,
    clearance: 3,
  },
]

const CYCLE_MS = 5500

const trackTone = (t: Track) =>
  t === 'Cybersecurity'
    ? { text: 'text-primary', bg: 'bg-primary', border: 'border-primary/60', color: 'var(--primary)', short: 'sec' }
    : t === 'Open Source'
      ? { text: 'text-accent', bg: 'bg-accent', border: 'border-accent/60', color: 'var(--accent)', short: 'oss' }
      : { text: 'text-warning', bg: 'bg-warning', border: 'border-warning/60', color: 'var(--warning)', short: 'root' }

type Tone = ReturnType<typeof trackTone>

/** Stable hex string derived from text, used for the barcode and key fingerprint */
function hashHex(s: string, len = 32) {
  let out = ''
  let h = 2166136261
  for (let i = 0; out.length < len; i++) {
    h = Math.imul(h ^ s.charCodeAt(i % s.length) ^ i, 16777619)
    out += (h >>> 0).toString(16).padStart(8, '0')
  }
  return out.slice(0, len)
}

const matches = (p: Person, f: Filter) =>
  f === 'all' || p.track === 'Faculty' || (f === 'sec' ? p.track === 'Cybersecurity' : p.track === 'Open Source')

/** Resolve `var(--x)` to its current value so canvas can paint with it */
const cssColor = (c: string) =>
  c.startsWith('var(') ? getComputedStyle(document.documentElement).getPropertyValue(c.slice(4, -1)).trim() : c

export default function TeamPage({ onJoinClick }: TeamPageProps) {
  const reduced = useReducedMotion()
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState(0)
  const [autoplay, setAutoplay] = useState(!reduced)
  const [direction, setDirection] = useState(1)

  const visible = PEOPLE.map((p, i) => ({ p, i })).filter(({ p }) => matches(p, filter))
  const totalCves = PEOPLE.reduce((n, p) => n + p.cves, 0)

  const select = useCallback((i: number, byUser = true) => {
    setSelected(prev => {
      setDirection(i >= prev ? 1 : -1)
      return i
    })
    if (byUser) setAutoplay(false)
  }, [])

  const step = useCallback(
    (delta: number, byUser = true) => {
      const pos = visible.findIndex(v => v.i === selected)
      const next = visible[(pos + delta + visible.length) % visible.length]
      if (next) select(next.i, byUser)
    },
    [visible, selected, select],
  )

  // Keep the selection inside the filtered roster
  useEffect(() => {
    if (!matches(PEOPLE[selected], filter)) select(visible[0].i, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  // Auto-cycle until the visitor takes over
  useEffect(() => {
    if (!autoplay) return
    const id = setTimeout(() => step(1, false), CYCLE_MS)
    return () => clearTimeout(id)
  }, [autoplay, selected, step])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'j') {
      e.preventDefault()
      step(1)
    } else if (e.key === 'ArrowUp' || e.key === 'k') {
      e.preventDefault()
      step(-1)
    }
  }

  return (
    <div className="pt-24 pb-28 px-6 min-h-screen bg-bg relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto">
        <div className="mb-4">
          <Link to="/" className="font-mono text-xs text-muted-fg hover:text-primary transition-colors">
            &larr; Return to Home
          </Link>
        </div>

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 border-b border-borderc pb-10">
          <div>
            <p className="font-mono text-xs text-accent uppercase tracking-[0.2em] mb-3">// COMMAND HIERARCHY</p>
            <DecryptText
              text="Core Team & Advisors."
              tag="h1"
              className="font-mono text-4xl md:text-5xl lg:text-6xl font-black text-fg tracking-tight"
              delay={80}
            />
            <p className="font-mono text-muted-fg text-sm mt-3 max-w-2xl leading-relaxed">
              Student maintainers, kernel patchers, CTF captains, and faculty mentors guiding the next generation of
              engineers at NIT Rourkela.
            </p>
          </div>

          <div className="font-mono self-start lg:self-auto">
            <div className="text-[11px] text-muted-fg mb-2">
              <span className="text-primary">$</span> ps aux --track
            </div>
            <div className="flex border border-borderc p-1 bg-card">
              {(
                [
                  { id: 'all', label: 'all', pill: 'bg-fg' },
                  { id: 'sec', label: 'cybersecurity', pill: 'bg-primary' },
                  { id: 'oss', label: 'open-source', pill: 'bg-accent' },
                ] as const
              ).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`relative px-3 sm:px-4 py-1.5 text-xs transition-colors cursor-pointer ${
                    filter === tab.id ? 'text-bg font-bold' : 'text-muted-fg hover:text-fg'
                  }`}
                >
                  {filter === tab.id && (
                    <motion.span
                      layoutId="team-track-pill"
                      className={`absolute inset-0 ${tab.pill}`}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Operator console ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-12 border border-borderc bg-card/60"
        >
          {/* Keycard stage (first on mobile) */}
          <div className="lg:col-span-5 lg:order-2 relative border-b lg:border-b-0 lg:border-l border-borderc flex flex-col items-center justify-center px-6 pt-12 pb-8 min-h-[580px] overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 45%, rgba(var(--primary-rgb),0.08), transparent 60%)' }}
              aria-hidden="true"
            />
            <div className="absolute top-3 left-4 right-4 flex justify-between font-mono text-[10px] text-muted-fg tracking-widest">
              <span>CARD READER // SLOT A</span>
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 ${autoplay ? 'bg-primary cursor-blink' : 'bg-muted-fg'}`} />
                {autoplay ? 'AUTO-SCAN' : 'MANUAL'}
              </span>
            </div>

            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <Keycard
                key={PEOPLE[selected].handle}
                person={PEOPLE[selected]}
                direction={direction}
                onFlip={() => setAutoplay(false)}
              />
            </AnimatePresence>

            <p className="relative mt-6 font-mono text-[10px] text-muted-fg tracking-widest">
              TILT TO INSPECT · CLICK TO FLIP
            </p>
          </div>

          {/* Process table */}
          <div
            className="lg:col-span-7 lg:order-1 font-mono focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
            tabIndex={0}
            onKeyDown={onKeyDown}
            aria-label="Team roster. Use the arrow keys to move between members."
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-borderc text-[11px] text-muted-fg">
              <span>
                <span className="text-primary">$</span> ps aux | grep opencode
              </span>
              <span className="hidden sm:flex items-center gap-4">
                <span>
                  <CountUp value={PEOPLE.length} className="text-fg font-bold" /> procs
                </span>
                <span>
                  <CountUp value={totalCves} className="text-warning font-bold" /> CVEs
                </span>
              </span>
            </div>

            <div className={`${ROW_GRID} px-4 py-2 border-b border-borderc text-[10px] text-muted-fg tracking-widest`}>
              <span>PID</span>
              <span className="hidden sm:block">USER</span>
              <span>COMMAND</span>
              <span className="text-right">STAT</span>
            </div>

            <ul>
              <AnimatePresence initial={false}>
                {visible.map(({ p, i }, row) => (
                  <motion.li
                    key={p.handle}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3, delay: row * 0.03 } }}
                    exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                    className="overflow-hidden"
                  >
                    <RosterRow person={p} active={i === selected} autoplay={autoplay} onSelect={() => select(i)} />
                  </motion.li>
                ))}
              </AnimatePresence>

              {/* Pending process: the visitor */}
              <li>
                <button
                  onClick={onJoinClick}
                  className={`group relative w-full ${ROW_GRID} items-center px-4 py-4 text-left text-xs border-t border-dashed border-primary/40 cursor-pointer`}
                >
                  <span className="absolute inset-0 bg-primary/[0.06] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  <span className="relative text-muted-fg">????</span>
                  <span className="relative hidden sm:block text-primary">you</span>
                  <span className="relative text-fg truncate">
                    ./join --track=<span className="text-primary">yours</span>
                    <span className="cursor-blink text-primary">_</span>
                  </span>
                  <span className="relative text-right text-warning">PENDING</span>
                </button>
              </li>
            </ul>

            <div className="px-4 py-3 border-t border-borderc text-[10px] text-muted-fg tracking-widest flex justify-between">
              <span>↑/↓ or j/k to switch</span>
              {!autoplay && (
                <button onClick={() => setAutoplay(true)} className="hover:text-primary cursor-pointer">
                  ▶ resume auto-scan
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const ROW_GRID = 'grid grid-cols-[3.5rem_1fr_3.5rem] sm:grid-cols-[3.5rem_8.5rem_1fr_3.5rem] gap-x-3'

function RosterRow({
  person,
  active,
  autoplay,
  onSelect,
}: {
  person: Person
  active: boolean
  autoplay: boolean
  onSelect: () => void
}) {
  const tone = trackTone(person.track)
  return (
    <button
      onClick={onSelect}
      className={`group relative w-full ${ROW_GRID} items-center px-4 py-3.5 text-left text-xs border-b border-borderc/60 cursor-pointer transition-colors ${
        active ? 'bg-fg/[0.04]' : 'hover:bg-fg/[0.02]'
      }`}
    >
      {/* Selection bar */}
      <motion.span
        className={`absolute left-0 top-0 bottom-0 w-[3px] origin-top ${tone.bg}`}
        initial={false}
        animate={{ scaleY: active ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      />
      {/* Auto-scan countdown */}
      {active && autoplay && (
        <motion.span
          key={person.handle}
          className={`absolute left-0 bottom-0 h-px w-full origin-left ${tone.bg}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: CYCLE_MS / 1000, ease: 'linear' }}
        />
      )}
      <span className={`tabular-nums ${active ? tone.text : 'text-muted-fg'}`}>{person.pid}</span>
      <span className={`hidden sm:block truncate ${active ? 'text-fg' : 'text-muted-fg'}`}>@{person.handle}</span>
      <span className="min-w-0">
        <span className={`block truncate ${active ? 'text-fg font-bold' : 'text-fg/80'}`}>{person.name}</span>
        <span className="block truncate text-[11px] text-muted-fg mt-0.5">{person.role}</span>
      </span>
      <span className="text-right">
        <span className={`inline-block px-1.5 py-px border text-[10px] ${tone.border} ${active ? tone.text : 'text-muted-fg'}`}>
          {active ? 'R+' : 'S'}
        </span>
      </span>
    </button>
  )
}

/**
 * Holographic access keycard. Tilts toward the pointer with a glare that
 * tracks it, swings in from the side when the selection changes, and flips
 * over on click to show the dossier on the back.
 */
function Keycard({ person, direction, onFlip }: { person: Person; direction: number; onFlip: () => void }) {
  const reduced = useReducedMotion()
  const [flipped, setFlipped] = useState(false)
  const tone = trackTone(person.track)

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rx = useSpring(useTransform(py, [0, 1], [10, -10]), { stiffness: 200, damping: 20 })
  const ry = useSpring(useTransform(px, [0, 1], [-12, 12]), { stiffness: 200, damping: 20 })
  const gx = useTransform(px, v => `${v * 100}%`)
  const gy = useTransform(py, v => `${v * 100}%`)
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.22), transparent 45%)`

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      className="relative w-[280px] sm:w-[300px] h-[450px] cursor-pointer select-none"
      style={{ perspective: 1200 }}
      custom={direction}
      variants={{
        enter: (d: number) => ({ opacity: 0, rotateY: d * -70, x: d * 60 }),
        center: { opacity: 1, rotateY: 0, x: 0 },
        exit: (d: number) => ({ opacity: 0, rotateY: d * 70, x: d * -60 }),
      }}
      initial={reduced ? false : 'enter'}
      animate="center"
      exit={reduced ? undefined : 'exit'}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={() => {
        setFlipped(f => !f)
        onFlip()
      }}
      role="button"
      aria-pressed={flipped}
      aria-label={`${person.name} keycard. Click to flip.`}
    >
      <motion.div className="relative w-full h-full" style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}>
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
        >
          <CardFront person={person} tone={tone} />
          <CardBack person={person} tone={tone} />
        </motion.div>
        {/* Holographic glare */}
        <motion.div className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ background: glare }} />
      </motion.div>
    </motion.div>
  )
}

const FACE = 'absolute inset-0 border bg-card overflow-hidden [backface-visibility:hidden]'

function CardFront({ person, tone }: { person: Person; tone: Tone }) {
  const barcode = hashHex(person.handle, 40)
  return (
    <div className={`${FACE} ${tone.border} flex flex-col`} style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
      {/* Track stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${tone.bg}`} />
      <div className="absolute inset-0 scanlines pointer-events-none" />

      <div className="pl-5 pr-4 pt-4 flex items-start justify-between font-mono">
        <div>
          <div className="text-[10px] tracking-[0.3em] text-muted-fg">OPENCODE // NITR</div>
          <div className={`text-[10px] tracking-[0.2em] mt-0.5 ${tone.text}`}>ACCESS · {tone.short.toUpperCase()}</div>
        </div>
        {/* Contact chip */}
        <div className="w-9 h-7 border border-warning/60 bg-warning/10 grid grid-cols-3 grid-rows-2 gap-px p-0.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="bg-warning/30" />
          ))}
        </div>
      </div>

      <div className="pl-5 pr-4 mt-4">
        <PixelPortrait src={person.avatar} name={person.name} color={tone.color} />
      </div>

      <div className="pl-5 pr-4 mt-4 font-mono flex-1">
        <ScrambleName text={person.name} className="block text-lg font-black text-fg leading-tight" />
        <div className={`text-xs mt-1 ${tone.text}`}>@{person.handle}</div>
        <div className="text-[11px] text-fg/75 mt-2 leading-snug line-clamp-2">{person.role}</div>
        <div className="text-[10px] text-muted-fg mt-2 leading-snug line-clamp-2">
          <span className={tone.text}>&gt;</span> {person.specialty}
        </div>
      </div>

      <div className="pl-5 pr-4 pb-4 font-mono">
        <div className="flex items-end justify-between">
          <Clearance level={person.clearance} tone={tone} />
          <span className="text-[10px] text-muted-fg">PID {person.pid}</span>
        </div>
        {/* Barcode derived from the handle */}
        <div className="mt-3 flex items-end gap-px h-7">
          {barcode.split('').map((c, i) => (
            <span
              key={i}
              className="bg-fg/70"
              style={{ width: (parseInt(c, 16) % 3) + 1, height: `${60 + (parseInt(c, 16) % 5) * 10}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function CardBack({ person, tone }: { person: Person; tone: Tone }) {
  const fp = hashHex(person.name + person.handle, 40).toUpperCase().match(/.{4}/g)!
  return (
    <div className={`${FACE} ${tone.border} [transform:rotateY(180deg)] flex flex-col font-mono`}>
      <div className={`absolute right-0 top-0 bottom-0 w-1.5 ${tone.bg}`} />
      <div className="px-5 pt-4 pb-3 border-b border-borderc text-[10px] tracking-[0.3em] text-muted-fg">
        DOSSIER // CLASSIFIED
      </div>

      <div className="px-5 py-4 flex-1 space-y-3.5 text-xs">
        <Field label="ROLE">{person.role}</Field>
        <Field label="SPECIALTY">{person.specialty}</Field>
        {person.detail && <Field label="UNIT">{person.detail}</Field>}
        <div className="grid grid-cols-2 gap-3">
          <Field label="TRACK">
            <span className={tone.text}>{person.track}</span>
          </Field>
          <Field label="CVEs">
            <span className={person.cves ? 'text-warning font-bold' : 'text-muted-fg'}>{person.cves}</span>
          </Field>
        </div>
        <div>
          <div className="text-[10px] text-muted-fg tracking-widest mb-0.5">KEY FINGERPRINT</div>
          <div className="text-[10px] text-fg/70 leading-relaxed">{fp.join(' ')}</div>
        </div>
      </div>

      {person.github && (
        <a
          href={`https://github.com/${person.github}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className={`mx-5 mb-5 py-2 text-center text-xs border ${tone.border} ${tone.text} hover:bg-fg/5 transition-colors`}
        >
          github.com/{person.github} ↗
        </a>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] text-muted-fg tracking-widest mb-0.5">{label}</div>
      <div className="text-fg/90 leading-snug">{children}</div>
    </div>
  )
}

/** Five clearance segments that charge one after another */
function Clearance({ level, tone }: { level: number; tone: Tone }) {
  return (
    <div>
      <div className="text-[10px] text-muted-fg tracking-widest mb-1">CLEARANCE L{level}</div>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            className={`w-5 h-1.5 origin-left ${i < level ? tone.bg : 'bg-borderc'}`}
            initial={{ opacity: 0.2, scaleX: 0.3 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.35 + i * 0.08, duration: 0.2 }}
          />
        ))}
      </div>
    </div>
  )
}

const GLYPHS = '!<>-_\\/[]{}=+*^?#ABCDEF0123456789'

function ScrambleName({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(reduced ? text : text.replace(/\S/g, '_'))
  useEffect(() => {
    if (reduced) return
    let frame = 0
    const id = setInterval(() => {
      frame++
      setShown(
        text
          .split('')
          .map((ch, i) => (ch === ' ' || frame > 4 + i * 1.5 ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join(''),
      )
      if (frame > 4 + text.length * 1.5) clearInterval(id)
    }, 30)
    return () => clearInterval(id)
  }, [text, reduced])
  return <span className={className}>{shown}</span>
}

/**
 * Photo that resolves from coarse blocks to full detail, like an image
 * decoding over a slow link. Shows initials if it cannot load.
 */
function PixelPortrait({ src, name, color }: { src: string; name: string; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const size = canvas.width
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    const drawInitials = () => {
      ctx.fillStyle = cssColor('var(--muted)') || '#132020'
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = cssColor(color)
      ctx.font = `800 ${size * 0.34}px 'JetBrains Mono', monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const initials = name
        .split(/[\s/.]+/)
        .filter(w => /^[A-Z]/.test(w))
        .slice(0, 2)
        .map(w => w[0])
        .join('')
      ctx.fillText(initials, size / 2, size / 2)
    }

    const img = new Image()
    img.onload = () => {
      if (cancelled) return
      const off = document.createElement('canvas')
      const o = off.getContext('2d')!
      const steps = reduced ? [size] : [6, 10, 18, 32, 64, size]
      steps.forEach((res, k) => {
        timers.push(
          setTimeout(() => {
            if (cancelled) return
            off.width = off.height = res
            o.drawImage(img, 0, 0, res, res)
            ctx.imageSmoothingEnabled = res === size
            ctx.clearRect(0, 0, size, size)
            ctx.drawImage(off, 0, 0, size, size)
          }, k * 90),
        )
      })
    }
    img.onerror = () => !cancelled && drawInitials()
    drawInitials()
    img.src = src

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [src, name, color, reduced])

  return (
    <div className="relative w-28 h-28 border border-borderc overflow-hidden">
      <canvas ref={ref} width={224} height={224} role="img" aria-label={name} className="w-full h-full block" />
      <motion.span
        className="absolute left-0 right-0 h-0.5 pointer-events-none"
        style={{ background: color, boxShadow: `0 0 10px ${color}` }}
        initial={{ top: '0%', opacity: 1 }}
        animate={{ top: '100%', opacity: 0 }}
        transition={{ duration: 0.7, ease: 'easeIn' }}
      />
    </div>
  )
}
