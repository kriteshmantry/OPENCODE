import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createProject } from '../lib/supabase'
import type { Project } from '../types/database'

interface Props {
  isOpen: boolean
  onClose: () => void
  onProjectAdded: (newProj: Project) => void
}

const POPULAR_LANGS: Record<string, string> = {
  Rust: '#dea584',
  Python: '#3572A5',
  Go: '#00ADD8',
  'C++': '#f34b7d',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Solidity: '#AA6746',
  C: '#555555',
  Zig: '#ec915c',
}

export default function SubmitProjectModal({ isOpen, onClose, onProjectAdded }: Props) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [lang, setLang] = useState('Rust')
  const [url, setUrl] = useState('')
  const [stars, setStars] = useState(1)

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !desc.trim() || !url.trim()) {
      setErrorMsg('Please fill in the project name, description, and repository URL.')
      return
    }

    setLoading(true)
    setErrorMsg(null)

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    if (parsedTags.length === 0) {
      parsedTags.push('Security', 'Tool')
    }

    try {
      const res = await createProject({
        name: name.trim(),
        desc: desc.trim(),
        tags: parsedTags,
        stars: Number(stars) || 0,
        lang: lang,
        langColor: POPULAR_LANGS[lang] || '#00ff41',
        url: url.trim(),
      })

      if (res.success && res.data) {
        onProjectAdded(res.data)
        onClose()
      } else {
        setErrorMsg(res.error || 'Failed to publish project.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while creating project.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-card border border-borderc rounded-sm p-6 md:p-8 relative shadow-2xl"
          style={{ fontFamily: 'var(--font-mono, monospace)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-borderc pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                <span className="text-xs text-accent uppercase tracking-widest">// REPOSITORY INGESTION</span>
              </div>
              <h2 className="text-2xl font-bold text-fg mt-1 font-mono">Submit Club Project</h2>
            </div>
            <button
              onClick={onClose}
              className="text-muted-fg hover:text-fg font-mono text-sm px-2 py-1 border border-borderc hover:border-fg/40 rounded transition-colors"
            >
              [✕]
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-500/50 text-red-400 rounded text-xs">
                [!] {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-muted-fg mb-1">
                Project Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. ShadowDNS, PacketWarden..."
                className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-muted-fg mb-1">
                Description / Pitch <span className="text-primary">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="What does it do? Who is it for? Key security or engineering features..."
                className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-muted-fg mb-1">Primary Language</label>
                <select
                  value={lang}
                  onChange={e => setLang(e.target.value)}
                  className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none transition-colors"
                >
                  {Object.keys(POPULAR_LANGS).map(l => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-muted-fg mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="Cryptography, Network, Scanner"
                  className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-muted-fg mb-1">
                  GitHub / Repository URL <span className="text-primary">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-muted-fg mb-1">Initial Stars / Rating</label>
                <input
                  type="number"
                  min="0"
                  value={stars}
                  onChange={e => setStars(Number(e.target.value))}
                  className="w-full bg-bg border border-borderc focus:border-primary px-3 py-2 text-fg rounded outline-none transition-colors"
                />
              </div>
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
                {loading ? 'Publishing...' : '+ Publish Project'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
