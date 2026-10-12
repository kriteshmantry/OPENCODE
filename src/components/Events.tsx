import { useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import DecryptText from './DecryptText'
import EventRegisterModal, { type EventItem } from './EventRegisterModal'

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

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [activeFilter, setActiveFilter] = useState('All')

  const filterTypes = ['All', 'CTF', 'Workshop', 'Hackathon', 'Talk']
  const filteredEvents = activeFilter === 'All' ? EVENTS : EVENTS.filter(e => e.type === activeFilter)

  return (
    <section id="events" className="py-28 px-6 bg-muted/20">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="font-mono text-xs text-accent uppercase tracking-[0.2em] mb-4">
              // NIT ROURKELA WORKSHOPS & CTFS
            </p>
            <DecryptText
              text="Upcoming Operations."
              tag="h2"
              className="font-mono text-4xl md:text-5xl font-black text-fg"
              delay={100}
            />
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap gap-2">
            {filterTypes.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`font-mono text-xs px-3 py-1.5 border rounded-sm transition-colors cursor-pointer ${
                  activeFilter === f
                    ? 'border-primary/60 bg-primary/15 text-primary'
                    : 'border-borderc text-muted-fg hover:border-fg/30 hover:text-fg'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="space-y-4"
        >
          {filteredEvents.map(ev => (
            <motion.div
              key={ev.id}
              variants={item}
              whileHover={{ x: 4 }}
              className="bg-card border border-borderc rounded-sm p-6 flex flex-col md:flex-row gap-6 hover:border-primary/25 transition-colors group"
            >
              {/* Date column */}
              <div className="md:w-44 flex-shrink-0 font-mono text-xs">
                <div className={`inline-flex px-2 py-1 border rounded-sm mb-3 ${TYPE_COLORS[ev.type]}`}>
                  {ev.type}
                </div>
                <div className="text-muted-fg leading-5">
                  <div className="text-fg font-bold">{ev.date}</div>
                  <div className="mt-1 text-[11px]">{ev.time}</div>
                  <div className="mt-1 text-[11px] text-muted-fg/80">{ev.location}</div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-mono text-xl font-bold text-fg mb-2 group-hover:text-primary transition-colors">
                  {ev.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-fg leading-relaxed mb-4">{ev.desc}</p>
                {ev.prize && (
                  <div className="font-mono text-xs text-warning font-medium flex items-center gap-1.5">
                    <span>🏆</span> {ev.prize}
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="md:flex md:flex-col md:items-end md:justify-between gap-3 flex-shrink-0">
                <span className="font-mono text-xs px-2.5 py-1 border rounded-sm text-primary border-primary/30 bg-primary/10 whitespace-nowrap">
                  {ev.badge}
                </span>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedEvent(ev)}
                  className="font-mono text-xs px-4 py-2 bg-primary text-bg font-bold rounded-sm hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  $ rsvp --now →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <EventRegisterModal
        event={selectedEvent}
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
      />
    </section>
  )
}
