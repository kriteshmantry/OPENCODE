import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import DecryptText from '../components/DecryptText'
import { ShinyButton } from '../components/ui/shiny-button'
import CornerBrackets from '../components/fx/CornerBrackets'
import { Link } from 'react-router-dom'

interface DomainsPageProps {
  onJoinClick?: () => void
  theme?: 'green' | 'blue'
}

type TrackId = 'cybersec' | 'opensource'

const TRACKS: Record<
  TrackId,
  {
    roadmapTitle: string
    cards: { n: string; t: string; d: string; meta: [string, string][] }[]
    roadmap: { weeks: string; t: string; d: string }[]
  }
> = {
  cybersec: {
    roadmapTitle: '12-Week Cadet Roadmap (Cybersecurity)',
    cards: [
      {
        n: '01 // Binary Pwn & RE',
        t: 'Low-Level Exploitation',
        d: 'Deep analysis of memory management, heap allocators, ROP chains, ARM/x86 disassembly, and kernel-level vulnerabilities.',
        meta: [['Tooling', 'Ghidra, IDA Pro, GDB-pwndbg, ROPgadget'], ['Target', 'Linux ELF, glibc heap, Windows PE']],
      },
      {
        n: '02 // CTF & Wargames',
        t: 'Competitive Hacking',
        d: 'Participating in top tier CTFs (PicoCTF, CSAW, DefCon Quals, NullCTF) across Web, Crypto, Forensics, and OSINT.',
        meta: [['Practice', 'HackTheBox, Root-Me, OverTheWire, CTFtime'], ['Format', 'Jeopardy, Attack-Defense, King of the Hill']],
      },
      {
        n: '03 // Applied Cryptography',
        t: 'Privacy & Zero-Knowledge',
        d: 'Researching elliptic curves, lattice-based post-quantum algorithms, SNARKs, and secure multiparty computation (MPC).',
        meta: [['Tooling', 'SageMath, Circom, Rust Crypto, Arkworks'], ['Focus', 'ZK-Rollups, lattice attacks, side-channel analysis']],
      },
    ],
    roadmap: [
      { weeks: 'WEEKS 1–3', t: 'Linux & Web Defense', d: 'Shell navigation, HTTP internals, SQLi, XSS, SSRF, Burp Suite.' },
      { weeks: 'WEEKS 4–6', t: 'Crypto & Forensics', d: 'Classic & RSA attacks, Wireshark packet dumps, Volatility memory analysis.' },
      { weeks: 'WEEKS 7–9', t: 'Assembly & Reversing', d: 'x86-64 calling conventions, Ghidra decompilation, cracking binaries.' },
      { weeks: 'WEEKS 10–12', t: 'Binary Exploitation', d: 'Stack buffer overflows, shellcoding, ret2libc, DEP/ASLR bypass.' },
    ],
  },
  opensource: {
    roadmapTitle: '12-Week Cadet Roadmap (Systems & FOSS)',
    cards: [
      {
        n: '01 // Systems & Kernel',
        t: 'Rust & Linux Subsystems',
        d: 'Building device drivers, async network runtimes, memory-safe OS modules, and shipping upstream patches to Linux & Rust.',
        meta: [['Languages', 'Rust, C, Modern C++20, eBPF'], ['Targets', 'Linux Kernel, Tokio async, WebAssembly']],
      },
      {
        n: '02 // Developer Tooling',
        t: 'CLI & Security Scanners',
        d: 'Creating open source frameworks (VulnScan, BruteForge, NullTrace) used by thousands of security practitioners worldwide.',
        meta: [['Ecosystem', 'Go, Python, Clap CLI, Rayon'], ['License', '100% Free & Open Source (MIT/Apache-2.0)']],
      },
      {
        n: '03 // Distributed Infrastructure',
        t: 'P2P & Cloud Native',
        d: 'Architecting resilient microservices, decentralized storage over IPFS, container orchestration, and WebAssembly runtimes.',
        meta: [['Stack', 'Docker, Kubernetes, Libp2p, gRPC'], ['Focus', 'Fault tolerance, consensus, distributed caching']],
      },
    ],
    roadmap: [
      { weeks: 'WEEKS 1–3', t: 'Git & C Fundamentals', d: 'Git workflows, rebasing, pointers, memory models, POSIX APIs.' },
      { weeks: 'WEEKS 4–6', t: 'Modern Rust', d: 'Borrow checker, ownership, lifetimes, cargo, safe concurrency.' },
      { weeks: 'WEEKS 7–9', t: 'Network & Async', d: 'Tokio runtime, TCP/UDP sockets, writing high-throughput servers.' },
      { weeks: 'WEEKS 10–12', t: 'Upstream Contributions', d: 'Contributing to large repos, RFC writing, review etiquette, kernel patches.' },
    ],
  },
}

/** Seconds the roadmap pipeline takes to travel from week 1 to week 12 */
const PIPELINE_DURATION = 2.4

export default function DomainsPage({ onJoinClick, theme = 'green' }: DomainsPageProps) {
  const [activeDomain, setActiveDomain] = useState<TrackId>('cybersec')
  const track = TRACKS[activeDomain]
  const isSec = activeDomain === 'cybersec'
  const tone = isSec ? 'text-primary' : 'text-accent'
  const stageTone = isSec ? 'text-accent' : 'text-primary'

  return (
    <div className="pt-24 pb-28 px-6 min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb & Header */}
        <div className="mb-4">
          <Link to="/" className="font-mono text-xs text-muted-fg hover:text-primary transition-colors">
            &larr; Return to Home
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-borderc pb-10">
          <div>
            <p className="font-mono text-xs text-accent uppercase tracking-[0.2em] mb-3">
              // SPECIALIZATION CURRICULUM
            </p>
            <DecryptText
              text="Two Tracks. One Unified Craft."
              tag="h1"
              className="font-mono text-4xl md:text-5xl lg:text-6xl font-black text-fg tracking-tight"
              delay={80}
            />
            <p className="font-mono text-muted-fg text-sm mt-3 max-w-2xl leading-relaxed">
              At OpenCode NIT Rourkela, members specialize in offensive & defensive security engineering or low-level systems & open-source software development.
            </p>
          </div>

          {/* Interactive domain toggle */}
          <div className="flex w-full sm:w-auto border border-borderc p-1 bg-card self-start md:self-auto">
            {(
              [
                { id: 'cybersec', label: '🛡️ Cybersecurity Track', pill: 'bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' },
                { id: 'opensource', label: '🌐 Systems & FOSS Track', pill: 'bg-accent shadow-[0_0_15px_rgba(0,212,255,0.3)]' },
              ] as const
            ).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveDomain(tab.id)}
                className={`relative flex-1 sm:flex-none px-3 sm:px-5 py-2 font-mono text-xs sm:whitespace-nowrap transition-colors cursor-pointer ${
                  activeDomain === tab.id ? 'text-bg font-bold' : 'text-muted-fg hover:text-fg'
                }`}
              >
                {activeDomain === tab.id && (
                  <motion.span
                    layoutId="domains-track-pill"
                    className={`absolute inset-0 ${tab.pill}`}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Domain Deep Dive Cards */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeDomain}
            initial="hidden"
            animate="show"
            exit="exit"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } },
              exit: { opacity: 0, transition: { duration: 0.2 } },
            }}
            className="space-y-8"
          >
            <div className="grid md:grid-cols-3 gap-6 font-mono">
              {track.cards.map(card => (
                <motion.div
                  key={card.n}
                  variants={{
                    hidden: { opacity: 0, clipPath: isSec ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' },
                    show: {
                      opacity: 1,
                      clipPath: 'inset(0 0% 0 0%)',
                      transition: { duration: 0.55, ease: [0.7, 0, 0.2, 1] },
                    },
                  }}
                  className={`group relative bg-card border border-borderc ${
                    isSec ? 'hover:border-primary/50' : 'hover:border-accent/50'
                  } hover:-translate-y-1 transition-[border-color,transform] duration-300 p-6`}
                >
                  <CornerBrackets accent={!isSec} />
                  <div className={`${tone} text-xl font-bold mb-3`}>{card.n}</div>
                  <h3 className="font-bold text-fg text-base mb-2">{card.t}</h3>
                  <p className="text-xs text-muted-fg leading-relaxed mb-4">{card.d}</p>
                  <div className="border-t border-borderc/60 pt-3 text-[11px] text-muted-fg space-y-1">
                    {card.meta.map(([k, v]) => (
                      <div key={k}>
                        <strong>{k}:</strong> {v}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Specialization Roadmap: a pipeline that charges week by week */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="bg-card/60 border border-borderc p-6 md:p-8 font-mono"
            >
              <h3 className={`text-lg font-bold ${tone} mb-6 flex items-center gap-2`}>
                <span>//</span> {track.roadmapTitle}
              </h3>

              <motion.div
                className="relative"
                initial="idle"
                whileInView="run"
                viewport={{ once: true, amount: 0.4 }}
              >
                {/* Pipeline rail (desktop) */}
                <div className="hidden md:block absolute left-0 right-0 top-[7px] h-px bg-borderc" aria-hidden="true" />
                <motion.div
                  aria-hidden="true"
                  className={`hidden md:block absolute left-0 right-0 top-[6px] h-[3px] origin-left ${isSec ? 'bg-accent' : 'bg-primary'}`}
                  style={{ boxShadow: `0 0 10px ${isSec ? 'var(--accent)' : 'var(--primary)'}` }}
                  variants={{
                    idle: { scaleX: 0 },
                    run: { scaleX: 1, transition: { duration: PIPELINE_DURATION, ease: 'linear', delay: 0.3 } },
                  }}
                />

                <div className="grid md:grid-cols-4 gap-4 text-xs">
                  {track.roadmap.map((stage, i) => {
                    // Each stage lights up as the rail reaches it
                    const at = 0.3 + (PIPELINE_DURATION * (i + 0.5)) / track.roadmap.length
                    return (
                      <div key={stage.weeks} className="relative md:pt-7">
                        <motion.span
                          aria-hidden="true"
                          className={`hidden md:block absolute top-0 left-4 w-[15px] h-[15px] border-2 ${
                            isSec ? 'border-accent' : 'border-primary'
                          } bg-bg rotate-45`}
                          variants={{
                            idle: { scale: 0.6, opacity: 0.4 },
                            run: {
                              scale: [0.6, 1.4, 1],
                              opacity: 1,
                              backgroundColor: isSec ? 'var(--accent)' : 'var(--primary)',
                              transition: { delay: at, duration: 0.4 },
                            },
                          }}
                        />
                        <motion.div
                          className="group relative h-full p-4 bg-bg/60 border border-borderc/60"
                          variants={{
                            idle: { opacity: 0.25, y: 10 },
                            run: { opacity: 1, y: 0, transition: { delay: at, duration: 0.45 } },
                          }}
                        >
                          <CornerBrackets accent={isSec} />
                          <span className={`${stageTone} font-bold`}>{stage.weeks}</span>
                          <h4 className="font-bold text-fg mt-1 mb-2">{stage.t}</h4>
                          <p className="text-muted-fg leading-relaxed">{stage.d}</p>
                        </motion.div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Call to action */}
        <div className="mt-16 text-center border-t border-borderc pt-12">
          <p className="font-mono text-sm text-muted-fg mb-6">
            Ready to dive deep into a specialization track at NIT Rourkela?
          </p>
          <div className="flex justify-center">
            <ShinyButton
              label="JOIN OPENCODE"
              onClick={onJoinClick}
              accentColor={theme === 'blue' ? '#1C6DFD' : '#00ff41'}
              accentSoftColor={theme === 'blue' ? '#93c5fd' : '#80ff9f'}
              fillColor={theme === 'blue' ? '#051026' : '#041207'}
              labelColor={theme === 'blue' ? '#1C6DFD' : '#00ff41'}
              cornerRadius={0}
              sweepDuration={2.6}
              arcWidth={7}
              className={`!py-3.5 !px-8 font-mono text-sm font-bold transition-shadow cursor-pointer ${
                theme === 'blue'
                  ? 'shadow-[0_0_20px_rgba(28,109,253,0.3)] hover:shadow-[0_0_35px_rgba(28,109,253,0.55)]'
                  : 'shadow-[0_0_20px_rgba(0,255,65,0.22)] hover:shadow-[0_0_35px_rgba(0,255,65,0.45)]'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
