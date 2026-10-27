import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitApplication, isSupabaseConfigured } from '../lib/supabase'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const ROLES = [
  'Offensive Security & CTF',
  'Reverse Engineering & Malware Analysis',
  'Tooling & Open Source Systems',
  'Cryptography & Privacy Engineering',
  'Web & Cloud Infrastructure',
  'Beginner / Student Cadet',
]

const EXPERIENCE_LEVELS = [
  'Initiate (Beginner eager to learn)',
  'Apprentice (1-2 years experience)',
  'Practitioner (Active CTF / Dev)',
  'Veteran (Industry / Advanced)',
]

export default function JoinModal({ isOpen, onClose }: Props) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [handle, setHandle] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [roleInterest, setRoleInterest] = useState(ROLES[0])
  const [experienceLevel, setExperienceLevel] = useState(EXPERIENCE_LEVELS[0])
  const [statement, setStatement] = useState('')

  const [loading, setLoading] = useState(false)
  const [submittedId, setSubmittedId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [submissionSource, setSubmissionSource] = useState<'supabase' | 'local'>('local')

  const isConfigured = isSupabaseConfigured()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !statement.trim()) {
      setErrorMsg('Please fill in all mandatory fields.')
      return
    }

    setLoading(true)
    setErrorMsg(null)

    try {
      const res = await submitApplication({
        full_name: fullName.trim(),
        email: email.trim(),
        handle: handle.trim(),
        github_url: githubUrl.trim(),
        role_interest: roleInterest,
        experience_level: experienceLevel,
        statement: statement.trim(),
      })

      if (res.success && res.id) {
        setSubmittedId(res.id)
        setSubmissionSource(res.source)
      } else {
        setErrorMsg(res.error || 'Failed to submit application.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFullName('')
    setEmail('')
    setHandle('')
    setGithubUrl('')
    setRoleInterest(ROLES[0])
    setExperienceLevel(EXPERIENCE_LEVELS[0])
    setStatement('')
    setSubmittedId(null)
    setErrorMsg(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          data-lenis-prevent
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-borderc rounded-sm p-6 md:p-8 relative shadow-2xl overscroll-contain"
          style={{ fontFamily: 'var(--font-mono, monospace)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-borderc pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-primary uppercase tracking-widest">// RECRUITMENT PROTOCOL</span>
              </div>
              <h2 className="text-2xl font-bold text-fg mt-1 font-mono">Join the Collective</h2>
            </div>
            <button
              onClick={onClose}
              className="text-muted-fg hover:text-fg font-mono text-sm px-2 py-1 border border-borderc hover:border-fg/40 rounded transition-colors"
            >
              [ESC / ✕]
            </button>
          </div>

          {/* Database indicator badge */}
          <div className="mb-6 p-2.5 bg-bg/70 border border-borderc/80 rounded flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-fg">Storage Backend:</span>
              {isConfigured ? (
                <span className="text-primary font-bold flex items-center gap-1">
                  ● Supabase Cloud (Live)
                </span>
              ) : (
                <span className="text-accent flex items-center gap-1">
                  ○ Local Demo Mode (Ready for Supabase Keys)
                </span>
              )}
            </div>
            {!isConfigured && (
              <span className="text-muted-fg text-[11px]">Check .env.example</span>
            )}
          </div>

          {submittedId ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 border-2 border-primary flex items-center justify-center text-primary text-2xl font-mono">
                ✓
              </div>
              <h3 className="text-xl font-bold text-primary mb-2 font-mono">
                TRANSMISSION RECEIVED
              </h3>
              <p className="text-muted-fg text-sm mb-6 max-w-md mx-auto leading-relaxed">
                Your application has been logged into the secure registry. The core team reviews new candidates periodically.
              </p>

              <div className="p-4 bg-bg border border-borderc rounded-sm max-w-sm mx-auto mb-6 text-left">
                <div className="text-xs text-muted-fg uppercase mb-1">Registration Ticket ID:</div>
                <div className="font-mono text-primary text-sm font-bold break-all">{submittedId}</div>
                <div className="text-xs text-muted-fg mt-2">
                  Destination: {submissionSource === 'supabase' ? 'Supabase Database' : 'Local Storage Sandbox'}
                </div>
              </div>

              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-primary text-bg font-bold text-sm rounded-sm hover:bg-primary/90 transition-colors font-mono"
              >
                Close & Return
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-500/50 text-red-400 rounded text-xs">
                  [!] ERROR: {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-fg mb-1">
                    Full Name / Handle <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-muted-fg mb-1">
                    Contact Email <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-fg mb-1">Discord / Telegram / Matrix Handle</label>
                  <input
                    type="text"
                    value={handle}
                    onChange={e => setHandle(e.target.value)}
                    placeholder="@alex_0x or alex#1337"
                    className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-muted-fg mb-1">GitHub / Portfolio URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-fg mb-1">Primary Interest Domain</label>
                  <select
                    value={roleInterest}
                    onChange={e => setRoleInterest(e.target.value)}
                    className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none transition-colors"
                  >
                    {ROLES.map(r => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-muted-fg mb-1">Experience Level</label>
                  <select
                    value={experienceLevel}
                    onChange={e => setExperienceLevel(e.target.value)}
                    className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none transition-colors"
                  >
                    {EXPERIENCE_LEVELS.map(lvl => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-muted-fg mb-1">
                  Why do you want to join? (Projects built, CTF history, or goals) <span className="text-primary">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={statement}
                  onChange={e => setStatement(e.target.value)}
                  placeholder="Tell us what you're working on, what problems excite you, and what you hope to contribute or learn..."
                  className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-borderc">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-muted-fg hover:text-fg border border-borderc rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-bg font-bold rounded hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-bg border-t-transparent rounded-full animate-spin" />
                      Encrypting & Transmitting...
                    </>
                  ) : (
                    <>
                      <span>$</span> submit --application
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
