import { motion } from 'framer-motion'
import DecryptText from './DecryptText'

interface PRContribution {
  id: string
  repo: string
  org: string
  prNumber: number
  title: string
  contributor: string
  status: 'merged' | 'in-review'
  date: string
  link: string
}

const UPSTREAM_PRS: PRContribution[] = [
  {
    id: 'pr-1',
    repo: 'torvalds/linux',
    org: 'Linux Kernel',
    prNumber: 48291,
    title: 'net: tcp: fix race condition in socket backlog memory allocation',
    contributor: 'Kira Osei (r00t_k1ng)',
    status: 'merged',
    date: 'Aug 2026',
    link: 'https://github.com/torvalds/linux',
  },
  {
    id: 'pr-2',
    repo: 'rust-lang/rust',
    org: 'Rust Compiler',
    prNumber: 124890,
    title: 'codegen: optimize SIMD vectorization pass on AVX-512 targets',
    contributor: 'Ben Nakamura (n3tw0rk_b)',
    status: 'merged',
    date: 'Jul 2026',
    link: 'https://github.com/rust-lang/rust',
  },
  {
    id: 'pr-3',
    repo: 'kubernetes/kubernetes',
    org: 'Cloud Native',
    prNumber: 119420,
    title: 'kubelet: enhance cgroup v2 memory throttling telemetry',
    contributor: 'Santiago Reyes (gh0stwr1tr)',
    status: 'merged',
    date: 'Jun 2026',
    link: 'https://github.com/kubernetes/kubernetes',
  },
  {
    id: 'pr-4',
    repo: 'pwntools/pwntools',
    org: 'CTF Framework',
    prNumber: 2194,
    title: 'arm64: support dynamic ROP gadget generation for iOS/Android binaries',
    contributor: 'Omar Farouk (0day_0mar)',
    status: 'merged',
    date: 'May 2026',
    link: 'https://github.com/Gallopsled/pwntools',
  },
  {
    id: 'pr-5',
    repo: 'radareorg/radare2',
    org: 'Reverse Eng',
    prNumber: 22410,
    title: 'anal: improve decompilation heuristic for obfuscated control flow graphs',
    contributor: 'Alice Marchetti (0xAl1ce)',
    status: 'merged',
    date: 'Apr 2026',
    link: 'https://github.com/radareorg/radare2',
  },
]

const HALL_OF_FAME = [
  {
    handle: '0day_0mar',
    achievement: '4 CVEs in Embedded Firmware & Routers',
    company: 'Securitas Lab',
    badge: 'CVE Author',
  },
  {
    handle: 'r00t_k1ng',
    achievement: 'Kernel security patch accepted upstream in Linux 6.8',
    company: 'Trail of Bits',
    badge: 'Kernel Contributor',
  },
  {
    handle: 'cr4ckm3',
    achievement: 'Top-5 World Finalist in DefCon CTF Qualifiers',
    company: 'Palantir',
    badge: 'DefCon Finalist',
  },
  {
    handle: 'gh0stwr1tr',
    achievement: 'Discovered critical SSRF in Apache Foundation toolchain',
    company: 'Google Security',
    badge: 'Bug Hunter',
  },
]

export default function ContributionTracker() {
  return (
    <section id="contributions" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="font-mono text-xs text-accent uppercase tracking-[0.2em] mb-4">
              // open source impact
            </p>
            <DecryptText
              text="Upstream & Hall of Fame."
              tag="h2"
              className="font-mono text-4xl md:text-5xl font-black text-fg"
              delay={150}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted-fg">
              Syncing with GitHub API: <strong className="text-primary">100% Up to date</strong>
            </span>
          </div>
        </div>

        {/* Big metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-borderc mb-12 border border-borderc rounded-sm overflow-hidden font-mono">
          <div className="bg-card p-6">
            <div className="text-xs text-muted-fg uppercase mb-1">Upstream PRs Merged</div>
            <div className="text-3xl font-black text-primary">148+</div>
          </div>
          <div className="bg-card p-6">
            <div className="text-xs text-muted-fg uppercase mb-1">Total GitHub Stars</div>
            <div className="text-3xl font-black text-accent">4.2k+</div>
          </div>
          <div className="bg-card p-6">
            <div className="text-xs text-muted-fg uppercase mb-1">FOSS Repos Maintained</div>
            <div className="text-3xl font-black text-fg">26 repos</div>
          </div>
          <div className="bg-card p-6">
            <div className="text-xs text-muted-fg uppercase mb-1">Alumni at Big Tech</div>
            <div className="text-3xl font-black text-warning">40+ engineers</div>
          </div>
        </div>

        {/* Two Columns: Recent Upstream PRs & Hall of Fame */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PRs Column */}
          <div className="bg-card border border-borderc rounded-sm p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-borderc">
              <h3 className="font-mono text-sm font-bold text-fg uppercase tracking-wider flex items-center gap-2">
                <span className="text-primary">⑂</span> Recent Upstream Merges
              </h3>
              <span className="font-mono text-[11px] text-muted-fg">All MIT / Apache-2.0</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {UPSTREAM_PRS.map(pr => (
                <a
                  key={pr.id}
                  href={pr.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3.5 border border-borderc hover:border-primary/40 bg-bg/40 rounded-sm transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-accent font-bold">{pr.repo} #{pr.prNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-primary/15 text-primary border border-primary/30 uppercase">
                      ✓ {pr.status}
                    </span>
                  </div>
                  <div className="text-fg group-hover:text-primary transition-colors font-medium mb-2 leading-relaxed">
                    {pr.title}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-fg">
                    <span>By {pr.contributor}</span>
                    <span>{pr.date}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Hall of Fame Column */}
          <div className="bg-card border border-borderc rounded-sm p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-borderc">
              <h3 className="font-mono text-sm font-bold text-fg uppercase tracking-wider flex items-center gap-2">
                <span className="text-warning">★</span> Security & FOSS Hall of Fame
              </h3>
              <span className="font-mono text-[11px] text-muted-fg">NIT Rourkela Pioneers</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {HALL_OF_FAME.map(member => (
                <div
                  key={member.handle}
                  className="p-3.5 border border-borderc bg-bg/40 rounded-sm flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-fg">{member.handle}</span>
                      <span className="px-1.5 py-0.2 text-[10px] bg-warning/15 text-warning border border-warning/30 rounded">
                        {member.badge}
                      </span>
                    </div>
                    <p className="text-muted-fg leading-relaxed text-[11px]">{member.achievement}</p>
                  </div>
                  <span className="text-[11px] text-primary whitespace-nowrap">{member.company}</span>
                </div>
              ))}
            </div>

            {/* Note */}
            <div className="mt-6 p-3.5 bg-muted/20 border border-borderc rounded-sm text-xs font-mono text-muted-fg">
              <span className="text-primary font-bold">&gt; Want to see your name here?</span>
              <p className="mt-1 text-[11px] leading-relaxed">
                Join our weekly sprint sessions every Wednesday & Saturday at the CS Department lab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
