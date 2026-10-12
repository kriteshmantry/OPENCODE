import { useState } from 'react'
import { motion } from 'framer-motion'
import DecryptText from '../components/DecryptText'
import { Link } from 'react-router-dom'

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
    track: 'Cybersecurity',
    specialty: 'Binary exploitation, kernel pwn, CTF strategy',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&auto=format',
    github: 'r00t_k1ng',
    cves: 3,
  },
  {
    handle: 'n3tw0rk_b',
    name: 'Ben Nakamura',
    role: 'Vice President & Open Source Track Lead',
    track: 'Open Source',
    specialty: 'Rust compiler contributor, Linux networking, systems',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&auto=format',
    github: 'n3tw0rk_b',
    cves: 0,
  },
  {
    handle: '0xAl1ce',
    name: 'Alice Marchetti',
    role: 'CTF Captain & Malware Analysis Lead',
    track: 'Cybersecurity',
    specialty: 'Reverse engineering, threat intel, Ghidra mastery',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&auto=format',
    github: '0xAl1ce',
    cves: 1,
  },
  {
    handle: 'cr4ckm3',
    name: 'Dara Okonkwo',
    role: 'Applied Cryptography & Privacy Lead',
    track: 'Cybersecurity',
    specialty: 'Custom cipher analysis, ZKP research, CTF top-10',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=120&h=120&fit=crop&auto=format',
    github: 'cr4ckm3',
    cves: 2,
  },
  {
    handle: 'gh0stwr1tr',
    name: 'Santiago Reyes',
    role: 'Web Application Security Lead',
    track: 'Cybersecurity',
    specialty: 'SSRF, prototype pollution, auth bypass, bounty hunting',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&auto=format',
    github: 'gh0stwr1tr',
    cves: 0,
  },
  {
    handle: 'k3rn3l_d',
    name: 'Yuki Tanaka',
    role: 'Linux Subsystems & Drivers Lead',
    track: 'Open Source',
    specialty: 'Upstream Linux kernel contributor, eBPF telemetry, C',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
    github: 'k3rn3l_d',
    cves: 1,
  },
]

export default function TeamPage() {
  const [filter, setFilter] = useState<'All' | 'Cybersecurity' | 'Open Source'>('All')

  const filteredTeam = filter === 'All' ? TEAM : TEAM.filter(m => m.track === filter)

  return (
    <div className="pt-24 pb-28 px-6 min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Link to="/" className="font-mono text-xs text-muted-fg hover:text-primary transition-colors">
            &larr; Return to Home
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-borderc pb-10">
          <div>
            <p className="font-mono text-xs text-accent uppercase tracking-[0.2em] mb-3">
              // COMMAND HIERARCHY
            </p>
            <DecryptText
              text="Core Team & Advisors."
              tag="h1"
              className="font-mono text-4xl md:text-5xl lg:text-6xl font-black text-fg tracking-tight"
              delay={80}
            />
            <p className="font-mono text-muted-fg text-sm mt-3 max-w-2xl leading-relaxed">
              Student maintainers, kernel patchers, CTF captains, and faculty mentors guiding the next generation of engineers at NIT Rourkela.
            </p>
          </div>

          {/* Track Filter */}
          <div className="flex border border-borderc rounded p-1 bg-card self-start md:self-auto">
            {(['All', 'Cybersecurity', 'Open Source'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 font-mono text-xs rounded transition-colors cursor-pointer ${
                  filter === tab
                    ? 'bg-primary text-bg font-bold shadow-[0_0_12px_rgba(0,255,65,0.3)]'
                    : 'text-muted-fg hover:text-fg'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Faculty Advisor Section */}
        <div className="bg-card border border-borderc p-6 md:p-8 rounded-sm mb-12 flex flex-col md:flex-row items-center gap-6">
          <img
            src={FACULTY_ADVISOR.avatar}
            alt={FACULTY_ADVISOR.name}
            className="w-24 h-24 rounded-full border-2 border-accent object-cover flex-shrink-0"
          />
          <div>
            <span className="font-mono text-xs text-accent uppercase tracking-widest block mb-1">
              // Faculty Mentorship
            </span>
            <h3 className="font-mono text-xl md:text-2xl font-bold text-fg">
              {FACULTY_ADVISOR.name}
            </h3>
            <p className="font-mono text-xs text-primary font-semibold mt-1">
              {FACULTY_ADVISOR.designation} &middot; {FACULTY_ADVISOR.dept}
            </p>
            <p className="text-xs text-muted-fg mt-2 max-w-3xl leading-relaxed">
              {FACULTY_ADVISOR.institute} &mdash; Guiding research in {FACULTY_ADVISOR.specialty}.
            </p>
          </div>
        </div>

        {/* Core Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
          {filteredTeam.map(member => (
            <motion.div
              key={member.handle}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-card border border-borderc hover:border-primary/50 transition-all rounded-sm p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded border border-borderc object-cover group-hover:border-primary transition-colors"
                  />
                  <div className="text-right">
                    <span className="text-xs text-primary font-bold block">@{member.handle}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border inline-block mt-1 ${
                        member.track === 'Cybersecurity'
                          ? 'border-primary/30 text-primary bg-primary/10'
                          : 'border-accent/30 text-accent bg-accent/10'
                      }`}
                    >
                      {member.track}
                    </span>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-fg group-hover:text-primary transition-colors">
                  {member.name}
                </h4>
                <p className="text-xs text-accent font-medium mb-3">{member.role}</p>
                <p className="text-xs text-muted-fg leading-relaxed mb-4">{member.specialty}</p>
              </div>

              <div className="border-t border-borderc/60 pt-3 flex items-center justify-between text-xs text-muted-fg">
                {member.cves > 0 ? (
                  <span className="text-warning text-[11px] font-semibold">
                    🛡️ {member.cves} CVEs assigned
                  </span>
                ) : (
                  <span className="text-accent text-[11px] font-semibold">
                    🌐 Core Maintainer
                  </span>
                )}
                <a
                  href={`https://github.com/${member.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  github ↗
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
