import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue, type Variants } from 'framer-motion'
import DecryptText from './DecryptText'
import TypedLines from './fx/TypedLines'
import CountUp from './fx/CountUp'
import CornerBrackets from './fx/CornerBrackets'

const TOPICS = [
  'nit-rourkela',
  'kernel-hacking',
  'reverse-engineering',
  'distributed-systems',
  'zero-knowledge-proofs',
  'foss-tooling',
]

const MANIFESTO =
  'We are OPENCODE — a collective of builders, thinkers, and relentless tinkerers who believe great technology starts with open minds. We don’t just learn to code. We ship real solutions to real problems.'

// Words in the manifesto that stay in the brand color once lit
const EMPHASIS = new Set(['OPENCODE', 'open', 'minds.', 'ship'])

const PRINCIPLES = [
  {
    verb: 'Code openly.',
    cmd: 'git push --public',
    body: 'Every tool we build is MIT or Apache licensed. Our work is read, forked and patched in the open, because that is how good software gets better.',
  },
  {
    verb: 'Build boldly.',
    cmd: 'cargo build --release',
    body: 'Through hackathons, workshops and upstream patches we turn raw talent into impact. Bold ideas only count once they run.',
  },
  {
    verb: 'Grow together.',
    cmd: 'git merge --no-ff community',
    body: 'Developers, designers and researchers from every branch. Whether it is your first line of code or your thousandth, you belong here.',
  },
]

const STATS = [
  { value: 200, suffix: '+', label: 'members' },
  { value: 12, suffix: '', label: 'open-source tools' },
  { value: 4218, suffix: '', label: 'github stars' },
  { value: 148, suffix: '', label: 'upstream PRs' },
]

const TRACKS = [
  {
    file: 'cybersecurity.track',
    tone: 'text-primary',
    hover: 'group-hover:text-primary',
    rule: 'bg-primary',
    from: -60,
    items: [
      { n: '01', t: 'Binary Pwn & RE', d: 'Heap allocators, ROP chains, ARM/x86 disassembly, kernel-level vulnerabilities.' },
      { n: '02', t: 'CTF & Wargames', d: 'PicoCTF, CSAW, DefCon Quals, NullCTF across Web, Crypto, Forensics and OSINT.' },
      { n: '03', t: 'Applied Cryptography', d: 'Elliptic curves, lattice-based post-quantum schemes, SNARKs and MPC.' },
    ],
  },
  {
    file: 'open_source.track',
    tone: 'text-accent',
    hover: 'group-hover:text-accent',
    rule: 'bg-accent',
    from: 60,
    items: [
      { n: '01', t: 'Systems & Kernel', d: 'Device drivers, async runtimes, memory-safe OS modules, upstream patches to Linux & Rust.' },
      { n: '02', t: 'Developer Tooling', d: 'VulnScan, BruteForge, NullTrace and other frameworks used by security practitioners.' },
      { n: '03', t: 'Distributed Infrastructure', d: 'Resilient microservices, IPFS storage, container orchestration and WebAssembly runtimes.' },
    ],
  },
] as const

const RISE: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
}

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto">
        <RepoHeader />
        <Manifesto />
        <Principles />
        <Stats />
        <Tracks />
        <Philosophy />
      </div>
    </section>
  )
}

/** File path, title and topic chips, styled like the top of a repository README */
function RepoHeader() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      className="mb-14 md:mb-20"
    >
      <motion.div
        variants={RISE}
        className="flex flex-wrap items-center justify-between gap-3 border border-borderc bg-card/70 px-4 py-2.5 font-mono text-[11px] text-muted-fg"
      >
        <span>
          <span className="text-primary">OpencodeNIT-R</span> / opencode / <span className="text-fg">README.md</span>
        </span>
        <a
          href="https://github.com/OpencodeNIT-R"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden px-3 py-1 border border-primary/40 text-primary hover:text-bg transition-colors"
        >
          <span className="absolute inset-0 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          <span className="relative">view org ↗</span>
        </a>
      </motion.div>

      <div className="mt-10 flex items-start gap-4 md:gap-6">
        <motion.span
          variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { duration: 0.5 } } }}
          className="font-mono text-5xl md:text-7xl font-black text-accent/60 leading-none"
          aria-hidden="true"
        >
          #
        </motion.span>
        <div>
          <DecryptText
            text="About Us."
            tag="h2"
            className="font-mono text-5xl md:text-7xl font-black text-fg leading-none tracking-tight"
            delay={100}
          />
          <motion.p variants={RISE} className="font-mono text-xs text-muted-fg uppercase tracking-[0.25em] mt-4">
            NIT Rourkela · official student chapter
          </motion.p>
        </div>
      </div>

      <motion.div variants={RISE} className="mt-8 flex flex-wrap gap-2">
        {TOPICS.map(t => (
          <span
            key={t}
            className="font-mono text-[11px] px-2.5 py-1 border border-accent/30 bg-accent/5 text-accent hover:bg-accent/15 hover:-translate-y-0.5 transition-all"
          >
            {t}
          </span>
        ))}
      </motion.div>
    </motion.div>
  )
}

/** The manifesto lights up word by word as it scrolls through the viewport, as if being read */
function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = MANIFESTO.split(' ')

  return (
    <div className="grid md:grid-cols-12 gap-6 mb-20 md:mb-28">
      <div className="md:col-span-2 font-mono text-[11px] text-muted-fg uppercase tracking-[0.25em] pt-3">
        <span className="text-primary">##</span> who we are
      </div>
      <p
        ref={ref}
        className="md:col-span-10 font-mono text-2xl md:text-4xl leading-snug md:leading-tight font-bold tracking-tight"
      >
        {words.map((w, i) => (
          <Word
            key={i}
            word={w}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
            emphasis={EMPHASIS.has(w)}
            still={!!reduced}
          />
        ))}
      </p>
    </div>
  )
}

function Word({
  word,
  progress,
  range,
  emphasis,
  still,
}: {
  word: string
  progress: MotionValue<number>
  range: [number, number]
  emphasis: boolean
  still: boolean
}) {
  const opacity = useTransform(progress, range, [0.12, 1])
  return (
    <motion.span
      style={{ opacity: still ? 1 : opacity }}
      className={`inline-block mr-[0.28em] ${emphasis ? 'text-primary' : 'text-fg'}`}
    >
      {word}
    </motion.span>
  )
}

/** Code openly. Build boldly. Grow together. as three joined cells */
function Principles() {
  return (
    <div className="mb-20 md:mb-28">
      <SectionLabel>## principles</SectionLabel>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
        className="grid md:grid-cols-3 border border-borderc bg-card/60 divide-y md:divide-y-0 md:divide-x divide-borderc"
      >
        {PRINCIPLES.map((p, i) => (
          <motion.div key={p.verb} variants={RISE} className="group relative p-7 md:p-8 overflow-hidden">
            {/* Fill rises from the floor on hover */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-primary/[0.06] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out"
            />
            <CornerBrackets />
            <div className="relative">
              <div className="flex items-baseline justify-between font-mono">
                <span className="text-5xl font-black text-borderc group-hover:text-primary/40 transition-colors duration-500">
                  0{i + 1}
                </span>
                <span className="text-[10px] text-muted-fg tracking-widest">{p.cmd}</span>
              </div>
              <h3 className="font-mono text-2xl font-black text-fg mt-6 mb-3 group-hover:text-primary transition-colors">
                {p.verb}
              </h3>
              <p className="text-sm text-muted-fg leading-relaxed">{p.body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function Stats() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      className="grid grid-cols-2 md:grid-cols-4 border-y border-borderc mb-20 md:mb-28"
    >
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          variants={RISE}
          className={`relative py-8 px-4 md:px-6 ${i % 2 === 1 ? 'border-l border-borderc' : ''} ${
            i === 2 ? 'md:border-l border-t md:border-t-0 border-borderc' : ''
          } ${i === 3 ? 'border-t md:border-t-0' : ''}`}
        >
          <CountUp value={s.value} suffix={s.suffix} className="font-mono text-4xl md:text-5xl font-black text-fg" />
          <div className="font-mono text-[11px] text-muted-fg uppercase tracking-[0.2em] mt-2">{s.label}</div>
          <motion.span
            aria-hidden="true"
            className="absolute left-0 bottom-0 h-[2px] w-full bg-primary origin-left"
            variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.2, ease: [0.2, 0.8, 0.2, 1] } } }}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

/**
 * The two tracks as a split diff: each side slides in from its own edge and
 * they meet at a shared seam labelled "one unified craft".
 */
function Tracks() {
  return (
    <div id="domains" className="mb-20 md:mb-28 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <SectionLabel>## core specializations</SectionLabel>
          <h3 className="font-mono text-3xl md:text-4xl font-black text-fg">
            Two tracks. <span className="text-primary">One unified craft.</span>
          </h3>
        </div>
        <span className="font-mono text-[11px] text-muted-fg">
          <span className="text-primary">+3</span> <span className="text-accent">+3</span> specializations
        </span>
      </div>

      <div className="relative grid md:grid-cols-2 border border-borderc bg-card/60">
        {/* Seam where the two tracks meet */}
        <motion.div
          aria-hidden="true"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.7, 0, 0.2, 1] }}
          className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-primary via-fg/50 to-accent z-10"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 1.2 }}
          className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-bg border border-borderc px-2 py-3 font-mono text-[10px] tracking-[0.3em] text-fg [writing-mode:vertical-rl]"
        >
          ONE UNIFIED CRAFT
        </motion.div>

        {TRACKS.map((track, ti) => (
          <motion.div
            key={track.file}
            initial={{ opacity: 0, x: track.from }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className={ti === 1 ? 'border-t md:border-t-0 border-borderc' : undefined}
          >
            <div className="flex items-center justify-between px-5 py-2.5 border-b border-borderc bg-bg/60 font-mono text-[11px]">
              <span className={track.tone}>{track.file}</span>
              <span className="text-muted-fg">@@ +1,3 @@</span>
            </div>
            <motion.ul
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18, delayChildren: 0.6 } } }}
            >
              {track.items.map(item => (
                <motion.li
                  key={item.n}
                  variants={{
                    hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
                    show: { opacity: 1, clipPath: 'inset(0 0% 0 0)', transition: { duration: 0.5, ease: [0.7, 0, 0.2, 1] } },
                  }}
                  className="group relative flex gap-4 px-5 py-5 border-b last:border-b-0 border-borderc/60 hover:bg-fg/[0.02] transition-colors"
                >
                  <span className={`absolute left-0 top-0 bottom-0 w-[2px] ${track.rule} origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300`} />
                  <span className={`font-mono text-sm font-bold ${track.tone} pt-0.5`}>+</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 font-mono">
                      <span className="text-[11px] text-muted-fg">{item.n}</span>
                      <h4 className={`font-bold text-fg ${track.hover} transition-colors`}>
                        {item.t}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-fg leading-relaxed mt-1.5">{item.d}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/** Closing line: the club's philosophy as a function that prints itself */
function Philosophy() {
  return (
    <div className="border border-borderc bg-bg/80 scanlines">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-borderc bg-card/70 font-mono text-[11px] text-muted-fg">
        <span>src/ethos.rs</span>
        <span className="text-primary">pub</span>
      </div>
      <TypedLines
        stagger={0.25}
        className="p-6 md:p-8 font-mono text-sm md:text-xl leading-relaxed overflow-x-auto text-fg/80"
        lines={[
          <>
            <span className="text-primary">pub fn</span> <span className="text-accent">philosophy</span>() -&gt; &amp;
            <span className="text-primary">'static</span> str {'{'}
          </>,
          <>
            {'    '}
            <span className="text-warning">"Demystify the machine. Build without permission."</span>
          </>,
          '}',
        ]}
      />
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] text-muted-fg uppercase tracking-[0.25em] mb-4">
      <span className="text-primary">{String(children).slice(0, 2)}</span>
      {String(children).slice(2)}
    </p>
  )
}
