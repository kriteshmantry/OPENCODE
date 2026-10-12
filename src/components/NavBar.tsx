import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Domains', href: '#domains' },
  { label: 'CTF Hub', href: '#ctf-hub' },
  { label: 'Resources', href: '#resources' },
  { label: 'Open Source', href: '#contributions' },
  { label: 'Events', href: '#events' },
  { label: 'Team', href: '#team' },
]

interface Props {
  theme: 'dark' | 'light'
  onThemeToggle: () => void
  onJoinClick?: () => void
  onOpenSearch?: () => void
}

export default function NavBar({ theme, onThemeToggle, onJoinClick, onOpenSearch }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/95 backdrop-blur-md border-b border-borderc'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="font-mono font-bold text-primary text-base md:text-lg tracking-tight glow-text flex items-center gap-2">
          <span>&gt;_</span>
          <span>OpenCode <span className="text-muted-fg font-normal text-xs md:text-sm">NITR</span></span>
        </a>

        {/* Desktop links */}
        <ul className="hidden xl:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="font-mono text-xs text-muted-fg hover:text-primary transition-colors duration-200 relative group"
              >
                <span className="absolute -left-2.5 opacity-0 group-hover:opacity-100 text-primary transition-opacity">
                  /
                </span>
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          {/* Search / Command Palette trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded border border-borderc bg-card/80 text-muted-fg hover:text-primary hover:border-primary transition-colors text-xs font-mono cursor-pointer"
            title="Search & Quick Actions (Ctrl+K)"
          >
            <span>🔍</span>
            <span className="hidden sm:inline">Search</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-muted rounded border border-borderc text-muted-fg">
              Ctrl+K
            </span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={onThemeToggle}
            className="w-8 h-8 rounded border border-borderc flex items-center justify-center text-muted-fg hover:text-primary hover:border-primary transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Join CTA */}
          <button
            onClick={onJoinClick}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 font-mono text-xs bg-primary/10 text-primary border border-primary/40 hover:bg-primary/20 transition-colors rounded-sm cursor-pointer font-bold"
          >
            <span className="text-primary">$</span> join --apply
          </button>

          {/* Mobile menu toggle */}
          <button
            className="xl:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 text-muted-fg hover:text-primary cursor-pointer"
            onClick={() => setMenuOpen(m => !m)}
            aria-label="Toggle menu"
          >
            <span className={`w-5 h-px bg-current transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`w-5 h-px bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-px bg-current transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden bg-bg/98 backdrop-blur-md border-b border-borderc overflow-hidden"
          >
            <ul className="px-6 py-4 flex flex-col gap-3.5 font-mono text-xs">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-muted-fg hover:text-primary flex items-center gap-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="text-primary">/</span> {label}
                  </a>
                </li>
              ))}
              <li className="pt-2 border-t border-borderc flex items-center justify-between">
                <button
                  className="text-primary font-bold flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    setMenuOpen(false)
                    onJoinClick?.()
                  }}
                >
                  $ join --apply
                </button>
                <button
                  className="text-accent flex items-center gap-1 cursor-pointer"
                  onClick={() => {
                    setMenuOpen(false)
                    onOpenSearch?.()
                  }}
                >
                  🔍 Search (Ctrl+K)
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
