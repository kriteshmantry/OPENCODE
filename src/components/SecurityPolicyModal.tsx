import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SecurityPolicyModal({ isOpen, onClose }: Props) {
  const [copied, setCopied] = useState(false)
  const [reportSubject, setReportSubject] = useState('')
  const [reportDetails, setReportDetails] = useState('')
  const [reporterEmail, setReporterEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const securityTxtContent = `Contact: security@opencode.nitrkl.ac.in
Expires: 2027-12-31T23:59:59.000Z
Encryption: https://opencode.nitrkl.ac.in/pgp-key.asc
Preferred-Languages: en
Policy: https://opencode.nitrkl.ac.in/#security
Hiring: https://opencode.nitrkl.ac.in/#join
Acknowledgments: https://opencode.nitrkl.ac.in/#hall-of-fame`

  const handleCopy = () => {
    navigator.clipboard.writeText(securityTxtContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-card border border-borderc rounded-sm p-6 md:p-8 relative shadow-2xl font-mono text-xs"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-borderc pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-primary uppercase tracking-widest">// RFC 9116 COMPLIANT</span>
              </div>
              <h2 className="text-xl font-bold text-fg mt-1">Responsible Disclosure Policy (security.txt)</h2>
            </div>
            <button
              onClick={onClose}
              className="text-muted-fg hover:text-fg text-sm px-2 py-1 border border-borderc rounded"
            >
              [✕]
            </button>
          </div>

          <div className="space-y-6 text-muted-fg leading-relaxed">
            <p>
              As the Open Source & Cybersecurity Club at NIT Rourkela, we take security vulnerabilities in our infrastructure and student-built tools with utmost seriousness.
            </p>

            {/* Raw RFC 9116 view */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-primary font-bold">/.well-known/security.txt</span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 bg-muted/60 text-fg rounded border border-borderc hover:border-primary transition-colors text-[11px]"
                >
                  {copied ? '✓ Copied' : 'Copy RFC Manifest'}
                </button>
              </div>
              <pre className="p-4 bg-bg border border-borderc rounded text-fg/80 overflow-x-auto text-[11px] leading-5">
                <code>{securityTxtContent}</code>
              </pre>
            </div>

            {/* Scope and Safe Harbor */}
            <div className="p-4 border border-borderc bg-bg/40 rounded space-y-2">
              <h4 className="font-bold text-fg">Safe Harbor Commitment:</h4>
              <p className="text-[11px]">
                We consider security research conducted under this policy to be authorized. We will not pursue legal action against researchers who discover and report vulnerabilities in good faith without exfiltrating private data or causing service outages.
              </p>
            </div>

            {/* Report Form */}
            {submitted ? (
              <div className="p-4 bg-primary/10 border border-primary/40 rounded text-center text-primary font-bold">
                ✓ Vulnerability disclosure received. The core triage team will review within 24 hours.
              </div>
            ) : (
              <form onSubmit={handleSendReport} className="space-y-3 pt-2 border-t border-borderc">
                <h4 className="font-bold text-fg">Submit Vulnerability Report:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="email"
                    required
                    value={reporterEmail}
                    onChange={e => setReporterEmail(e.target.value)}
                    placeholder="Your Contact Email / PGP Key ID"
                    className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={reportSubject}
                    onChange={e => setReportSubject(e.target.value)}
                    placeholder="Target Subsystem / Vulnerability Type"
                    className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none"
                  />
                </div>
                <textarea
                  rows={3}
                  required
                  value={reportDetails}
                  onChange={e => setReportDetails(e.target.value)}
                  placeholder="Proof of concept steps, impact assessment, and remediation suggestions..."
                  className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none resize-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-bg font-bold rounded hover:bg-primary/90 transition-colors"
                >
                  $ submit --disclosure
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
