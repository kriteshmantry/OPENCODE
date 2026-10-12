import { useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import DecryptText from '../components/DecryptText'
import EventRegisterModal, { type EventItem } from '../components/EventRegisterModal'
import { Link } from 'react-router-dom'

const EVENTS: EventItem[] = [
  {
    id: 'e1',
    type: 'CTF',
    title: 'NullCTF 2026 (Flagship NITR CTF)',
    date: 'Oct 15–17, 2026',
    time: '48 hours continuous',
    location: 'Online + CS Dept Lab 401, NIT Rourkela',
    desc: 'Our annual flagship Jeopardy CTF competition. Challenges across Web, Pwn, Crypto, Forensics, and OSINT. Open to all colleges globally.',
    prize: '₹1,00,000+ Prize Pool + Schwag',
    badge: 'Registration Open',
  },
  {
    id: 'e2',
    type: 'Workshop',
    title: 'Binary Reverse Engineering 101 with Ghidra',
    date: 'Oct 22, 2026',
    time: '5:30 PM – 8:30 PM',
    location: 'CS Department Auditorium, NIT Rourkela',
    desc: 'Hands-on intro to binary disassembly, analyzing crackmes, understanding x86-64 stack frames, and reversing obfuscated ELF binaries.',
    prize: 'Certificate of Mastery + CTF Badges',
    badge: 'Free Entry',
  },
  {
    id: 'e3',
    type: 'Hackathon',
    title: 'OpenHack NITR 2026',
    date: 'Nov 1–3, 2026',
    time: '72 hours',
    location: 'TIIR Building Innovation Hub, NIT Rourkela',
    desc: 'Build open-source developer tooling, decentralized systems over IPFS, or security analyzers. Judged by industry open-source maintainers.',
    prize: '₹2,50,000 in Grants + Cloud Credits',
    badge: 'Applications Open',
  },
  {
    id: 'e4',
    type: 'Talk',
    title: 'Zero-Day Research in 2026: The State of Linux Kernel Security',
    date: 'Nov 10, 2026',
    time: '7:00 PM – 8:30 PM',
    location: 'Online Livestream + Seminar Hall 2',
    desc: 'Guest lecture from an NIT Rourkela alum working at Google Project Zero. Deep dive into automated fuzzing with syzkaller and kernel mitigations.',
    prize: null,
    badge: 'Open to All',
  },
]

const TYPE_COLORS: Record<string, string> = {
  CTF: 'text-primary border-primary/30 bg-primary/10',
  Workshop: 'text-accent border-accent/30 bg-accent/10',
  Hackathon: 'text-warning border-warning/30 bg-warning/10',
  Talk: 'text-muted-fg border-borderc bg-muted/30',
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [activeFilter, setActiveFilter] = useState('All')

  const filterTypes = ['All', 'CTF', 'Workshop', 'Hackathon', 'Talk']
  const filteredEvents = activeFilter === 'All' ? EVENTS : EVENTS.filter(e => e.type === activeFilter)

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
              // NIT ROURKELA WORKSHOPS & CTFS
            </p>
            <DecryptText
              text="Upcoming Operations."
              tag="h1"
              className="font-mono text-4xl md:text-5xl lg:text-6xl font-black text-fg tracking-tight"
              delay={80}
            />
            <p className="font-mono text-muted-fg text-sm mt-3 max-w-2xl leading-relaxed">
              Hackathons, CTF tournaments, kernel workshops, and tech talks organized by the OpenCode collective at NIT Rourkela.
            </p>
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap gap-2">
            {filterTypes.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`font-mono text-xs px-3.5 py-1.5 border rounded-sm transition-colors cursor-pointer ${
                  activeFilter === f
                    ? 'border-primary/60 bg-primary/15 text-primary font-bold'
                    : 'border-borderc text-muted-fg hover:text-fg hover:border-fg/30'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 gap-6"
        >
          {filteredEvents.map(event => (
            <motion.div
              key={event.id}
              variants={item}
              className="bg-card border border-borderc hover:border-primary/50 transition-all rounded-sm p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span
                    className={`font-mono text-xs px-2.5 py-0.5 rounded border uppercase tracking-widest ${
                      TYPE_COLORS[event.type]
                    }`}
                  >
                    {event.type}
                  </span>
                  {event.badge && (
                    <span className="font-mono text-xs text-primary flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      {event.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-mono text-xl font-bold text-fg mb-3 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm text-muted-fg leading-relaxed mb-6">{event.desc}</p>
              </div>

              <div className="border-t border-borderc/60 pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-muted-fg">
                  <div>
                    <span className="text-fg/60 block">DATE</span>
                    <span className="text-fg font-medium">{event.date}</span>
                  </div>
                  <div>
                    <span className="text-fg/60 block">TIME</span>
                    <span className="text-fg font-medium">{event.time}</span>
                  </div>
                </div>

                <div className="text-xs font-mono text-muted-fg">
                  <span className="text-fg/60 block">LOCATION</span>
                  <span className="text-fg">{event.location}</span>
                </div>

                {event.prize && (
                  <div className="text-xs font-mono text-primary font-semibold">
                    🎁 {event.prize}
                  </div>
                )}

                <button
                  onClick={() => setSelectedEvent(event)}
                  className="w-full mt-2 py-2.5 px-4 font-mono text-xs bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-bg font-bold rounded-sm transition-colors cursor-pointer"
                >
                  Register for Operation &rarr;
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal */}
        <EventRegisterModal
          isOpen={selectedEvent !== null}
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      </div>
    </div>
  )
}
