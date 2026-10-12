import { motion } from 'framer-motion'
import DecryptText from './DecryptText'

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
    cves: 2,
  },
  {
    handle: '0day_0mar',
    name: 'Omar Farouk',
    role: 'Zero-Day Research & Fuzzing Lead',
    track: 'Cybersecurity',
    specialty: 'Embedded firmware auditing, AFL++ fuzzing, CVEs',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&auto=format',
    github: '0day_0mar',
    cves: 4,
  },
  {
    handle: 'vuln_v1ctor',
    name: 'Yuki Tanaka',
    role: 'DevOps & Tooling Maintainer',
    track: 'Open Source',
    specialty: 'Distributed systems, Docker hardening, CI/CD pipelines',
    avatar: 'https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?w=120&h=120&fit=crop&auto=format',
    github: 'vuln_v1ctor',
    cves: 0,
  },
  {
    handle: 'bl4ckh4t',
    name: 'Nour El-Amin',
    role: 'Community & Event Operations Lead',
    track: 'Open Source',
    specialty: 'Workshops, hackathon logistics, cadet mentorship',
    avatar: 'https://images.unsplash.com/photo-1596566988862-7cf1d0b33c21?w=120&h=120&fit=crop&auto=format',
    github: 'bl4ckh4t',
    cves: 0,
  },
]

export default function Team() {
  return (
    <section id="team" className="py-28 px-6 bg-muted/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-14">
          <p className="font-mono text-xs text-accent uppercase tracking-[0.2em] mb-4">
            // LEADERSHIP & ADVISORY
          </p>
          <DecryptText
            text="Core Team & Mentors."
            tag="h2"
            className="font-mono text-4xl md:text-5xl font-black text-fg"
            delay={150}
          />
        </div>

        {/* Faculty Advisor Highlight Card */}
        <div className="mb-14 p-6 md:p-8 bg-card border border-borderc rounded-sm shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <img
            src={FACULTY_ADVISOR.avatar}
            alt={FACULTY_ADVISOR.name}
            className="w-24 h-24 rounded-full border-2 border-primary object-cover flex-shrink-0"
          />
          <div className="flex-1 text-center md:text-left font-mono">
            <div className="text-xs text-primary uppercase tracking-widest mb-1">// Faculty Patron</div>
            <h3 className="text-xl font-bold text-fg">{FACULTY_ADVISOR.name}</h3>
            <div className="text-xs text-muted-fg mt-1">
              {FACULTY_ADVISOR.designation} • {FACULTY_ADVISOR.dept}
            </div>
            <div className="text-xs text-primary/80 mt-0.5">{FACULTY_ADVISOR.institute}</div>
            <p className="text-xs text-muted-fg mt-3 leading-relaxed">
              Research focus: <em>{FACULTY_ADVISOR.specialty}</em>. Providing academic guidance, lab resources, and research direction for OpenCode and cybersecurity initiatives.
            </p>
          </div>
        </div>

        {/* Core Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEAM.map(member => (
            <motion.div
              key={member.handle}
              whileHover={{ y: -4 }}
              className="bg-card border border-borderc rounded-sm p-5 hover:border-primary/40 transition-colors group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full border border-borderc object-cover group-hover:border-primary transition-colors"
                  />
                  <div className="text-right">
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded uppercase ${
                        member.track === 'Cybersecurity'
                          ? 'bg-primary/15 text-primary border border-primary/30'
                          : 'bg-accent/15 text-accent border border-accent/30'
                      }`}
                    >
                      {member.track}
                    </span>
                    {member.cves > 0 && (
                      <div className="font-mono text-[10px] text-warning mt-1">
                        ★ {member.cves} {member.cves === 1 ? 'CVE' : 'CVEs'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="font-mono font-bold text-fg group-hover:text-primary transition-colors text-sm">
                  {member.name}
                </div>
                <div className="font-mono text-xs text-primary/90 mb-1">@{member.handle}</div>
                <div className="font-mono text-xs text-muted-fg font-medium mb-3">{member.role}</div>
                <p className="text-xs text-muted-fg leading-relaxed mb-4">{member.specialty}</p>
              </div>

              <div className="pt-3 border-t border-borderc flex items-center justify-between text-xs font-mono text-muted-fg">
                <a
                  href={`https://github.com/${member.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary flex items-center gap-1 transition-colors"
                >
                  <span>github.com/{member.github}</span>
                  <span>↗</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
