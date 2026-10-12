import { useState } from 'react'
import { motion } from 'framer-motion'
import DecryptText from './DecryptText'

interface LeaderboardEntry {
  rank: number
  handle: string
  points: number
  solves: number
  specialty: string
  streak: string
}

const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, handle: '0day_0mar', points: 4850, solves: 42, specialty: 'Binary Exploitation', streak: '🔥 14 days' },
  { rank: 2, handle: '0xAl1ce', points: 4620, solves: 39, specialty: 'Reverse Engineering', streak: '🔥 9 days' },
  { rank: 3, handle: 'cr4ckm3', points: 4200, solves: 36, specialty: 'Cryptography & ZKP', streak: '🔥 12 days' },
  { rank: 4, handle: 'r00t_k1ng', points: 3950, solves: 31, specialty: 'Kernel Pwn', streak: '🔥 6 days' },
  { rank: 5, handle: 'gh0stwr1tr', points: 3720, solves: 29, specialty: 'Web AppSec', streak: '🔥 8 days' },
  { rank: 6, handle: 'n3tw0rk_b', points: 3340, solves: 25, specialty: 'Forensics & OSINT', streak: '🔥 4 days' },
  { rank: 7, handle: 'cadet_shadow', points: 2890, solves: 22, specialty: 'Web & Linux', streak: '🔥 5 days' },
  { rank: 8, handle: 'cipher_wolf', points: 2410, solves: 18, specialty: 'Crypto', streak: '🔥 3 days' },
]

const CATEGORIES = [
  {
    name: 'Binary Exploitation (Pwn)',
    count: 28,
    color: '#f34b7d',
    desc: 'Stack overflows, heap feng-shui, ROP gadgets, format string bugs, shellcoding.',
  },
  {
    name: 'Reverse Engineering',
    count: 34,
    color: '#00ADD8',
    desc: 'Disassembly (x86_64, ARM, RISC-V), anti-debugging bypass, Ghidra decompilation, malware triage.',
  },
  {
    name: 'Web Exploitation',
    count: 45,
    color: '#3572A5',
    desc: 'Prototype pollution, SSRF, JWT forgery, SSTI, GraphQL introspection, race conditions.',
  },
  {
    name: 'Cryptography',
    count: 30,
    color: '#dea584',
    desc: 'RSA padding oracles, ECC discrete log, AES-CBC bit-flipping, lattice attacks, ZKPs.',
  },
  {
    name: 'Digital Forensics & OSINT',
    count: 22,
    color: '#00ff41',
    desc: 'Memory dump extraction (Volatility), PCAP traffic reconstruction, steganography, satellite metadata.',
  },
  {
    name: 'Cloud & Infrastructure',
    count: 16,
    color: '#f1e05a',
    desc: 'AWS IAM privilege escalation, Kubernetes container escapes, Docker socket abuse.',
  },
]

export default function CTFHub() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'categories'>('leaderboard')

  return (
    <section id="ctf-hub" className="py-28 px-6 bg-muted/15">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <p className="font-mono text-xs text-accent uppercase tracking-[0.2em]">
                // competitive hacking arena
              </p>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary">
                CTFtime Rating: #1 Regional
              </span>
            </div>
            <DecryptText
              text="CTF & Wargame Hub."
              tag="h2"
              className="font-mono text-4xl md:text-5xl font-black text-fg"
              delay={140}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex border border-borderc rounded-sm overflow-hidden p-0.5 bg-card">
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-3 py-1.5 font-mono text-xs rounded-sm transition-colors cursor-pointer ${
                  activeTab === 'leaderboard' ? 'bg-primary text-bg font-bold' : 'text-muted-fg hover:text-fg'
                }`}
              >
                🏆 Leaderboard
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-3 py-1.5 font-mono text-xs rounded-sm transition-colors cursor-pointer ${
                  activeTab === 'categories' ? 'bg-primary text-bg font-bold' : 'text-muted-fg hover:text-fg'
                }`}
              >
                🎯 Challenge Tracks
              </button>
            </div>

            <a
              href="https://ctftime.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 font-mono text-xs border border-primary/40 text-primary hover:bg-primary/10 rounded-sm transition-colors hidden sm:inline-flex items-center gap-1.5"
            >
              CTFd Instance ↗
            </a>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <div className="bg-card border border-borderc p-4 rounded-sm">
            <div className="font-mono text-xs text-muted-fg uppercase mb-1">Global CTF Rank</div>
            <div className="font-mono text-2xl font-bold text-primary">Top 1%</div>
          </div>
          <div className="bg-card border border-borderc p-4 rounded-sm">
            <div className="font-mono text-xs text-muted-fg uppercase mb-1">Flags Captured</div>
            <div className="font-mono text-2xl font-bold text-accent">1,420+</div>
          </div>
          <div className="bg-card border border-borderc p-4 rounded-sm">
            <div className="font-mono text-xs text-muted-fg uppercase mb-1">Active Wargamers</div>
            <div className="font-mono text-2xl font-bold text-fg">84 cadets</div>
          </div>
          <div className="bg-card border border-borderc p-4 rounded-sm">
            <div className="font-mono text-xs text-muted-fg uppercase mb-1">Published CVEs</div>
            <div className="font-mono text-2xl font-bold text-warning">12 CVEs</div>
          </div>
        </div>

        {/* Dynamic Content */}
        {activeTab === 'leaderboard' ? (
          <div className="bg-card border border-borderc rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="border-b border-borderc bg-muted/40 text-muted-fg uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-16">Rank</th>
                    <th className="py-3 px-4">Handle</th>
                    <th className="py-3 px-4">Specialization</th>
                    <th className="py-3 px-4 text-center">Solves</th>
                    <th className="py-3 px-4 text-center">Streak</th>
                    <th className="py-3 px-4 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderc/40">
                  {LEADERBOARD.map(player => (
                    <tr
                      key={player.handle}
                      className="hover:bg-muted/25 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold">
                        {player.rank === 1 ? (
                          <span className="text-yellow-400">🥇 #1</span>
                        ) : player.rank === 2 ? (
                          <span className="text-gray-300">🥈 #2</span>
                        ) : player.rank === 3 ? (
                          <span className="text-amber-600">🥉 #3</span>
                        ) : (
                          <span className="text-muted-fg">#{player.rank}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-fg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        {player.handle}
                      </td>
                      <td className="py-3.5 px-4 text-muted-fg">{player.specialty}</td>
                      <td className="py-3.5 px-4 text-center text-fg font-medium">{player.solves}</td>
                      <td className="py-3.5 px-4 text-center text-xs">{player.streak}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-primary">{player.points} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map(cat => (
              <motion.div
                key={cat.name}
                whileHover={{ y: -3 }}
                className="bg-card border border-borderc hover:border-primary/40 rounded-sm p-5 flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: cat.color }}
                    />
                    <span className="font-mono text-xs px-2 py-0.5 bg-muted/60 text-muted-fg rounded-sm">
                      {cat.count} challenges
                    </span>
                  </div>
                  <h3 className="font-mono font-bold text-fg mb-2 text-sm">{cat.name}</h3>
                  <p className="text-xs text-muted-fg leading-relaxed mb-4">{cat.desc}</p>
                </div>

                <div className="pt-3 border-t border-borderc flex items-center justify-between text-xs font-mono text-muted-fg">
                  <span>Available in Lab</span>
                  <span className="text-primary">Launch &gt;&gt;</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
