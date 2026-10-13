import { useState, useEffect, useRef } from 'react'
import DecryptText from './DecryptText'
import MatrixCodeRain from './ui/matrix-code-rain'

const EVENTS = [
  { year: '2019', title: 'Club Founded', body: 'Seven students, one whiteboard, and too much caffeine. NullSec started as a CTF study group meeting in a server closet.' },
  { year: '2020', title: 'First CTF Victory', body: 'Placed 1st in PicoCTF 2020 out of 6,000+ teams. Our first flag: understanding what we were really capable of.' },
  { year: '2021', title: '50 Members, First Workshop Series', body: 'Launched 12-week "Intro to Offensive Security" curriculum, now used by five other university clubs.' },
  { year: '2022', title: 'Industry Partnerships', body: 'Signed research agreements with Crowdstrike and a regional CERT. Members gained access to real incident data for research.' },
  { year: '2023', title: 'National CTF Champions', body: 'Won CSAW CTF 2023, defeating 1,200 teams. Three members submitted CVEs before turning 21.' },
  { year: '2024', title: '12 Open-Source Tools', body: 'Released VulnScan, BruteForge, and ten more tools with 4k+ combined GitHub stars. All MIT licensed.' },
  { year: '2025', title: '200+ Members Globally', body: 'Chapters launched in Berlin, Singapore, and São Paulo. Remote mentorship program graduates 40 members per cohort.' },
  { year: '2026', title: 'BreakIn Conference', body: 'First annual security conference. 800 attendees, 24 talks, 6 workshops, and one very competitive CTF.' },
]

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeTheme, setActiveTheme] = useState<'green' | 'blue'>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') === 'blue' ? 'blue' : 'green'
    }
    return 'green'
  })

  useEffect(() => {
    const handler = () => {
      const t = document.documentElement.getAttribute('data-theme')
      setActiveTheme(t === 'blue' ? 'blue' : 'green')
    }
    handler()
    const observer = new MutationObserver(handler)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] })
    return () => observer.disconnect()
  }, [])

  const isBlue = activeTheme === 'blue'
  const primaryColor = isBlue ? '#1C6DFD' : '#00ff41'
  const accentColor = isBlue ? '#38bdf8' : '#00d4ff'
  const softColor = isBlue ? '#93c5fd' : '#80ffea'

  const emittedOperators = [
    { char: '+', tx: -30, ty: -26, rot: -30, delay: '0s', dur: '1.4s', color: primaryColor, size: '15px' },
    { char: '*', tx: 28, ty: -30, rot: 45, delay: '0.18s', dur: '1.5s', color: '#ffffff', size: '14px' },
    { char: '#', tx: -36, ty: 4, rot: -50, delay: '0.34s', dur: '1.6s', color: accentColor, size: '14px' },
    { char: '$', tx: 34, ty: 10, rot: 25, delay: '0.52s', dur: '1.45s', color: primaryColor, size: '15px' },
    { char: '%', tx: -24, ty: 30, rot: 40, delay: '0.68s', dur: '1.7s', color: softColor, size: '13px' },
    { char: '^', tx: 24, ty: 28, rot: -35, delay: '0.84s', dur: '1.5s', color: '#ffffff', size: '15px' },
    { char: '&', tx: -16, ty: -36, rot: 20, delay: '0.98s', dur: '1.6s', color: accentColor, size: '13px' },
    { char: '~', tx: 18, ty: -34, rot: -45, delay: '1.14s', dur: '1.4s', color: primaryColor, size: '16px' },
    { char: '=', tx: 38, ty: -12, rot: 15, delay: '1.28s', dur: '1.5s', color: softColor, size: '15px' },
    { char: '!', tx: -34, ty: -16, rot: -20, delay: '1.42s', dur: '1.6s', color: '#ffffff', size: '15px' },
    { char: '-', tx: 2, ty: 38, rot: 90, delay: '0.44s', dur: '1.55s', color: primaryColor, size: '16px' },
    { char: '+', tx: -2, ty: -40, rot: 45, delay: '1.08s', dur: '1.45s', color: accentColor, size: '15px' },
  ]

  const operatorGlints = [
    { char: '+', top: '5%', leftOffset: -16, color: primaryColor, delay: '0.2s', duration: '2.3s', size: '16px' },
    { char: '*', top: '13%', leftOffset: 15, color: accentColor, delay: '1.1s', duration: '2.0s', size: '14px' },
    { char: '#', top: '21%', leftOffset: -15, color: '#ffffff', delay: '0.6s', duration: '2.5s', size: '15px' },
    { char: '~', top: '30%', leftOffset: 16, color: primaryColor, delay: '1.7s', duration: '2.2s', size: '17px' },
    { char: '%', top: '39%', leftOffset: -18, color: softColor, delay: '0.4s', duration: '2.4s', size: '14px' },
    { char: '=', top: '48%', leftOffset: 15, color: accentColor, delay: '1.3s', duration: '2.1s', size: '16px' },
    { char: '^', top: '57%', leftOffset: -16, color: primaryColor, delay: '0.9s', duration: '2.3s', size: '16px' },
    { char: '&', top: '66%', leftOffset: 17, color: '#ffffff', delay: '0.1s', duration: '2.2s', size: '14px' },
    { char: '$', top: '75%', leftOffset: -15, color: primaryColor, delay: '1.5s', duration: '2.5s', size: '15px' },
    { char: '!', top: '84%', leftOffset: 14, color: accentColor, delay: '0.8s', duration: '2.0s', size: '16px' },
    { char: '-', top: '92%', leftOffset: -16, color: softColor, delay: '1.9s', duration: '2.4s', size: '17px' },
    { char: '+', top: '98%', leftOffset: 15, color: primaryColor, delay: '0.5s', duration: '2.1s', size: '15px' },
  ]

  useEffect(() => {
    let cleanup: (() => void) | undefined

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        const track = trackRef.current
        const container = containerRef.current
        if (!track || !container) return

        const items = track.querySelectorAll<HTMLElement>('.timeline-item')

        // Fade + slide each item in slowly and a little late as user scrolls
        items.forEach((el, i) => {
          const card = el.querySelector<HTMLElement>('.timeline-card')
          const dot = el.querySelector<HTMLElement>('.timeline-dot')

          if (card) {
            gsap.fromTo(
              card,
              {
                opacity: 0,
                x: i % 2 === 0 ? -60 : 60,
                scale: 0.94,
              },
              {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 1.45,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 60%',
                  toggleActions: 'play none none reverse',
                },
              }
            )
          }

          if (dot) {
            gsap.fromTo(
              dot,
              {
                scale: 0.7,
                backgroundColor: 'var(--bg)',
                borderColor: 'rgba(0, 255, 65, 0.3)',
                boxShadow: 'none',
              },
              {
                scale: 1.25,
                backgroundColor: isBlue ? '#1C6DFD' : '#00ff41',
                borderColor: '#ffffff',
                boxShadow: isBlue
                  ? '0 0 16px #1C6DFD, 0 0 32px rgba(28, 109, 253, 0.7)'
                  : '0 0 16px #00ff41, 0 0 32px rgba(0, 255, 65, 0.7)',
                duration: 0.9,
                ease: 'back.out(2)',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 60%',
                  toggleActions: 'play none none reverse',
                },
              }
            )
          }
        })

        // Glowing line scrubbing down as user scrolls
        const activeLine = container.querySelector<HTMLElement>('.timeline-sparkle-line')
        if (activeLine) {
          gsap.fromTo(
            activeLine,
            { height: '0%' },
            {
              height: '100%',
              ease: 'none',
              scrollTrigger: {
                trigger: container,
                start: 'top 60%',
                end: 'bottom 40%',
                scrub: 0.35,
              },
            }
          )
        }
      }, containerRef)

      cleanup = () => ctx.revert()
    })()

    return () => cleanup?.()
  }, [])

  return (
    <section id="timeline" className="relative py-28 px-6 bg-bg/95 overflow-hidden">
      {/* Mathematical operator emission animations */}
      <style>{`
        @keyframes line-energy-flow {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 400px;
          }
        }

        @keyframes operator-emit-particle {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.3) rotate(0deg);
          }
          20% {
            opacity: 1;
            transform: translate(calc(var(--tx) * 0.35), calc(var(--ty) * 0.35)) scale(1.3) rotate(calc(var(--rot) * 0.4));
          }
          75% {
            opacity: 0.85;
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0.6) rotate(var(--rot));
          }
        }

        @keyframes operator-glint-twinkle {
          0%, 100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.4) rotate(-15deg);
          }
          50% {
            opacity: 0.95;
            transform: translate(-50%, -50%) scale(1.35) rotate(15deg);
            filter: drop-shadow(0 0 6px currentColor) drop-shadow(0 0 12px currentColor);
          }
        }

        @keyframes emitter-core-pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 12px var(--primary), 0 0 25px rgba(var(--primary-rgb), 0.8), 0 0 40px rgba(var(--primary-rgb), 0.6);
          }
          50% {
            transform: scale(1.2);
            box-shadow: 0 0 18px #ffffff, 0 0 35px var(--primary), 0 0 55px rgba(var(--primary-rgb), 0.95);
          }
        }

        @keyframes core-symbol-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {/* Matrix Code Rain Background */}
      <MatrixCodeRain
        fontSize={14}
        speed={0.5}
        density={1.2}
        textColor={isBlue ? '#1C6DFD' : '#00FF41'}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0"
      />

      {/* Subtle vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, rgba(13,22,24,0.75) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-16 text-center">
          <p className="font-mono text-xs text-accent uppercase tracking-[0.2em] mb-4">
            // history
          </p>
          <DecryptText
            text="Seven years of breaking things."
            tag="h2"
            className="font-mono text-4xl md:text-5xl font-black text-fg"
            delay={200}
          />
        </div>

        <div ref={containerRef} className="relative">
          {/* Base Guide Track Line */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-borderc/40"
            aria-hidden="true"
          />

          {/* Active Progress Line with mathematical energy flow */}
          <div
            className="timeline-sparkle-line absolute left-1/2 -translate-x-1/2 top-0 w-[3px] rounded-full overflow-visible z-10"
            style={{
              height: '0%',
              background: isBlue
                ? 'repeating-linear-gradient(to bottom, #1C6DFD 0%, #ffffff 15%, #38bdf8 30%, #1C6DFD 50%, #ffffff 65%, #93c5fd 85%, #1C6DFD 100%)'
                : 'repeating-linear-gradient(to bottom, #00ff41 0%, #ffffff 15%, #00d4ff 30%, #00ff41 50%, #ffffff 65%, #80ffea 85%, #00ff41 100%)',
              backgroundSize: '100% 400px',
              animation: 'line-energy-flow 2.2s linear infinite',
              boxShadow: isBlue
                ? '0 0 12px rgba(28, 109, 253, 0.8), 0 0 24px rgba(56, 189, 248, 0.6)'
                : '0 0 12px rgba(0, 255, 65, 0.8), 0 0 24px rgba(0, 212, 255, 0.6)',
            }}
            aria-hidden="true"
          >
            {/* Mathematical operator glints along the line */}
            {operatorGlints.map((og, idx) => (
              <div
                key={idx}
                className="absolute pointer-events-none font-mono font-bold select-none"
                style={{
                  top: og.top,
                  left: `calc(50% + ${og.leftOffset}px)`,
                  fontSize: og.size,
                  color: og.color,
                  animation: `operator-glint-twinkle ${og.duration} ease-in-out ${og.delay} infinite`,
                  textShadow: `0 0 8px ${og.color}, 0 0 14px ${og.color}`,
                }}
              >
                {og.char}
              </div>
            ))}

            {/* Leading Point: Mathematical Operator Emitter */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none flex items-center justify-center">
              {/* Emitter Core: Pulsing Neon Orb with central operator symbol */}
              <div
                className="w-5 h-5 rounded-full bg-white flex items-center justify-center z-20"
                style={{ animation: 'emitter-core-pulse 1.4s ease-in-out infinite' }}
              >
                <span
                  className="font-mono text-[11px] font-black text-bg"
                  style={{ animation: 'core-symbol-spin 3s linear infinite' }}
                >
                  +
                </span>
              </div>

              {/* Soft outer energy bloom */}
              <div className="absolute w-12 h-12 rounded-full bg-primary/30 blur-sm pointer-events-none" />

              {/* Mathematical operators actively emitting outward from the point */}
              {emittedOperators.map((op, idx) => (
                <span
                  key={idx}
                  className="absolute font-mono font-extrabold select-none pointer-events-none"
                  style={{
                    // @ts-expect-error custom CSS properties for dynamic translation
                    '--tx': `${op.tx}px`,
                    '--ty': `${op.ty}px`,
                    '--rot': `${op.rot}deg`,
                    fontSize: op.size,
                    color: op.color,
                    textShadow: `0 0 6px ${op.color}, 0 0 12px ${op.color}`,
                    animation: `operator-emit-particle ${op.dur} cubic-bezier(0.2, 0.8, 0.4, 1) ${op.delay} infinite`,
                  }}
                >
                  {op.char}
                </span>
              ))}
            </div>
          </div>

          <div ref={trackRef} className="space-y-0">
            {EVENTS.map((ev, i) => (
              <div
                key={ev.year}
                className={`timeline-item relative flex items-start gap-8 pb-16 ${
                  i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Card */}
                <div className="w-[calc(50%-2rem)] flex-shrink-0">
                  <div className="timeline-card bg-card border border-borderc rounded-sm p-5 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(0,255,65,0.12)] transition-all group">
                    <div className="font-mono text-xs text-accent mb-2 uppercase tracking-widest flex items-center gap-2">
                      <span>{ev.year}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                    </div>
                    <h3 className="font-mono text-lg font-bold text-fg mb-2 group-hover:text-primary transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-sm text-muted-fg leading-relaxed">{ev.body}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="timeline-dot absolute left-1/2 -translate-x-1/2 top-5 w-3.5 h-3.5 rounded-full border-2 border-primary/50 bg-bg z-20 transition-colors" />

                {/* Spacer */}
                <div className="w-[calc(50%-2rem)] flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
