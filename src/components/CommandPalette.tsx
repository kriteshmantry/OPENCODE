import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface PaletteItem {
  id: string
  title: string
  category: 'Navigation' | 'Projects' | 'Events' | 'Resources' | 'Actions'
  subtitle?: string
  shortcut?: string
  action: () => void
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onOpenJoinModal: () => void
  onOpenSubmitProjectModal: () => void
  onOpenTerminal: () => void
  onOpenSecurityModal: () => void
  onToggleTheme: () => void
}

export default function CommandPalette({
  isOpen,
  onClose,
  onOpenJoinModal,
  onOpenSubmitProjectModal,
  onOpenTerminal,
  onOpenSecurityModal,
  onToggleTheme,
}: Props) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const ITEMS: PaletteItem[] = [
    // Actions
    {
      id: 'act-join',
      title: 'Apply for Club Membership ($ join --apply)',
      category: 'Actions',
      subtitle: 'Submit candidate recruitment application for NIT Rourkela chapter',
      shortcut: '↵',
      action: () => {
        onClose()
        onOpenJoinModal()
      },
    },
    {
      id: 'act-submit-proj',
      title: 'Submit an Open Source Project',
      category: 'Actions',
      subtitle: 'Add tool/project to OpenCode repository catalog',
      action: () => {
        onClose()
        onOpenSubmitProjectModal()
      },
    },
    {
      id: 'act-term',
      title: 'Launch Interactive Club Terminal',
      category: 'Actions',
      subtitle: 'Run hacker-console commands, CTF flags, and diagnostics',
      shortcut: '↑↑↓↓←→←→BA',
      action: () => {
        onClose()
        onOpenTerminal()
      },
    },
    {
      id: 'act-sec',
      title: 'Responsible Disclosure & security.txt Policy',
      category: 'Actions',
      subtitle: 'RFC 9116 security policy, PGP keys, and vulnerability reporting',
      action: () => {
        onClose()
        onOpenSecurityModal()
      },
    },
    {
      id: 'act-theme',
      title: 'Toggle Dark / Light Theme',
      category: 'Actions',
      subtitle: 'Switch display appearance',
      action: () => {
        onToggleTheme()
      },
    },

    // Navigation
    {
      id: 'nav-about',
      title: 'Go to About & Dual Domains',
      category: 'Navigation',
      subtitle: 'Open Source & Cybersecurity tracks at NIT Rourkela',
      action: () => {
        onClose()
        window.location.hash = '#about'
      },
    },
    {
      id: 'nav-domains',
      title: 'Go to Core Specializations & Tracks',
      category: 'Navigation',
      subtitle: 'Cybersecurity and Open Source Systems tracks',
      action: () => {
        onClose()
        window.location.hash = '#domains'
      },
    },
    {
      id: 'nav-events',
      title: 'Go to Events & Workshops',
      category: 'Navigation',
      subtitle: 'NullCTF 2026, Reverse Engineering 101, BreakIn Hackathon',
      action: () => {
        onClose()
        window.location.hash = '#events'
      },
    },
    {
      id: 'nav-ctf',
      title: 'Go to CTF & Wargame Hub',
      category: 'Navigation',
      subtitle: 'Leaderboard, challenge categories, and CTFd',
      action: () => {
        onClose()
        window.location.hash = '#ctf-hub'
      },
    },
    {
      id: 'nav-resources',
      title: 'Go to Resource Hub & Writeups',
      category: 'Navigation',
      subtitle: 'Roadmaps: Linux internals, Binary Pwn, Web Exploitation',
      action: () => {
        onClose()
        window.location.hash = '#resources'
      },
    },
    {
      id: 'nav-contrib',
      title: 'Go to Open Source Contribution Tracker',
      category: 'Navigation',
      subtitle: 'Upstream PRs, Hall of Fame, and member stats',
      action: () => {
        onClose()
        window.location.hash = '#contributions'
      },
    },
    {
      id: 'nav-team',
      title: 'Go to Team & Faculty Advisor',
      category: 'Navigation',
      subtitle: 'Core leads, domain mentors, and alumni',
      action: () => {
        onClose()
        window.location.hash = '#team'
      },
    },
  ]

  const filtered = ITEMS.filter(item => {
    const q = query.toLowerCase().trim()
    if (!q) return true
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q))
    )
  })

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => (i + 1) % (filtered.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => (i - 1 + filtered.length) % (filtered.length || 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action()
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-2xl bg-card border border-borderc rounded-sm shadow-2xl overflow-hidden font-mono"
        >
          {/* Input Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-borderc gap-3 bg-muted/30">
            <span className="text-primary font-bold text-sm">&gt;_</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                setSelectedIndex(0)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a command, search projects, roadmaps, events... (ESC to exit)"
              className="w-full bg-transparent text-fg placeholder:text-muted-fg text-sm outline-none font-mono"
            />
            <span className="text-[11px] px-1.5 py-0.5 border border-borderc rounded text-muted-fg bg-bg">
              ESC
            </span>
          </div>

          {/* Results List */}
          <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-borderc/40">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-muted-fg text-xs">
                No matching commands or resources found for &quot;{query}&quot;
              </div>
            ) : (
              filtered.map((item, index) => {
                const isSelected = index === selectedIndex
                return (
                  <button
                    key={item.id}
                    onClick={() => item.action()}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-sm flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-primary/15 text-primary border border-primary/40'
                        : 'text-fg/90 hover:bg-muted/40 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[11px] text-muted-fg uppercase tracking-wider px-1.5 py-0.5 border border-borderc rounded bg-bg flex-shrink-0">
                        {item.category}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{item.title}</div>
                        {item.subtitle && (
                          <div className="text-[11px] text-muted-fg truncate mt-0.5">
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                    {item.shortcut && (
                      <span className="text-[11px] text-muted-fg ml-3 flex-shrink-0 font-mono">
                        {item.shortcut}
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>

          {/* Footer Guide */}
          <div className="px-4 py-2 bg-muted/40 border-t border-borderc text-[11px] text-muted-fg flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>↑↓ Navigate</span>
              <span>↵ Execute</span>
              <span>ESC Close</span>
            </div>
            <span className="text-primary">NIT Rourkela Chapter</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
