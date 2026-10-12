import { useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import DecryptText from '../components/DecryptText'
import EventRegisterModal, { type EventItem } from '../components/EventRegisterModal'
import { Link } from 'react-router-dom'

const EVENTS: EventItem[] = [
  {
    id: 'e2',
    type: 'Workshop',
    title: 'Binary Reverse Engineering 101 with Ghidra',
    date: 'Oct 22, 2026',
    time: '5:30 PM – 8:30 PM',
    location: 'CS Department Auditorium, NIT Rourkela',
    desc: 'Hands-on intro to binary disassembly, analyzing crackmes, understanding x86-64 stack frames, and reversing obfuscated ELF binaries.',
    prize: 'Certificate of Mastery + Skill Badges',
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

  return (
    <div className="pt-24 pb-28 px-6 min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Link to="/" className="font-mono text-xs text-muted-fg hover:text-primary transition-colors">
            &larr; Return to Home
          </Link>
        </div>

        <div className="mb-12 border-b border-borderc pb-10">
          <p className="font-mono text-xs text-accent uppercase tracking-[0.2em] mb-3">
            // NIT ROURKELA WORKSHOPS & HACKATHONS
          </p>
          <DecryptText
            text="Upcoming Operations."
            tag="h1"
            className="font-mono text-4xl md:text-5xl lg:text-6xl font-black text-fg tracking-tight"
            delay={80}
          />
          <p className="font-mono text-muted-fg text-sm mt-3 max-w-2xl leading-relaxed">
            Hackathons, kernel workshops, and tech talks organized by the OpenCode collective at NIT Rourkela.
          </p>
        </div>

        {/* Events Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 gap-6"
        >
          {EVENTS.map(event => (
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
