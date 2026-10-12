import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface EventItem {
  id: string
  type: string
  title: string
  date: string
  time: string
  location: string
  desc: string
  prize?: string | null
  badge: string
}

interface Props {
  event: EventItem | null
  isOpen: boolean
  onClose: () => void
}

export default function EventRegisterModal({ event, isOpen, onClose }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rollNo, setRollNo] = useState('')
  const [discord, setDiscord] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!isOpen || !event) return null

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      // Store locally
      const rsvp = {
        eventId: event.id,
        eventTitle: event.title,
        name,
        email,
        rollNo,
        discord,
        date: new Date().toISOString(),
      }
      const existing = JSON.parse(localStorage.getItem('opencode_rsvps') || '[]')
      localStorage.setItem('opencode_rsvps', JSON.stringify([rsvp, ...existing]))

      setLoading(false)
      setIsSubmitted(true)
    }, 600)
  }

  // Generate and download .ics calendar file
  const downloadIcs = () => {
    const startDate = '20261015T180000Z'
    const endDate = '20261017T180000Z'
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//OpenCode NIT Rourkela//Event Calendar//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title} - OpenCode NIT Rourkela`,
      `DESCRIPTION:${event.desc.replace(/\n/g, ' ')}`,
      `LOCATION:${event.location}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleClose = () => {
    setName('')
    setEmail('')
    setRollNo('')
    setDiscord('')
    setIsSubmitted(false)
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg bg-card border border-borderc rounded-sm p-6 md:p-8 relative shadow-2xl font-mono"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-borderc pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                <span className="text-xs text-accent uppercase tracking-widest">// EVENT PASS ISSUANCE</span>
              </div>
              <h2 className="text-xl font-bold text-fg mt-1">{event.title}</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-muted-fg hover:text-fg text-sm px-2 py-1 border border-borderc rounded"
            >
              [✕]
            </button>
          </div>

          {/* Event details recap */}
          <div className="p-3 bg-bg border border-borderc rounded-sm mb-6 text-xs text-muted-fg space-y-1">
            <div>📅 <strong>Schedule:</strong> {event.date} ({event.time})</div>
            <div>📍 <strong>Venue:</strong> {event.location}</div>
            {event.prize && <div className="text-warning">🏆 <strong>Prize:</strong> {event.prize}</div>}
          </div>

          {isSubmitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 mx-auto mb-4 border-2 border-primary rounded-full flex items-center justify-center text-primary text-2xl">
                ✓
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">SEAT RESERVED</h3>
              <p className="text-xs text-muted-fg mb-6 max-w-xs mx-auto leading-relaxed">
                Your registration has been logged in the event ledger. Check your email for pass credentials.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={downloadIcs}
                  className="w-full sm:w-auto px-4 py-2 border border-accent text-accent hover:bg-accent/10 rounded-sm text-xs font-bold transition-colors"
                >
                  📅 Export to iCal / Google Cal (.ics)
                </button>
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-5 py-2 bg-primary text-bg font-bold rounded-sm hover:bg-primary/90 text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-muted-fg mb-1">
                  Full Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none"
                />
              </div>

              <div>
                <label className="block text-muted-fg mb-1">
                  Email Address <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alex@nitrkl.ac.in"
                  className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-fg mb-1">Roll / Student ID</label>
                  <input
                    type="text"
                    value={rollNo}
                    onChange={e => setRollNo(e.target.value)}
                    placeholder="122CS0101"
                    className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block text-muted-fg mb-1">Discord / Matrix Handle</label>
                  <input
                    type="text"
                    value={discord}
                    onChange={e => setDiscord(e.target.value)}
                    placeholder="alex_0x"
                    className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-borderc">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-muted-fg hover:text-fg border border-borderc rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-bg font-bold rounded hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  {loading ? 'Securing Seat...' : '$ confirm --rsvp'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
