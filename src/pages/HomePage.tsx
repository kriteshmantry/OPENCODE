import Hero from '../components/Hero'
import About from '../components/About'
import Timeline from '../components/Timeline'
import ContributionTracker from '../components/ContributionTracker'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

interface HomePageProps {
  onJoinClick: () => void
}

export default function HomePage({ onJoinClick }: HomePageProps) {
  return (
    <>
      <Hero onJoinClick={onJoinClick} />

      {/* Quick Navigation Portal Cards to Dedicated Tabs */}
      <section className="py-10 px-6 max-w-6xl mx-auto -mt-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/domains"
            className="group p-5 bg-card/80 backdrop-blur border border-borderc hover:border-primary/60 transition-all rounded-sm flex items-center justify-between"
          >
            <div>
              <span className="font-mono text-[11px] text-accent uppercase tracking-widest block mb-1">
                // Track Syllabi
              </span>
              <h3 className="font-mono text-base font-bold text-fg group-hover:text-primary transition-colors">
                Dual Domains &rarr;
              </h3>
              <p className="text-xs text-muted-fg mt-1">Systems, kernel, binary pwn & crypto</p>
            </div>
            <span className="w-8 h-8 rounded border border-borderc group-hover:border-primary/50 group-hover:bg-primary/10 flex items-center justify-center font-mono text-primary text-sm transition-all">
              🛡️
            </span>
          </Link>

          <Link
            to="/events"
            className="group p-5 bg-card/80 backdrop-blur border border-borderc hover:border-primary/60 transition-all rounded-sm flex items-center justify-between"
          >
            <div>
              <span className="font-mono text-[11px] text-accent uppercase tracking-widest block mb-1">
                // Upcoming Schedule
              </span>
              <h3 className="font-mono text-base font-bold text-fg group-hover:text-primary transition-colors">
                Events & Workshops &rarr;
              </h3>
              <p className="text-xs text-muted-fg mt-1">NullCTF 2026, Reverse Engineering 101</p>
            </div>
            <span className="w-8 h-8 rounded border border-borderc group-hover:border-primary/50 group-hover:bg-primary/10 flex items-center justify-center font-mono text-primary text-sm transition-all">
              ⚡
            </span>
          </Link>

          <Link
            to="/team"
            className="group p-5 bg-card/80 backdrop-blur border border-borderc hover:border-primary/60 transition-all rounded-sm flex items-center justify-between"
          >
            <div>
              <span className="font-mono text-[11px] text-accent uppercase tracking-widest block mb-1">
                // Core Collective
              </span>
              <h3 className="font-mono text-base font-bold text-fg group-hover:text-primary transition-colors">
                Team & Advisors &rarr;
              </h3>
              <p className="text-xs text-muted-fg mt-1">Faculty mentors, CTF leads & hackers</p>
            </div>
            <span className="w-8 h-8 rounded border border-borderc group-hover:border-primary/50 group-hover:bg-primary/10 flex items-center justify-center font-mono text-primary text-sm transition-all">
              👥
            </span>
          </Link>
        </div>
      </section>

      <About />
      <Timeline />
      <ContributionTracker />
    </>
  )
}
