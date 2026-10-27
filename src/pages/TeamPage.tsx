import { useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import DecryptText from '../components/DecryptText'
import { Link } from 'react-router-dom'
import CornerBrackets from '../components/fx/CornerBrackets'
import CountUp from '../components/fx/CountUp'

interface TeamPageProps {
  onJoinClick?: () => void
}

type Track = 'Cybersecurity' | 'Open Source'
type Branch = 'all' | 'cybersecurity' | 'open-source'

const FACULTY_ADVISOR = {
  name: 'Dr. S. K. Rath / Dr. B. Majhi',
  designation: 'Faculty Advisor & Mentor',
  dept: 'Department of Computer Science & Engineering',
  institute: 'National Institute of Technology, Rourkela',
  specialty: 'Information Security, Cryptography, Distributed Systems',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&auto=format',
}

const TEAM = [
  {
    handle: 'r00t_k1ng',
    name: 'Kira Osei',
    role: 'Overall Club President & Red Team Lead',
    track: 'Cybersecurity' as Track,
    specialty: 'Binary exploitation, kernel pwn, CTF strategy',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&auto=format',
    github: 'r00t_k1ng',
    cves: 3,
  },
  {
    handle: 'n3tw0rk_b',
    name: 'Ben Nakamura',
    role: 'Vice President & Open Source Track Lead',
    track: 'Open Source' as Track,
    specialty: 'Rust compiler contributor, Linux networking, systems',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&auto=format',
    github: 'n3tw0rk_b',
    cves: 0,
  },
  {
    handle: '0xAl1ce',
    name: 'Alice Marchetti',
    role: 'CTF Captain & Malware Analysis Lead',
    track: 'Cybersecurity' as Track,
    specialty: 'Reverse engineering, threat intel, Ghidra mastery',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&auto=format',
    github: '0xAl1ce',
    cves: 1,
  },
  {
    handle: 'cr4ckm3',
    name: 'Dara Okonkwo',
    role: 'Applied Cryptography & Privacy Lead',
    track: 'Cybersecurity' as Track,
    specialty: 'Custom cipher analysis, ZKP research, CTF top-10',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=120&h=120&fit=crop&auto=format',
    github: 'cr4ckm3',
    cves: 2,
  },
  {
    handle: 'gh0stwr1tr',
    name: 'Santiago Reyes',
    role: 'Web Application Security Lead',
    track: 'Cybersecurity' as Track,
    specialty: 'SSRF, prototype pollution, auth bypass, bounty hunting',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&auto=format',
    github: 'gh0stwr1tr',
    cves: 0,
  },
  {
    handle: 'k3rn3l_d',
    name: 'Yuki Tanaka',
    role: 'Linux Subsystems & Drivers Lead',
    track: 'Open Source' as Track,
    specialty: 'Upstream Linux kernel contributor, eBPF telemetry, C',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
    github: 'k3rn3l_d',
    cves: 1,
  },
]

type Member = (typeof TEAM)[number]
const byHandle = (h: string) => TEAM.find(m => m.handle === h)!

/* ── Commit graph layout ──────────────────────────────────────────────
 * Lane 0 is main, lane 1 is track/cybersecurity, lane 2 is track/open-source.
 * Each row says which lanes pass through above and below its node, which
 * lanes fork out of the node and which merge into it.
 */
const LANE = 26
const LANES = 3
const NODE_Y = 30
const LANE_COLOR = ['var(--fg)', 'var(--primary)', 'var(--accent)']
const LANE_BRANCH: Branch[] = ['all', 'cybersecurity', 'open-source']

type Row =
  | { kind: 'root'; lane: 0; top: number[]; bottom: number[]; fork?: number[]; merge?: number[] }
  | { kind: 'member'; member: Member; lane: number; tags: string[]; top: number[]; bottom: number[]; fork?: number[]; merge?: number[] }
  | { kind: 'you'; lane: 0; top: number[]; bottom: number[]; fork?: number[]; merge?: number[] }

const ROWS: Row[] = [
  { kind: 'root', lane: 0, top: [], bottom: [0] },
  { kind: 'member', member: byHandle('r00t_k1ng'), lane: 0, tags: ['HEAD -> main', 'president'], top: [0], bottom: [0] },
  { kind: 'member', member: byHandle('n3tw0rk_b'), lane: 0, tags: ['main', 'vice-president'], top: [0], bottom: [0, 1, 2], fork: [1, 2] },
  { kind: 'member', member: byHandle('0xAl1ce'), lane: 1, tags: ['track/cybersecurity', 'ctf-captain'], top: [0, 1, 2], bottom: [0, 1, 2] },
  { kind: 'member', member: byHandle('k3rn3l_d'), lane: 2, tags: ['track/open-source'], top: [0, 1, 2], bottom: [0, 1, 2] },
  { kind: 'member', member: byHandle('cr4ckm3'), lane: 1, tags: ['track/cybersecurity'], top: [0, 1, 2], bottom: [0, 1, 2] },
  { kind: 'member', member: byHandle('gh0stwr1tr'), lane: 1, tags: ['track/cybersecurity'], top: [0, 1, 2], bottom: [0, 1, 2] },
  { kind: 'you', lane: 0, top: [0, 1, 2], bottom: [], merge: [1, 2] },
]

/** Stable short "commit hash" from a string */
function shortHash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7)
}

const laneX = (l: number) => l * LANE + LANE / 2

export default function TeamPage({ onJoinClick }: TeamPageProps) {
  const [branch, setBranch] = useState<Branch>('all')
  const totalCves = TEAM.reduce((n, m) => n + m.cves, 0)

  const rowActive = (row: Row) => {
    if (branch === 'all' || row.kind !== 'member') return true
    return (row.member.track === 'Cybersecurity' ? 'cybersecurity' : 'open-source') === branch
  }
  const laneActive = (lane: number) => branch === 'all' || lane === 0 || LANE_BRANCH[lane] === branch

  return (
    <div className="pt-24 pb-28 px-6 min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto">
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

          {/* Branch checkout */}
          <div className="font-mono self-start lg:self-auto">
            <div className="text-[11px] text-muted-fg mb-2">
              <span className="text-primary">$</span> git checkout
            </div>
            <div className="flex flex-wrap border border-borderc p-1 bg-card">
              {(
                [
                  { id: 'all', label: '--all', pill: 'bg-fg' },
                  { id: 'cybersecurity', label: 'cybersecurity', pill: 'bg-primary' },
                  { id: 'open-source', label: 'open-source', pill: 'bg-accent' },
                ] as const
              ).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setBranch(tab.id)}
                  className={`relative px-3 sm:px-4 py-1.5 text-xs transition-colors cursor-pointer ${
                    branch === tab.id ? 'text-bg font-bold' : 'text-muted-fg hover:text-fg'
                  }`}
                >
                  {branch === tab.id && (
                    <motion.span
                      layoutId="team-branch-pill"
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

        {/* ── shortlog summary ── */}
        <div className="font-mono text-xs text-muted-fg mb-12 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span>
            <span className="text-primary">$</span> git log --graph --all --format=team
          </span>
          <span className="flex items-center gap-x-5">
            <span><CountUp value={TEAM.length + 1} className="text-fg font-bold" /> contributors</span>
            <span><CountUp value={3} className="text-fg font-bold" /> branches</span>
            <span><CountUp value={totalCves} className="text-warning font-bold" /> CVEs</span>
          </span>
        </div>

        {/* ── The graph ── */}
        <div className="relative">
          {ROWS.map((row, i) => (
            <GraphRow key={i} row={row} active={rowActive(row)} laneActive={laneActive} index={i}>
              {row.kind === 'root' && <RootCommit />}
              {row.kind === 'member' && <MemberCommit member={row.member} tags={row.tags} lane={row.lane} />}
              {row.kind === 'you' && <YouCommit onJoinClick={onJoinClick} />}
            </GraphRow>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * One line of `git log --graph`: the lane drawing on the left (lines draw in,
 * the node pops) and the commit card on the right (wipes out of the node).
 */
function GraphRow({
  row,
  active,
  laneActive,
  index,
  children,
}: {
  row: Row
  active: boolean
  laneActive: (lane: number) => boolean
  index: number
  children: ReactNode
}) {
  const reduced = useReducedMotion()
  const width = LANES * LANE
  const draw = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.45, delay, ease: 'easeInOut' as const },
        }
  const stroke = (lane: number) => ({
    stroke: LANE_COLOR[lane],
    strokeOpacity: laneActive(lane) ? (lane === 0 ? 0.45 : 0.85) : 0.12,
    strokeWidth: 2,
    fill: 'none',
    vectorEffect: 'non-scaling-stroke' as const,
    style: { transition: 'stroke-opacity 0.3s' },
  })
  const x0 = laneX(row.lane)

  return (
    <div className="flex">
      {/* Graph column */}
      <div className="relative shrink-0 flex flex-col" style={{ width }} aria-hidden="true">
        {/* Above the node: straight lanes, or merges curving into it */}
        <svg width={width} height={NODE_Y} viewBox={`0 0 ${width} ${NODE_Y}`} className="block shrink-0 overflow-visible">
          {row.top.map(l => {
            const merging = row.merge?.includes(l)
            const d = merging
              ? `M ${laneX(l)} 0 C ${laneX(l)} ${NODE_Y * 0.7}, ${x0} ${NODE_Y * 0.3}, ${x0} ${NODE_Y}`
              : `M ${laneX(l)} 0 L ${laneX(l)} ${NODE_Y}`
            return <motion.path key={l} d={d} {...stroke(l)} {...draw(0)} />
          })}
        </svg>

        {/* Below the node: forks curve out first, then every lane runs to the next row */}
        {row.bottom.length > 0 && (
          <>
            <svg width={width} height={NODE_Y} viewBox={`0 0 ${width} ${NODE_Y}`} className="block shrink-0 overflow-visible">
              {row.bottom.map(l => {
                const forking = row.fork?.includes(l)
                const d = forking
                  ? `M ${x0} 0 C ${x0} ${NODE_Y * 0.7}, ${laneX(l)} ${NODE_Y * 0.3}, ${laneX(l)} ${NODE_Y}`
                  : `M ${laneX(l)} 0 L ${laneX(l)} ${NODE_Y}`
                return <motion.path key={l} d={d} {...stroke(l)} {...draw(0.35)} />
              })}
            </svg>
            <div className="relative flex-1">
              <svg viewBox={`0 0 ${width} 100`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                {row.bottom.map(l => (
                  // Width matches the viewBox, so only y stretches: vertical strokes keep their weight
                  // and pathLength stays true to the rendered length
                  <motion.path
                    key={l}
                    d={`M ${laneX(l)} 0 L ${laneX(l)} 100`}
                    {...stroke(l)}
                    vectorEffect="none"
                    {...draw(0.55)}
                  />
                ))}
              </svg>
            </div>
          </>
        )}

        {/* Commit node */}
        <motion.span
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: x0, top: NODE_Y }}
          initial={reduced ? false : { scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.25 }}
        >
          <Node row={row} active={active} />
        </motion.span>
      </div>

      {/* Commit card */}
      <motion.div
        className="flex-1 min-w-0 pb-8 pl-2 sm:pl-4"
        initial={reduced ? false : { opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: index === 0 ? 0.3 : 0.35 }}
      >
        {/* Checking out another branch dims this commit rather than removing it */}
        <div
          className="transition-[opacity,filter] duration-300"
          style={{ opacity: active ? 1 : 0.28, filter: active ? 'none' : 'grayscale(1)' }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  )
}

function Node({ row, active }: { row: Row; active: boolean }) {
  const color = LANE_COLOR[row.lane]
  if (row.kind === 'root') {
    return <span className="block w-4 h-4 border-2 bg-bg" style={{ borderColor: 'var(--accent)' }} />
  }
  if (row.kind === 'you') {
    return (
      <span className="relative block w-4 h-4 border-2 border-dashed border-primary bg-bg">
        <span className="absolute -inset-2 border border-primary/50 animate-ping" />
      </span>
    )
  }
  return (
    <span className="relative block">
      <span
        className="block w-3 h-3 rotate-45 border-2 border-bg"
        style={{ background: color, boxShadow: active ? `0 0 12px ${color}` : 'none' }}
      />
    </span>
  )
}

function CommitHeader({ hash, children }: { hash: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] min-h-[28px] mt-4">
      <span className="text-warning">commit {hash}</span>
      {children}
    </div>
  )
}

function Tag({ children, tone }: { children: ReactNode; tone: 'head' | 'main' | 'sec' | 'oss' | 'plain' }) {
  const cls = {
    head: 'border-accent/50 text-accent bg-accent/10 font-bold',
    main: 'border-fg/30 text-fg/80 bg-fg/5',
    sec: 'border-primary/40 text-primary bg-primary/10',
    oss: 'border-accent/40 text-accent bg-accent/10',
    plain: 'border-borderc text-muted-fg',
  }[tone]
  return <span className={`px-1.5 py-px border text-[10px] ${cls}`}>{children}</span>
}

function Avatar({ src, name, size, accent }: { src: string; name: string; size: string; accent?: boolean }) {
  const initials = name
    .split(/[\s/.]+/)
    .filter(w => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map(w => w[0])
    .join('')
  return (
    <div
      className={`relative ${size} shrink-0 overflow-hidden border ${
        accent ? 'border-accent' : 'border-borderc group-hover:border-primary'
      } bg-muted transition-colors`}
    >
      <span className="absolute inset-0 flex items-center justify-center font-mono text-sm text-muted-fg">{initials}</span>
      <img
        src={src}
        alt={name}
        loading="lazy"
        onError={e => (e.currentTarget.style.display = 'none')}
        className="relative w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-[filter,transform] duration-500"
      />
      <span className="id-scan-line" />
    </div>
  )
}

function RootCommit() {
  const f = FACULTY_ADVISOR
  return (
    <div>
      <CommitHeader hash={shortHash(f.name)}>
        <Tag tone="plain">root</Tag>
        <Tag tone="head">origin</Tag>
        <span className="text-muted-fg">Author: {f.name}</span>
      </CommitHeader>
      <div className="group relative mt-3 border border-accent/40 bg-card p-5 md:p-6 flex flex-col sm:flex-row gap-5">
        <CornerBrackets accent locked />
        <Avatar src={f.avatar} name={f.name} size="w-20 h-20" accent />
        <div className="min-w-0">
          <p className="font-mono text-[11px] text-accent uppercase tracking-widest">init: faculty mentorship</p>
          <h3 className="font-mono text-xl md:text-2xl font-bold text-fg mt-1">{f.name}</h3>
          <p className="font-mono text-xs text-primary font-semibold mt-1">
            {f.designation} · {f.dept}
          </p>
          <p className="text-xs text-muted-fg mt-2 leading-relaxed max-w-3xl">
            {f.institute} — guiding research in {f.specialty}.
          </p>
        </div>
      </div>
    </div>
  )
}

function MemberCommit({ member, tags, lane }: { member: Member; tags: string[]; lane: number }) {
  const scope = member.track === 'Cybersecurity' ? 'sec' : 'oss'
  return (
    <div>
      <CommitHeader hash={shortHash(member.handle)}>
        {tags.map(t => (
          <Tag
            key={t}
            tone={t.startsWith('HEAD') ? 'head' : t === 'main' ? 'main' : t.startsWith('track/') ? (lane === 1 ? 'sec' : 'oss') : 'plain'}
          >
            {t}
          </Tag>
        ))}
        <span className="text-muted-fg">
          Author: <span className="text-fg/80">{member.name}</span> &lt;@{member.handle}&gt;
        </span>
      </CommitHeader>

      <div className="group relative mt-3 border border-borderc bg-card hover:border-primary/50 transition-colors p-4 md:p-5 flex gap-4">
        <CornerBrackets accent={scope === 'oss'} />
        <Avatar src={member.avatar} name={member.name} size="w-14 h-14 md:w-16 md:h-16" />
        <div className="min-w-0 flex-1 font-mono">
          <h3 className="text-sm md:text-base font-bold text-fg group-hover:text-primary transition-colors">
            <span className={scope === 'sec' ? 'text-primary' : 'text-accent'}>feat({scope}):</span> {member.role}
          </h3>
          <p className="text-xs text-muted-fg mt-1.5 leading-relaxed">{member.specialty}</p>
          <div className="mt-3 pt-3 border-t border-borderc/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="text-muted-fg">
              {member.cves > 0 ? (
                <>
                  <span className="text-warning font-bold">+{member.cves}</span> CVE{member.cves > 1 ? 's' : ''} assigned
                </>
              ) : (
                <>
                  <span className="text-accent font-bold">+1</span> core maintainer
                </>
              )}
              <span className="mx-2 text-borderc">|</span>
              {member.track.toLowerCase()}
            </span>
            <a
              href={`https://github.com/${member.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-fg hover:text-primary transition-colors"
            >
              github ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function YouCommit({ onJoinClick }: { onJoinClick?: () => void }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] min-h-[28px] mt-4">
        <span className="text-primary">Merge branches 'track/cybersecurity' and 'track/open-source'</span>
        <Tag tone="plain">uncommitted</Tag>
      </div>
      <div className="group relative mt-3 border border-dashed border-primary/50 bg-primary/[0.03] p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CornerBrackets />
        <div className="font-mono">
          <p className="text-[11px] text-muted-fg">
            Author: <span className="text-primary">you</span> &lt;@your-handle&gt;
          </p>
          <h3 className="text-lg md:text-xl font-bold text-fg mt-1">
            <span className="text-primary">feat(you):</span> your name belongs on this graph.
          </h3>
          <p className="text-xs text-muted-fg mt-1">Both tracks merge here. Pick one and make the next commit.</p>
        </div>
        <button
          onClick={onJoinClick}
          className="group/btn relative overflow-hidden shrink-0 px-5 py-3 font-mono text-xs font-bold border border-primary text-primary hover:text-bg transition-colors cursor-pointer"
        >
          <span className="absolute inset-0 bg-primary origin-left scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300" />
          <span className="relative">$ git commit -m "join"</span>
        </button>
      </div>
    </div>
  )
}
