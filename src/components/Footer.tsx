import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import OpenCodeLogo from './OpenCodeLogo'

interface Props {
  onOpenSecurityModal: () => void
  onOpenTerminal: () => void
  onOpenSearch: () => void
}

export default function Footer({ onOpenSecurityModal, onOpenTerminal, onOpenSearch }: Props) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-borderc py-16 px-6 bg-card/50 font-mono">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg border border-primary/40 bg-card p-1 flex items-center justify-center shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]">
                <OpenCodeLogo showText={false} className="w-full h-full" />
              </div>
              <div className="font-mono font-black text-primary text-xl glow-text">
                <span className="text-muted-fg">&gt;_</span>OpenCode <span className="text-muted-fg text-sm font-normal">NIT Rourkela</span>
              </div>
            </div>
            <p className="text-xs text-muted-fg leading-relaxed max-w-sm">
              Official Open Source and Cybersecurity Club of National Institute of Technology, Rourkela. Building high-impact systems software and training elite CTF competitors.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div className="text-xs text-muted-fg uppercase tracking-widest mb-4">Chapters & Links</div>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'About Us', href: '/#about', isRoute: false },
                { label: 'Specialization Domains', href: '/domains', isRoute: true },
                { label: 'Upcoming Operations', href: '/events', isRoute: true },
                { label: 'Core Team & Faculty', href: '/team', isRoute: true },
              ].map(l => (
                <li key={l.label}>
                  {l.isRoute ? (
                    <Link
                      to={l.href}
                      className="text-muted-fg hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-borderc">/</span> {l.label}
                    </Link>
                  ) : (
                    <a
                      href={l.href}
                      className="text-muted-fg hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-borderc">/</span> {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Connect & Operations */}
          <div>
            <div className="text-xs text-muted-fg uppercase tracking-widest mb-4">Operations & Comms</div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/github"
                  className="text-muted-fg hover:text-accent transition-colors flex items-center justify-between"
                >
                  <span>GitHub Org</span> <span>&rarr;</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://ctftime.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-fg hover:text-accent transition-colors flex items-center justify-between"
                >
                  <span>CTFtime Profile</span> <span>↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://nitrkl.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-fg hover:text-accent transition-colors flex items-center justify-between"
                >
                  <span>NIT Rourkela Main</span> <span>↗</span>
                </a>
              </li>
              <li className="pt-2 border-t border-borderc/60">
                <button
                  onClick={onOpenSecurityModal}
                  className="text-primary hover:underline flex items-center gap-1 cursor-pointer text-xs"
                >
                  <span>🛡️</span> security.txt & Disclosure
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSearch}
                  className="text-accent hover:underline flex items-center gap-1 cursor-pointer text-xs"
                >
                  <span>🔍</span> Command Palette (Ctrl+K)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-borderc flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <span className="text-muted-fg">
            © {year} OpenCode — National Institute of Technology, Rourkela.
          </span>

          <div className="flex items-center gap-5">
            <Link
              to="/github"
              className="text-muted-fg hover:text-primary flex items-center gap-1.5 transition-colors"
            >
              <GithubIcon />
              github portal
            </Link>
            <span className="text-muted-fg/40">|</span>
            <button
              onClick={onOpenTerminal}
              className="text-muted-fg/60 hover:text-primary transition-colors cursor-pointer text-[11px]"
            >
              Terminal
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}


function GithubIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}
