import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import OpenCodeLogo from './OpenCodeLogo'

interface NavItem {
  label: string
  to: string
  isRoute: boolean
}

const NAV_LINKS: NavItem[] = [
  { label: 'Overview', to: '/', isRoute: true },
  { label: 'Domains', to: '/domains', isRoute: true },
  { label: 'Events', to: '/events', isRoute: true },
  { label: 'Team', to: '/team', isRoute: true },
  { label: 'GitHub', to: '/github', isRoute: true },
]

interface Props {
  theme: 'green' | 'blue'
  onThemeToggle: () => void
  onJoinClick?: () => void
  onOpenSearch?: () => void
}

export default function NavBar({ theme, onThemeToggle, onJoinClick, onOpenSearch }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const isTabActive = (item: NavItem) => {
    if (item.isRoute) {
      return location.pathname === item.to
    }
    return location.pathname === '/' && location.hash === item.to.replace('/', '')
  }

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
        <Link
          to="/"
          className="font-mono font-bold text-primary text-base md:text-lg tracking-tight glow-text flex items-center gap-2.5 group"
        >
          <div className="w-7 h-7 rounded-md border border-primary/40 bg-card/90 p-1 flex items-center justify-center shadow-[0_0_10px_rgba(var(--primary-rgb),0.25)] group-hover:border-primary transition-all">
            <OpenCodeLogo showText={false} className="w-full h-full" />
          </div>
          <span className="text-muted-fg font-normal text-sm">&gt;_</span>
          <span>OpenCode <span className="text-muted-fg font-normal text-xs md:text-sm">NITR</span></span>
        </Link>

        {/* Desktop tab links */}
        <ul className="hidden xl:flex items-center gap-2">
          {NAV_LINKS.map(item => {
            const active = isTabActive(item)
            return (
              <li key={item.label}>
                {item.isRoute ? (
                  <Link
                    to={item.to}
                    className={`relative font-mono text-xs px-3 py-1.5 transition-colors duration-200 flex items-center gap-1.5 ${
                      active ? 'text-primary font-bold' : 'text-muted-fg hover:text-fg hover:bg-card/60'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 bg-primary/15 border border-primary/40 shadow-[0_0_12px_rgba(var(--primary-rgb),0.25)]"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                    {active && <span className="relative w-1.5 h-1.5 bg-primary animate-pulse" />}
                    <span className="relative">{item.label}</span>
                  </Link>
                ) : (
                  <a
                    href={item.to}
                    className="font-mono text-xs px-2.5 py-1.5 text-muted-fg hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-primary transition-opacity text-[10px]">
                      /
                    </span>
                    <span>{item.label}</span>
                  </a>
                )}
              </li>
            )
          })}
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

          {/* Dual Theme Switcher in top right corner */}
          <button
            onClick={onThemeToggle}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm border border-borderc bg-card/90 hover:border-primary transition-all duration-200 font-mono text-xs cursor-pointer shadow-sm group select-none"
            title={`Active Theme: ${theme === 'green' ? 'Matrix Green (#00ff41)' : 'Cobalt Blue (#1C6DFD)'} — Click to switch theme`}
            aria-label="Switch theme"
          >
            {/* Dual color indicator pill */}
            <div className="flex items-center gap-1 bg-bg/90 px-1.5 py-0.5 border border-borderc/80">
              <span
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  theme === 'green'
                    ? 'bg-[#00ff41] shadow-[0_0_8px_#00ff41] scale-110'
                    : 'bg-[#00ff41]/25 opacity-40'
                }`}
                title="Matrix Green (#00ff41)"
              />
              <span
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  theme === 'blue'
                    ? 'bg-[#1C6DFD] shadow-[0_0_8px_#1C6DFD] scale-110'
                    : 'bg-[#1C6DFD]/25 opacity-40'
                }`}
                title="Cobalt Blue (#1C6DFD)"
              />
            </div>
            <span className="font-bold text-[11px] tracking-wider uppercase text-fg group-hover:text-primary transition-colors">
              {theme === 'green' ? 'GREEN' : 'BLUE'}
            </span>
            <span className="text-[10px] text-muted-fg hidden sm:inline border-l border-borderc/80 pl-1.5 font-normal">
              {theme === 'green' ? '#00FF41' : '#1C6DFD'}
            </span>
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
            <ul className="px-6 py-4 flex flex-col gap-3 font-mono text-xs">
              {NAV_LINKS.map(item => {
                const active = isTabActive(item)
                return (
                  <li key={item.label}>
                    {item.isRoute ? (
                      <Link
                        to={item.to}
                        className={`flex items-center gap-2 py-1 ${
                          active ? 'text-primary font-bold' : 'text-muted-fg hover:text-fg'
                        }`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="text-primary">&gt;</span> {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.to}
                        className="text-muted-fg hover:text-primary flex items-center gap-2 py-1"
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="text-muted-fg/60">/</span> {item.label}
                      </a>
                    )}
                  </li>
                )
              })}
              <li className="pt-2 border-t border-borderc flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
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
                </div>
                <button
                  onClick={() => {
                    onThemeToggle()
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded border border-borderc bg-card/80 text-fg text-xs font-mono cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: theme === 'green' ? '#00ff41' : '#1C6DFD',
                        boxShadow: theme === 'green' ? '0 0 8px #00ff41' : '0 0 8px #1C6DFD',
                      }}
                    />
                    <span>Active Theme: <strong className="uppercase text-primary">{theme}</strong></span>
                  </div>
                  <span className="text-[10px] text-muted-fg uppercase font-bold">
                    Switch to {theme === 'green' ? 'Blue' : 'Green'} ➔
                  </span>
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
