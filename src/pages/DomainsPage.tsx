import { useState } from 'react'
import { motion } from 'framer-motion'
import DecryptText from '../components/DecryptText'
import { ShinyButton } from '../components/ui/shiny-button'
import { Link } from 'react-router-dom'

interface DomainsPageProps {
  onJoinClick?: () => void
}

export default function DomainsPage({ onJoinClick }: DomainsPageProps) {
  const [activeDomain, setActiveDomain] = useState<'cybersec' | 'opensource'>('cybersec')

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
          <div className="flex border border-borderc rounded p-1 bg-card self-start md:self-auto">
            <button
              onClick={() => setActiveDomain('cybersec')}
              className={`px-5 py-2 font-mono text-xs rounded transition-colors cursor-pointer ${
                activeDomain === 'cybersec' ? 'bg-primary text-bg font-bold shadow-[0_0_15px_rgba(0,255,65,0.3)]' : 'text-muted-fg hover:text-fg'
              }`}
            >
              🛡️ Cybersecurity Track
            </button>
            <button
              onClick={() => setActiveDomain('opensource')}
              className={`px-5 py-2 font-mono text-xs rounded transition-colors cursor-pointer ${
                activeDomain === 'opensource' ? 'bg-accent text-bg font-bold shadow-[0_0_15px_rgba(0,212,255,0.3)]' : 'text-muted-fg hover:text-fg'
              }`}
            >
              🌐 Systems & FOSS Track
            </button>
          </div>
        </div>

        {/* Domain Deep Dive Cards */}
        {activeDomain === 'cybersec' ? (
          <motion.div
            key="cybersec"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="grid md:grid-cols-3 gap-6 font-mono">
              <div className="bg-card border border-borderc hover:border-primary/50 transition-colors p-6 rounded-sm">
                <div className="text-primary text-xl font-bold mb-3">01 // Binary Pwn & RE</div>
                <h3 className="font-bold text-fg text-base mb-2">Low-Level Exploitation</h3>
                <p className="text-xs text-muted-fg leading-relaxed mb-4">
                  Deep analysis of memory management, heap allocators, ROP chains, ARM/x86 disassembly, and kernel-level vulnerabilities.
                </p>
                <div className="border-t border-borderc/60 pt-3 text-[11px] text-muted-fg space-y-1">
                  <div><strong>Tooling:</strong> Ghidra, IDA Pro, GDB-pwndbg, ROPgadget</div>
                  <div><strong>Target:</strong> Linux ELF, glibc heap, Windows PE</div>
                </div>
              </div>

              <div className="bg-card border border-borderc hover:border-primary/50 transition-colors p-6 rounded-sm">
                <div className="text-primary text-xl font-bold mb-3">02 // CTF & Wargames</div>
                <h3 className="font-bold text-fg text-base mb-2">Competitive Hacking</h3>
                <p className="text-xs text-muted-fg leading-relaxed mb-4">
                  Participating in top tier CTFs (PicoCTF, CSAW, DefCon Quals, NullCTF) across Web, Crypto, Forensics, and OSINT.
                </p>
                <div className="border-t border-borderc/60 pt-3 text-[11px] text-muted-fg space-y-1">
                  <div><strong>Practice:</strong> HackTheBox, Root-Me, OverTheWire, CTFtime</div>
                  <div><strong>Format:</strong> Jeopardy, Attack-Defense, King of the Hill</div>
                </div>
              </div>

              <div className="bg-card border border-borderc hover:border-primary/50 transition-colors p-6 rounded-sm">
                <div className="text-primary text-xl font-bold mb-3">03 // Applied Cryptography</div>
                <h3 className="font-bold text-fg text-base mb-2">Privacy & Zero-Knowledge</h3>
                <p className="text-xs text-muted-fg leading-relaxed mb-4">
                  Researching elliptic curves, lattice-based post-quantum algorithms, SNARKs, and secure multiparty computation (MPC).
                </p>
                <div className="border-t border-borderc/60 pt-3 text-[11px] text-muted-fg space-y-1">
                  <div><strong>Tooling:</strong> SageMath, Circom, Rust Crypto, Arkworks</div>
                  <div><strong>Focus:</strong> ZK-Rollups, lattice attacks, side-channel analysis</div>
                </div>
              </div>
            </div>

            {/* Specialization Roadmap Details */}
            <div className="bg-card/60 border border-borderc rounded-sm p-6 md:p-8 font-mono">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span>//</span> 12-Week Cadet Roadmap (Cybersecurity)
              </h3>
              <div className="grid md:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-bg/60 border border-borderc/60 rounded">
                  <span className="text-accent font-bold">WEEKS 1–3</span>
                  <h4 className="font-bold text-fg mt-1 mb-2">Linux & Web Defense</h4>
                  <p className="text-muted-fg leading-relaxed">Shell navigation, HTTP internals, SQLi, XSS, SSRF, Burp Suite.</p>
                </div>
                <div className="p-4 bg-bg/60 border border-borderc/60 rounded">
                  <span className="text-accent font-bold">WEEKS 4–6</span>
                  <h4 className="font-bold text-fg mt-1 mb-2">Crypto & Forensics</h4>
                  <p className="text-muted-fg leading-relaxed">Classic & RSA attacks, Wireshark packet dumps, Volatility memory analysis.</p>
                </div>
                <div className="p-4 bg-bg/60 border border-borderc/60 rounded">
                  <span className="text-accent font-bold">WEEKS 7–9</span>
                  <h4 className="font-bold text-fg mt-1 mb-2">Assembly & Reversing</h4>
                  <p className="text-muted-fg leading-relaxed">x86-64 calling conventions, Ghidra decompilation, cracking binaries.</p>
                </div>
                <div className="p-4 bg-bg/60 border border-borderc/60 rounded">
                  <span className="text-accent font-bold">WEEKS 10–12</span>
                  <h4 className="font-bold text-fg mt-1 mb-2">Binary Exploitation</h4>
                  <p className="text-muted-fg leading-relaxed">Stack buffer overflows, shellcoding, ret2libc, DEP/ASLR bypass.</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="opensource"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="grid md:grid-cols-3 gap-6 font-mono">
              <div className="bg-card border border-borderc hover:border-accent/50 transition-colors p-6 rounded-sm">
                <div className="text-accent text-xl font-bold mb-3">01 // Systems & Kernel</div>
                <h3 className="font-bold text-fg text-base mb-2">Rust & Linux Subsystems</h3>
                <p className="text-xs text-muted-fg leading-relaxed mb-4">
                  Building device drivers, async network runtimes, memory-safe OS modules, and shipping upstream patches to Linux & Rust.
                </p>
                <div className="border-t border-borderc/60 pt-3 text-[11px] text-muted-fg space-y-1">
                  <div><strong>Languages:</strong> Rust, C, Modern C++20, eBPF</div>
                  <div><strong>Targets:</strong> Linux Kernel, Tokio async, WebAssembly</div>
                </div>
              </div>

              <div className="bg-card border border-borderc hover:border-accent/50 transition-colors p-6 rounded-sm">
                <div className="text-accent text-xl font-bold mb-3">02 // Developer Tooling</div>
                <h3 className="font-bold text-fg text-base mb-2">CLI & Security Scanners</h3>
                <p className="text-xs text-muted-fg leading-relaxed mb-4">
                  Creating open source frameworks (VulnScan, BruteForge, NullTrace) used by thousands of security practitioners worldwide.
                </p>
                <div className="border-t border-borderc/60 pt-3 text-[11px] text-muted-fg space-y-1">
                  <div><strong>Ecosystem:</strong> Go, Python, Clap CLI, Rayon</div>
                  <div><strong>License:</strong> 100% Free & Open Source (MIT/Apache-2.0)</div>
                </div>
              </div>

              <div className="bg-card border border-borderc hover:border-accent/50 transition-colors p-6 rounded-sm">
                <div className="text-accent text-xl font-bold mb-3">03 // Distributed Infrastructure</div>
                <h3 className="font-bold text-fg text-base mb-2">P2P & Cloud Native</h3>
                <p className="text-xs text-muted-fg leading-relaxed mb-4">
                  Architecting resilient microservices, decentralized storage over IPFS, container orchestration, and WebAssembly runtimes.
                </p>
                <div className="border-t border-borderc/60 pt-3 text-[11px] text-muted-fg space-y-1">
                  <div><strong>Stack:</strong> Docker, Kubernetes, Libp2p, gRPC</div>
                  <div><strong>Focus:</strong> Fault tolerance, consensus, distributed caching</div>
                </div>
              </div>
            </div>

            {/* Specialization Roadmap Details */}
            <div className="bg-card/60 border border-borderc rounded-sm p-6 md:p-8 font-mono">
              <h3 className="text-lg font-bold text-accent mb-4 flex items-center gap-2">
                <span>//</span> 12-Week Cadet Roadmap (Systems & FOSS)
              </h3>
              <div className="grid md:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-bg/60 border border-borderc/60 rounded">
                  <span className="text-primary font-bold">WEEKS 1–3</span>
                  <h4 className="font-bold text-fg mt-1 mb-2">Git & C Fundamentals</h4>
                  <p className="text-muted-fg leading-relaxed">Git workflows, rebasing, pointers, memory models, POSIX APIs.</p>
                </div>
                <div className="p-4 bg-bg/60 border border-borderc/60 rounded">
                  <span className="text-primary font-bold">WEEKS 4–6</span>
                  <h4 className="font-bold text-fg mt-1 mb-2">Modern Rust</h4>
                  <p className="text-muted-fg leading-relaxed">Borrow checker, ownership, lifetimes, cargo, safe concurrency.</p>
                </div>
                <div className="p-4 bg-bg/60 border border-borderc/60 rounded">
                  <span className="text-primary font-bold">WEEKS 7–9</span>
                  <h4 className="font-bold text-fg mt-1 mb-2">Network & Async</h4>
                  <p className="text-muted-fg leading-relaxed">Tokio runtime, TCP/UDP sockets, writing high-throughput servers.</p>
                </div>
                <div className="p-4 bg-bg/60 border border-borderc/60 rounded">
                  <span className="text-primary font-bold">WEEKS 10–12</span>
                  <h4 className="font-bold text-fg mt-1 mb-2">Upstream Contributions</h4>
                  <p className="text-muted-fg leading-relaxed">Contributing to large repos, RFC writing, review etiquette, kernel patches.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Call to action */}
        <div className="mt-16 text-center border-t border-borderc pt-12">
          <p className="font-mono text-sm text-muted-fg mb-6">
            Ready to dive deep into a specialization track at NIT Rourkela?
          </p>
          <div className="flex justify-center">
            <ShinyButton
              label="JOIN OPENCODE"
              onClick={onJoinClick}
              accentColor="#00ff41"
              accentSoftColor="#80ff9f"
              fillColor="#041207"
              labelColor="#00ff41"
              cornerRadius={24}
              sweepDuration={2.6}
              arcWidth={7}
              className="!py-3.5 !px-8 font-mono text-sm font-bold shadow-[0_0_20px_rgba(0,255,65,0.22)] hover:shadow-[0_0_35px_rgba(0,255,65,0.45)] transition-shadow cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
