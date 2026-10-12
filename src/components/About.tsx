import { useState } from 'react'
import { motion } from 'framer-motion'
import DecryptText from './DecryptText'

export default function About() {
  const [activeDomain, setActiveDomain] = useState<'opensource' | 'cybersec'>('cybersec')

  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Main story grid */}
        <div className="grid md:grid-cols-2 gap-16 items-start mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="font-mono text-xs text-accent uppercase tracking-[0.2em] mb-4">
              // NIT Rourkela Official Student Chapter
            </p>
            <DecryptText
              text="About Us."
              tag="h2"
              className="font-mono text-4xl md:text-5xl font-black text-fg leading-tight mb-6"
              delay={100}
            />
            <div className="space-y-4 text-muted-fg leading-relaxed text-sm">
              <p>
                We are <strong>OPENCODE</strong>, a collective of builders, thinkers, and relentless tinkerers who believe great technology starts with open minds. We don't just learn to code, we ship real solutions to real problems.
              </p>
              <p>
                Our community brings together developers, designers, and innovators from diverse domains, all united by one drive: to push boundaries and turn bold ideas into working products. Here, curiosity is currency, collaboration is culture, and every member has a voice.
              </p>
              <p>
                Through hackathons, workshops, and open-source projects, we transform raw talent into impact. Whether you're writing your first line of code or your thousandth, you belong here.
              </p>
              <p className="font-semibold text-fg">
                Code openly. Build boldly. Grow together.
              </p>
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2.5">
              {[
                'NIT Rourkela',
                'Kernel Hacking',
                'Reverse Engineering',
                'Distributed Systems',
                'Zero-Knowledge Proofs',
                'FOSS Tooling',
              ].map(tag => (
                <span
                  key={tag}
                  className="font-mono text-xs px-3 py-1.5 border border-borderc text-muted-fg rounded-sm hover:border-primary/40 hover:text-fg transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Philosophy Code Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          >
            <div
              className="rounded-sm border border-borderc overflow-hidden scanlines"
              style={{ background: 'var(--card)' }}
            >
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-borderc bg-muted/50">
                <span className="font-mono text-xs text-muted-fg">opencode_ethos.rs</span>
                <span className="font-mono text-[11px] text-primary">NIT Rourkela</span>
              </div>
              <pre className="p-5 font-mono text-xs md:text-sm leading-6 md:leading-7 overflow-x-auto text-fg/80">
                <code>
                  <span className="text-accent">// The OpenCode Dual Paradigm</span>{'\n'}
                  <span className="text-primary">pub struct</span> <span className="text-fg">OpenCodeCollective</span> {'{\n'}
                  {'    '}<span className="text-muted-fg">open_source:</span> Track::SystemsAndTooling,{'\n'}
                  {'    '}<span className="text-muted-fg">cybersecurity:</span> Track::OffensiveAndDefensive,{'\n'}
                  {'}'}{'\n\n'}
                  <span className="text-primary">impl</span> <span className="text-fg">OpenCodeCollective</span> {'{\n'}
                  {'    '}<span className="text-primary">pub fn</span> <span className="text-accent">philosophy</span>() -&gt; &amp;<span className="text-primary">'static</span> str {'{\n'}
                  {'        '}<span className="text-warning">"Demystify the machine. Build without permission."</span>{'\n'}
                  {'    }'}{'\n'}
                  {'}'}
                </code>
              </pre>
            </div>

            {/* GitHub Card */}
            <div className="mt-4 flex items-center justify-between gap-3 p-4 border border-borderc rounded-sm bg-card/50">
              <div className="flex items-center gap-3">
                <svg className="text-muted-fg flex-shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                <div>
                  <div className="font-mono text-sm text-fg font-bold">opencode-nitrkl</div>
                  <div className="font-mono text-xs text-muted-fg">4,218 stars · 148 upstream PRs · MIT License</div>
                </div>
              </div>
              <a
                href="https://github.com/nullsec-collective"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs px-3 py-1.5 bg-primary/15 text-primary border border-primary/30 rounded-sm hover:bg-primary/25 transition-colors"
              >
                view org ↗
              </a>
            </div>
          </motion.div>
        </div>

        {/* Dual Domains Deep Dive */}
        <div id="domains" className="pt-10 border-t border-borderc">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <p className="font-mono text-xs text-accent uppercase tracking-[0.2em] mb-2">// CORE SPECIALIZATIONS</p>
              <h3 className="font-mono text-2xl font-bold text-fg">Two Tracks. One Unified Craft.</h3>
            </div>
            <div className="flex border border-borderc rounded p-1 bg-card">
              <button
                onClick={() => setActiveDomain('cybersec')}
                className={`px-4 py-1.5 font-mono text-xs rounded transition-colors cursor-pointer ${
                  activeDomain === 'cybersec' ? 'bg-primary text-bg font-bold' : 'text-muted-fg hover:text-fg'
                }`}
              >
                🛡️ Cybersecurity Track
              </button>
              <button
                onClick={() => setActiveDomain('opensource')}
                className={`px-4 py-1.5 font-mono text-xs rounded transition-colors cursor-pointer ${
                  activeDomain === 'opensource' ? 'bg-accent text-bg font-bold' : 'text-muted-fg hover:text-fg'
                }`}
              >
                🌐 Open Source & Systems Track
              </button>
            </div>
          </div>

          {activeDomain === 'cybersec' ? (
            <div className="grid md:grid-cols-3 gap-6 font-mono">
              <div className="bg-card border border-borderc p-6 rounded-sm">
                <div className="text-primary text-xl mb-3">01 // Binary Pwn & RE</div>
                <h4 className="font-bold text-fg mb-2">Low-Level Exploitation</h4>
                <p className="text-xs text-muted-fg leading-relaxed">
                  Deep analysis of memory management, heap allocators, ROP chains, ARM/x86 disassembly, and kernel-level vulnerabilities.
                </p>
              </div>
              <div className="bg-card border border-borderc p-6 rounded-sm">
                <div className="text-primary text-xl mb-3">02 // CTF & Wargames</div>
                <h4 className="font-bold text-fg mb-2">Competitive Hacking</h4>
                <p className="text-xs text-muted-fg leading-relaxed">
                  Participating in top tier CTFs (PicoCTF, CSAW, DefCon Quals, NullCTF) across Web, Crypto, Forensics, and OSINT.
                </p>
              </div>
              <div className="bg-card border border-borderc p-6 rounded-sm">
                <div className="text-primary text-xl mb-3">03 // Applied Cryptography</div>
                <h4 className="font-bold text-fg mb-2">Privacy & Zero-Knowledge</h4>
                <p className="text-xs text-muted-fg leading-relaxed">
                  Researching elliptic curves, lattice-based post-quantum algorithms, SNARKs, and secure multiparty computation (MPC).
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 font-mono">
              <div className="bg-card border border-borderc p-6 rounded-sm">
                <div className="text-accent text-xl mb-3">01 // Systems & Kernel</div>
                <h4 className="font-bold text-fg mb-2">Rust & Linux Subsystems</h4>
                <p className="text-xs text-muted-fg leading-relaxed">
                  Building device drivers, async network runtimes, memory-safe OS modules, and shipping upstream patches to Linux & Rust.
                </p>
              </div>
              <div className="bg-card border border-borderc p-6 rounded-sm">
                <div className="text-accent text-xl mb-3">02 // Developer Tooling</div>
                <h4 className="font-bold text-fg mb-2">CLI & Security Scanners</h4>
                <p className="text-xs text-muted-fg leading-relaxed">
                  Creating open source frameworks (VulnScan, BruteForge, NullTrace) used by thousands of security practitioners worldwide.
                </p>
              </div>
              <div className="bg-card border border-borderc p-6 rounded-sm">
                <div className="text-accent text-xl mb-3">03 // Distributed Infrastructure</div>
                <h4 className="font-bold text-fg mb-2">P2P & Cloud Native</h4>
                <p className="text-xs text-muted-fg leading-relaxed">
                  Architecting resilient microservices, decentralized storage over IPFS, container orchestration, and WebAssembly runtimes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
