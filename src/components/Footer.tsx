import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import AsciiWordmark from './fx/AsciiWordmark'
import Reveal from './fx/Reveal'

interface Props {
  onOpenSecurityModal: () => void
  onOpenTerminal: () => void
  onOpenSearch: () => void
  onJoinClick: () => void
}

const ORG_URL = 'https://github.com/OpencodeNIT-R'

const ROUTES: Record<string, string> = {
  '~': '/',
  '/': '/',
  home: '/',
  about: '/#about',
  domains: '/domains',
  events: '/events',
  team: '/team',
  github: '/github',
}

const COMMANDS = ['help', 'ls', 'cd', 'join', 'whoami', 'github', 'security', 'palette', 'terminal', 'date', 'echo', 'clear', 'sudo', 'flag', 'exit']

type Line = { kind: 'in' | 'out'; text: ReactNode; tone?: 'ok' | 'err' | 'dim' | 'accent' }

const LISTING: { section: string; rows: { perm: string; size: string; name: string; to: string; kind: 'route' | 'hash' | 'ext' | 'action'; action?: keyof Props }[] }[] = [
  {
    section: './sitemap',
    rows: [
      { perm: 'drwxr-xr-x', size: '4.0K', name: 'about/', to: '/#about', kind: 'hash' },
      { perm: 'drwxr-xr-x', size: '4.0K', name: 'domains/', to: '/domains', kind: 'route' },
      { perm: 'drwxr-xr-x', size: '4.0K', name: 'events/', to: '/events', kind: 'route' },
      { perm: 'drwxr-xr-x', size: '4.0K', name: 'team/', to: '/team', kind: 'route' },
    ],
  },
  {
    section: './comms',
    rows: [
      { perm: 'lrwxrwxrwx', size: '  42', name: 'github -> OpencodeNIT-R', to: ORG_URL, kind: 'ext' },
      { perm: 'lrwxrwxrwx', size: '  19', name: 'ctftime -> ctftime.org', to: 'https://ctftime.org', kind: 'ext' },
      { perm: 'lrwxrwxrwx', size: '  18', name: 'nitr -> nitrkl.ac.in', to: 'https://nitrkl.ac.in', kind: 'ext' },
      { perm: 'drwxr-xr-x', size: '4.0K', name: 'showcase/', to: '/github', kind: 'route' },
    ],
  },
  {
    section: './sys',
    rows: [
      { perm: '-rw-r--r--', size: '1.2K', name: 'security.txt', to: '', kind: 'action', action: 'onOpenSecurityModal' },
      { perm: '-rwxr-xr-x', size: '8.4K', name: 'palette --ctrl+k', to: '', kind: 'action', action: 'onOpenSearch' },
      { perm: '-rwxr-xr-x', size: '16K', name: 'terminal', to: '', kind: 'action', action: 'onOpenTerminal' },
      { perm: '-rwx------', size: '2.1K', name: 'apply.sh', to: '', kind: 'action', action: 'onJoinClick' },
    ],
  },
]

export default function Footer(props: Props) {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-borderc bg-card/40 font-mono overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-6 pt-20 md:pt-28">
        {/* ── Call + live shell ── */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-20 md:mb-24">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[11px] text-muted-fg uppercase tracking-[0.25em] mb-5">
              <span className="text-primary">//</span> end of file. not the end of the story.
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-fg leading-[1.05] tracking-tight">
              Your first commit
              <br />
              <span className="text-primary">starts here.</span>
            </h2>
            <p className="text-xs text-muted-fg leading-relaxed mt-6 max-w-sm">
              Official Open Source and Cybersecurity Club of National Institute of Technology, Rourkela. Building
              high-impact systems software and training elite CTF competitors.
            </p>
            <p className="text-[11px] text-muted-fg mt-6">
              <span className="text-accent">tip:</span> the shell is real. try{' '}
              <code className="text-primary">help</code>, <code className="text-primary">cd events</code> or{' '}
              <code className="text-primary">sudo</code>.
            </p>
          </motion.div>

          <Reveal className="lg:col-span-7" from="top" duration={0.7}>
            <Shell {...props} />
          </Reveal>
        </div>

        {/* ── Directory listing ── */}
        <div className="grid md:grid-cols-3 border border-borderc bg-bg/60 divide-y md:divide-y-0 md:divide-x divide-borderc mb-16">
          {LISTING.map((col, ci) => (
            <motion.div
              key={col.section}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: ci * 0.15 } } }}
            >
              <div className="px-4 py-2.5 border-b border-borderc text-[11px] text-muted-fg flex justify-between">
                <span>
                  <span className="text-primary">$</span> ls -la {col.section}
                </span>
                <span>total {col.rows.length}</span>
              </div>
              <ul className="py-1">
                {col.rows.map(row => (
                  <motion.li
                    key={row.name}
                    variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.3 } } }}
                  >
                    <ListingRow row={row} props={props} />
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Giant interactive wordmark ── */}
      <div className="relative px-3 md:px-6">
        <AsciiWordmark text="OPENCODE" />
      </div>

      {/* ── EOF bar ── */}
      <div className="relative border-t border-borderc">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-muted-fg">
          <span>
            © {year} OpenCode — National Institute of Technology, Rourkela. <span className="text-fg/70">MIT licensed.</span>
          </span>
          <div className="flex items-center gap-5">
            <span className="tracking-[0.3em] text-primary/70">-- EOF --</span>
            <a
              href="#root"
              className="group flex items-center gap-2 px-3 py-1.5 border border-borderc hover:border-primary hover:text-primary transition-colors"
            >
              <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
              gg <span className="text-muted-fg/60">(back to top)</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function ListingRow({
  row,
  props,
}: {
  row: (typeof LISTING)[number]['rows'][number]
  props: Props
}) {
  const inner = (
    <>
      <span className="absolute inset-0 bg-primary/[0.07] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      <span className="relative hidden sm:inline text-muted-fg/50 w-[86px] shrink-0">{row.perm}</span>
      <span className="relative text-muted-fg/50 w-9 shrink-0 text-right">{row.size}</span>
      <span className="relative flex-1 truncate text-fg/85 group-hover:text-primary group-hover:translate-x-1 transition-[color,transform] duration-300">
        {row.name}
      </span>
      <span className="relative text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        {row.kind === 'ext' ? '↗' : '→'}
      </span>
    </>
  )
  const cls = 'group relative flex items-center gap-3 px-4 py-2 text-xs cursor-pointer w-full text-left'

  if (row.kind === 'route') return <Link to={row.to} className={cls}>{inner}</Link>
  if (row.kind === 'hash') return <Link to={row.to} className={cls}>{inner}</Link>
  if (row.kind === 'ext')
    return (
      <a href={row.to} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    )
  return (
    <button onClick={() => row.action && props[row.action]()} className={cls}>
      {inner}
    </button>
  )
}

/**
 * A small working shell. Commands move around the site and open the same
 * modals as the rest of the UI; tab completes, arrow keys walk history.
 */
function Shell({ onOpenSecurityModal, onOpenTerminal, onOpenSearch, onJoinClick }: Props) {
  const navigate = useNavigate()
  const [lines, setLines] = useState<Line[]>([
    { kind: 'out', text: 'opencode-sh 2.0 — tty/footer', tone: 'dim' },
    { kind: 'out', text: <>type <span className="text-primary">help</span> to list commands.</>, tone: 'dim' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIdx, setHIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const inView = useInView(boxRef, { once: true, amount: 0.6 })
  const demoed = useRef(false)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines])

  // First time the shell is seen, it types `whoami` by itself to show it is alive
  useEffect(() => {
    if (!inView || demoed.current) return
    demoed.current = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cmd = 'whoami'
    let i = 0
    const id = setInterval(() => {
      i++
      setInput(cmd.slice(0, i))
      if (i === cmd.length) {
        clearInterval(id)
        setTimeout(() => {
          run(cmd)
          setInput('')
        }, 350)
      }
    }, 110)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  const print = (...out: Line[]) => setLines(prev => [...prev, ...out])
  const o = (text: ReactNode, tone?: Line['tone']): Line => ({ kind: 'out', text, tone })

  function run(raw: string) {
    const cmdline = raw.trim()
    const entry: Line = { kind: 'in', text: cmdline }
    if (!cmdline) return print(entry)
    const [cmd, ...args] = cmdline.split(/\s+/)
    const arg = args.join(' ')

    switch (cmd) {
      case 'help':
        return print(
          entry,
          o('available commands:', 'dim'),
          o('  ls · cd <page> · join · whoami · github · security'),
          o('  palette · terminal · date · echo <text> · clear · sudo'),
        )
      case 'ls':
        return print(entry, o('about/  domains/  events/  team/  github/', 'accent'))
      case 'cd': {
        const key = (arg || '~').replace(/^\.?\/+/, '').replace(/\/$/, '') || '~'
        const to = ROUTES[key]
        if (!to) return print(entry, o(`cd: no such directory: ${arg}`, 'err'))
        print(entry, o(`→ ${to}`, 'ok'))
        return navigate(to)
      }
      case 'join':
        print(entry, o('opening application form…', 'ok'))
        return onJoinClick()
      case 'whoami':
        return print(entry, o('guest@opencode — future contributor. run `join` to change that.', 'accent'))
      case 'github':
        print(entry, o(`opening ${ORG_URL}`, 'ok'))
        window.open(ORG_URL, '_blank', 'noopener,noreferrer')
        return
      case 'security':
        print(entry, o('cat security.txt', 'ok'))
        return onOpenSecurityModal()
      case 'palette':
        print(entry, o('launching command palette…', 'ok'))
        return onOpenSearch()
      case 'terminal':
        print(entry, o('spawning full terminal…', 'ok'))
        return onOpenTerminal()
      case 'date':
        return print(entry, o(new Date().toString()))
      case 'echo':
        return print(entry, o(arg))
      case 'clear':
        return setLines([])
      case 'sudo':
        return print(
          entry,
          o('[sudo] password for guest: ********', 'dim'),
          o('guest is not in the sudoers file. this incident will be reported.', 'err'),
        )
      case 'flag':
        return print(entry, o('flags are earned, not printed. the console might know more.', 'dim'))
      case 'exit':
        return print(entry, o('there is no exit. only commits.', 'accent'))
      default:
        return print(entry, o(`command not found: ${cmd}. try \`help\`.`, 'err'))
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input)
      if (input.trim()) setHistory(h => [input, ...h])
      setHIdx(-1)
      setInput('')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const [head, ...rest] = input.split(' ')
      if (rest.length === 0) {
        const match = COMMANDS.filter(c => c.startsWith(head))
        if (match.length === 1) setInput(match[0] + ' ')
        else if (match.length > 1) print({ kind: 'in', text: input }, o(match.join('  '), 'dim'))
      } else if (head === 'cd') {
        const match = Object.keys(ROUTES).filter(r => r.startsWith(rest.join(' ')) && /^[a-z]/.test(r))
        if (match.length === 1) setInput(`cd ${match[0]}`)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(hIdx + 1, history.length - 1)
      if (history[next] !== undefined) {
        setHIdx(next)
        setInput(history[next])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = hIdx - 1
      setHIdx(next)
      setInput(next >= 0 ? history[next] : '')
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  const toneCls = (tone?: Line['tone']) =>
    tone === 'ok' ? 'text-primary' : tone === 'err' ? 'text-warning' : tone === 'dim' ? 'text-muted-fg' : tone === 'accent' ? 'text-accent' : 'text-fg/85'

  return (
    <div
      ref={boxRef}
      onClick={() => inputRef.current?.focus()}
      className="border border-borderc bg-bg/90 shadow-[0_0_40px_rgba(var(--primary-rgb),0.06)] cursor-text"
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-borderc bg-card/80 text-[11px] text-muted-fg">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-warning/70" />
          <span className="w-2.5 h-2.5 bg-accent/60" />
          <span className="w-2.5 h-2.5 bg-primary/70" />
          <span className="ml-2">guest@opencode: ~</span>
        </div>
        <span className="hidden sm:inline">bash · 80×24</span>
      </div>

      <div ref={scrollRef} data-lenis-prevent className="h-60 overflow-y-auto px-4 py-3 text-xs leading-6">
        {lines.map((l, i) =>
          l.kind === 'in' ? (
            <div key={i} className="break-all">
              <span className="text-primary">guest@opencode</span>
              <span className="text-muted-fg">:~$ </span>
              <span className="text-fg">{l.text}</span>
            </div>
          ) : (
            <div key={i} className={`whitespace-pre-wrap break-words ${toneCls(l.tone)}`}>
              {l.text}
            </div>
          ),
        )}

        <label className="flex items-center">
          <span className="text-primary">guest@opencode</span>
          <span className="text-muted-fg">:~$&nbsp;</span>
          <span className="relative flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label="Footer shell command"
              className="peer w-full bg-transparent outline-none text-fg caret-transparent"
            />
            {/* Block caret that tracks the end of the typed text */}
            <span className="pointer-events-none absolute left-0 top-0 whitespace-pre text-transparent opacity-40 peer-focus:opacity-100" aria-hidden="true">
              {input}
              <span className="cursor-blink inline-block w-[0.6em] h-[1.1em] align-middle bg-primary/80" />
            </span>
          </span>
        </label>
      </div>
    </div>
  )
}
