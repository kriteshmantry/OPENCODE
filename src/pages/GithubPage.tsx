import { useState } from 'react'
import { motion } from 'framer-motion'
import ContributionSkyline, { type PaletteName } from '../components/ui/contribution-skyline'
import OpenCodeLogo from '../components/OpenCodeLogo'

interface RepoItem {
  name: string
  desc: string
  stars: number
  forks: number
  lang: string
  langColor: string
  tags: string[]
  url: string
}

const ORG_URL = 'https://github.com/OpencodeNIT-R'
const ORG_AVATAR = 'https://avatars.githubusercontent.com/u/142724566?s=280&v=4'

const REPOSITORIES: RepoItem[] = [
  {
    name: 'vulnscan',
    desc: 'Automated vulnerability scanner with CVE correlation and OWASP Top-10 severity scoring. Built for rapid security audits.',
    stars: 445,
    forks: 78,
    lang: 'Python',
    langColor: '#3572A5',
    tags: ['Security', 'Scanner', 'CVE', 'OWASP'],
    url: `${ORG_URL}/vulnscan`,
  },
  {
    name: 'bruteforge',
    desc: 'High-performance password audit framework supporting 40+ hash types with GPU acceleration (OpenCL & CUDA).',
    stars: 312,
    forks: 46,
    lang: 'Rust',
    langColor: '#dea584',
    tags: ['Cryptography', 'GPU', 'Audit', 'Rust'],
    url: `${ORG_URL}/bruteforge`,
  },
  {
    name: 'memvault',
    desc: 'Memory forensics toolkit for live incident response. Dump, analyze, and correlate volatile memory process artifacts.',
    stars: 234,
    forks: 39,
    lang: 'C++',
    langColor: '#f34b7d',
    tags: ['Forensics', 'Incident-Response', 'C++'],
    url: `${ORG_URL}/memvault`,
  },
  {
    name: 'nulltrace',
    desc: 'Multi-hop network packet anonymizer. Routes traffic through randomized relay chains with end-to-end encryption.',
    stars: 189,
    forks: 31,
    lang: 'Go',
    langColor: '#00ADD8',
    tags: ['Networking', 'Privacy', 'Tor-Alternative', 'Go'],
    url: `${ORG_URL}/nulltrace`,
  },
  {
    name: 'hephaestus',
    desc: 'Core developer automation toolkit and bot engine powering OpenCode workflows, CI pipelines, and member onboarding.',
    stars: 167,
    forks: 29,
    lang: 'TypeScript',
    langColor: '#3178c6',
    tags: ['Automation', 'CLI', 'DevOps', 'TypeScript'],
    url: `${ORG_URL}/hephaestus`,
  },
  {
    name: 'project-artemis',
    desc: 'Security telemetry pipeline and automated CTF challenge hosting infrastructure with isolated Docker containers.',
    stars: 156,
    forks: 24,
    lang: 'Rust',
    langColor: '#dea584',
    tags: ['CTF', 'Infra', 'Docker', 'Systems'],
    url: `${ORG_URL}/project-artemis`,
  },
]

export default function GithubPage() {
  const [selectedPalette, setSelectedPalette] = useState<PaletteName>('github')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [filterLang, setFilterLang] = useState<string>('All')

  const copyCloneCmd = (repoName: string, idx: number) => {
    navigator.clipboard.writeText(`git clone ${ORG_URL}/${repoName}.git`)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const allLangs = ['All', ...Array.from(new Set(REPOSITORIES.map(r => r.lang)))]
  const filteredRepos = filterLang === 'All' ? REPOSITORIES : REPOSITORIES.filter(r => r.lang === filterLang)

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto font-mono text-fg">
      {/* 1. Header / Organization Badge Banner */}
      <section className="mb-12">
        <div className="p-6 md:p-8 rounded-xl border border-borderc bg-card/60 backdrop-blur-md relative overflow-hidden">
          {/* Subtle Ambient Background Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-primary/50 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] bg-[#05090e] p-2.5 flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105">
                  <OpenCodeLogo showText={true} className="w-full h-full object-contain drop-shadow" />
                </div>
                <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[10px] bg-primary text-black font-bold uppercase tracking-wider shadow-sm select-none">
                  NITR
                </span>
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-black text-fg tracking-tight">
                    OpenCodeNITR
                  </h1>
                  <span className="text-xs px-2.5 py-0.5 rounded border border-primary/40 bg-primary/10 text-primary font-bold">
                    Official GitHub Org
                  </span>
                </div>
                <p className="text-xs text-muted-fg mt-1">@OpencodeNIT-R · National Institute of Technology, Rourkela</p>
                <p className="text-xs text-muted-fg/90 mt-2 max-w-xl">
                  Official Open Source & Cybersecurity student collective of NIT Rourkela. Architecting high-concurrency systems, low-level tooling, and kernel research labs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
              <motion.a
                href={ORG_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-black font-bold text-xs rounded-sm hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] transition-all cursor-pointer w-full sm:w-auto"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                <span>View on GitHub ↗</span>
              </motion.a>

              <motion.a
                href={`${ORG_URL}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-borderc text-muted-fg hover:text-fg hover:border-fg/40 text-xs rounded-sm transition-colors cursor-pointer w-full sm:w-auto"
              >
                <span>Browse All Repositories</span>
              </motion.a>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-borderc/80">
            <div>
              <span className="text-[11px] text-muted-fg block">Total Stars</span>
              <span className="text-xl font-bold text-primary">1,500+</span>
            </div>
            <div>
              <span className="text-[11px] text-muted-fg block">Open Source Tools</span>
              <span className="text-xl font-bold text-fg">24+</span>
            </div>
            <div>
              <span className="text-[11px] text-muted-fg block">Active Contributors</span>
              <span className="text-xl font-bold text-accent">48+</span>
            </div>
            <div>
              <span className="text-[11px] text-muted-fg block">Yearly Contributions</span>
              <span className="text-xl font-bold text-primary">1,720+</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 3D Isometric Contribution Skyline Graph */}
      <section className="mb-14">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-xs text-primary uppercase tracking-[0.2em] font-bold">
              // Activity Visualization
            </p>
            <h2 className="text-xl md:text-2xl font-black text-fg mt-1">
              Interactive 3D Contribution Skyline
            </h2>
            <p className="text-xs text-muted-fg mt-0.5">
              Toggle between the 2D heat map and the 3D skyline. Drag to orbit, hover for day details, and walk with arrow keys.
            </p>
          </div>

          {/* Palette Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-fg">Theme:</span>
            <div className="flex items-center gap-1 bg-card border border-borderc p-1 rounded-sm">
              {(
                [
                  { name: 'github', label: 'Classic' },
                  { name: 'halloween', label: 'Ember' },
                  { name: 'ocean', label: 'Ocean' },
                  { name: 'grape', label: 'Grape' },
                  { name: 'mono', label: 'Mono' },
                ] as const
              ).map(p => (
                <button
                  key={p.name}
                  onClick={() => setSelectedPalette(p.name)}
                  className={`text-[10px] px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                    selectedPalette === p.name
                      ? 'bg-primary/20 text-primary border border-primary/40 font-bold'
                      : 'text-muted-fg hover:text-fg'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* The ContributionSkyline Component */}
        <ContributionSkyline
          palette={selectedPalette}
          defaultView="3d"
          title={
            <>
              <span className="font-bold text-primary">OpenCodeNITR</span> — 1,720 Contributions in the last year
            </>
          }
          className="shadow-[0_10px_35px_rgba(0,0,0,0.5)] border-borderc"
        />
      </section>

      {/* 3. Featured Repositories on OpencodeNIT-R */}
      <section className="mb-14">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs text-primary uppercase tracking-[0.2em] font-bold">
              // Official Repositories
            </p>
            <h2 className="text-xl md:text-2xl font-black text-fg mt-1">
              OpenCode Projects & Tooling
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {allLangs.map(l => (
              <button
                key={l}
                onClick={() => setFilterLang(l)}
                className={`text-xs px-3 py-1 rounded-sm transition-colors border cursor-pointer ${
                  filterLang === l
                    ? 'border-primary/50 bg-primary/15 text-primary font-bold'
                    : 'border-borderc bg-card/60 text-muted-fg hover:text-fg'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepos.map((repo, idx) => (
            <motion.div
              key={repo.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-5 rounded-lg border border-borderc bg-card/70 hover:border-primary/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-primary group-hover:underline flex items-center gap-1.5"
                  >
                    <span>{repo.name}</span>
                    <span className="text-[11px] opacity-70">↗</span>
                  </a>
                  <span className="text-xs text-muted-fg flex items-center gap-1">
                    ★ {repo.stars}
                  </span>
                </div>

                <p className="text-xs text-muted-fg leading-relaxed mb-4">
                  {repo.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {repo.tags.map(t => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded bg-muted/60 text-muted-fg border border-borderc/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-borderc/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: repo.langColor }}
                  />
                  <span className="text-muted-fg text-[11px]">{repo.lang}</span>
                </div>

                <button
                  onClick={() => copyCloneCmd(repo.name, idx)}
                  className="text-[11px] px-2.5 py-1 rounded bg-bg border border-borderc hover:border-primary/50 text-muted-fg hover:text-primary transition-colors cursor-pointer"
                  title="Copy git clone command"
                >
                  {copiedIndex === idx ? '✓ Copied' : '$ git clone'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Contribution Guide Section */}
      <section className="p-6 md:p-8 rounded-xl border border-borderc bg-card/50 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs text-primary uppercase tracking-[0.2em] font-bold block mb-1">
              // How to Contribute
            </span>
            <h3 className="text-xl font-bold text-fg">
              Join OpenCode NITR as an Open Source Contributor
            </h3>
            <p className="text-xs text-muted-fg mt-2 leading-relaxed">
              We welcome pull requests, security audits, and issue proposals across all club repositories. Fork any project on GitHub, submit your patch, and earn recognition on our leaderboard.
            </p>
          </div>

          <div className="w-full lg:w-auto bg-black/60 p-4 rounded-lg border border-borderc font-mono text-xs text-muted-fg">
            <div className="text-primary font-bold mb-1">// Quick Terminal Setup:</div>
            <p className="text-fg">$ git clone {ORG_URL}/vulnscan.git</p>
            <p className="text-fg">$ cd vulnscan && git checkout -b feat/patch</p>
            <p className="text-accent mt-1">$ git push origin feat/patch</p>
          </div>
        </div>
      </section>
    </div>
  )
}
