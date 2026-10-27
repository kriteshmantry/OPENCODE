import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import DomainsPage from './pages/DomainsPage'
import EventsPage from './pages/EventsPage'
import TeamPage from './pages/TeamPage'
import Footer from './components/Footer'
import TerminalOverlay from './components/TerminalOverlay'
import JoinModal from './components/JoinModal'
import CommandPalette from './components/CommandPalette'
import SecurityPolicyModal from './components/SecurityPolicyModal'
import SubmitProjectModal from './components/SubmitProjectModal'
import LoadingScreen from './components/LoadingScreen'
import GithubPage from './pages/GithubPage'
import ScrollProgress from './components/fx/ScrollProgress'
import RouteTransition from './components/fx/RouteTransition'

function ScrollToTop({ lenis }: { lenis: React.RefObject<Lenis | null> }) {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
    lenis.current?.scrollTo(0, { immediate: true })
  }, [pathname, hash, lenis])

  return null
}

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setTheme] = useState<'green' | 'blue'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('opencode_theme')
      if (saved === 'blue' || saved === 'green') return saved
    }
    return 'green'
  })
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [joinModalOpen, setJoinModalOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [securityModalOpen, setSecurityModalOpen] = useState(false)
  const [submitProjectModalOpen, setSubmitProjectModalOpen] = useState(false)
  const [konamiIdx, setKonamiIdx] = useState(0)

  const lenisRef = useRef<Lenis | null>(null)

  // Smooth inertial scrolling with reduced sensitivity (slower wheel movement)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.65, // Lower multiplier = slower, less sensitive wheel scrolling
      touchMultiplier: 1.2,
      infinite: false,
    })
    lenisRef.current = lenis

    let rafId: number
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Synchronize with GSAP ScrollTrigger
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)
        lenis.on('scroll', ScrollTrigger.update)
      })
    })

    // Smooth anchor navigation
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return
      const href = target.getAttribute('href')
      if (href && href.startsWith('#') && href.length > 1) {
        const el = document.querySelector(href)
        if (el) {
          e.preventDefault()
          lenis.scrollTo(el as HTMLElement, { offset: -60, duration: 1.6 })
        }
      }
    }
    document.addEventListener('click', handleAnchorClick)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('click', handleAnchorClick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Pause Lenis scrolling when modals are open
  const isAnyModalOpen =
    terminalOpen || joinModalOpen || commandPaletteOpen || securityModalOpen || submitProjectModalOpen
  useEffect(() => {
    if (!lenisRef.current) return
    if (isAnyModalOpen) {
      lenisRef.current.stop()
    } else {
      lenisRef.current.start()
    }
  }, [isAnyModalOpen])

  useEffect(() => {
    localStorage.setItem('opencode_theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.className = theme === 'blue' ? 'theme-blue' : 'theme-green'
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'green' ? 'blue' : 'green'))
  }, [])

  // Hidden CTF flag in console
  useEffect(() => {
    const parts = ['FLAG{h4ck_th3', '_pl4n3t_0x', 'DEADBEEF}']
    console.log(
      '%c\n  🏴 OpenCode & NullSec NIT Rourkela — Hidden CTF Flag:\n  ' + parts.join('') + '\n  Submit at CTFd / NullCTF\n',
      'color:#00ff41;font-family:monospace;font-size:13px;background:#0d1618;padding:8px 12px;border-left:3px solid #00ff41'
    )
    console.log(
      '%c  Tips:\n  - Press Ctrl+K (or Cmd+K) to open the Command Palette.\n  - Try the Konami code: ↑↑↓↓←→←→BA\n',
      'color:#00d4ff;font-family:monospace;font-size:11px'
    )
  }, [])

  // Keyboard shortcut listener for Ctrl+K / Cmd+K and Konami
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Command Palette (Ctrl+K or Cmd+K)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(prev => !prev)
        return
      }

      // Konami Code sequence
      const expected = KONAMI[konamiIdx]
      if (e.key === expected) {
        const next = konamiIdx + 1
        if (next === KONAMI.length) {
          setTerminalOpen(true)
          setKonamiIdx(0)
        } else {
          setKonamiIdx(next)
        }
      } else {
        setKonamiIdx(e.key === KONAMI[0] ? 1 : 0)
      }
    },
    [konamiIdx]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="min-h-screen bg-bg text-fg" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Dedicated Boot Loading Screen */}
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <ScrollToTop lenis={lenisRef} />
      <ScrollProgress />
      <RouteTransition />

      <NavBar
        theme={theme}
        onThemeToggle={toggleTheme}
        onJoinClick={() => setJoinModalOpen(true)}
        onOpenSearch={() => setCommandPaletteOpen(true)}
      />

      <main>
        <Routes>
          <Route path="/" element={<HomePage onJoinClick={() => setJoinModalOpen(true)} theme={theme} ready={!isLoading} />} />
          <Route path="/domains" element={<DomainsPage onJoinClick={() => setJoinModalOpen(true)} theme={theme} />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/team" element={<TeamPage onJoinClick={() => setJoinModalOpen(true)} />} />
          <Route path="/github" element={<GithubPage />} />
        </Routes>
      </main>

      <Footer
        onOpenSecurityModal={() => setSecurityModalOpen(true)}
        onOpenTerminal={() => setTerminalOpen(true)}
        onOpenSearch={() => setCommandPaletteOpen(true)}
        onJoinClick={() => setJoinModalOpen(true)}
      />

      {/* Modals & Overlays */}
      {terminalOpen && <TerminalOverlay onClose={() => setTerminalOpen(false)} />}
      <JoinModal isOpen={joinModalOpen} onClose={() => setJoinModalOpen(false)} />
      <SecurityPolicyModal isOpen={securityModalOpen} onClose={() => setSecurityModalOpen(false)} />
      <SubmitProjectModal
        isOpen={submitProjectModalOpen}
        onClose={() => setSubmitProjectModalOpen(false)}
        onProjectAdded={() => {}}
      />
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenJoinModal={() => setJoinModalOpen(true)}
        onOpenSubmitProjectModal={() => setSubmitProjectModalOpen(true)}
        onOpenTerminal={() => setTerminalOpen(true)}
        onOpenSecurityModal={() => setSecurityModalOpen(true)}
        onToggleTheme={toggleTheme}
        currentTheme={theme}
      />
    </div>
  )
}
